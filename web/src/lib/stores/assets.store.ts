import { api, AssetResponseDto, GetAssetCountByTimeBucketDto } from '@api';
import { writable } from 'svelte/store';
import { handleError } from '../utils/handle-error';

export enum BucketPosition {
  Above = 'above',
  Below = 'below',
  Visible = 'visible',
  Unknown = 'unknown',
}

export type AssetStoreOptions = GetAssetCountByTimeBucketDto;

export interface Viewport {
  width: number;
  height: number;
}

interface AssetLookup {
  bucket: AssetBucket;
  bucketIndex: number;
  assetIndex: number;
}

export class AssetBucket {
  /**
   * The DOM height of the bucket in pixel
   * This value is first estimated by the number of asset and later is corrected as the user scroll
   */
  bucketHeight!: number;
  bucketDate!: string;
  assets!: AssetResponseDto[];
  cancelToken!: AbortController | null;
  position!: BucketPosition;
}

const THUMBNAIL_HEIGHT = 235;

export class AssetStore {
  private store$ = writable(this);
  private assetToBucket: Record<string, AssetLookup> = {};

  timelineHeight = 0;
  buckets: AssetBucket[] = [];
  assets: AssetResponseDto[] = [];

  constructor(private options: AssetStoreOptions) {
    this.store$.set(this);
  }

  subscribe = this.store$.subscribe;

  async init(viewport: Viewport) {
    const { data } = await api.assetApi.getAssetCountByTimeBucket({
      getAssetCountByTimeBucketDto: { ...this.options, withoutThumbs: true },
    });

    this.buckets = data.buckets.map((bucket) => {
      const unwrappedWidth = (3 / 2) * bucket.count * THUMBNAIL_HEIGHT * (7 / 10);
      const rows = Math.ceil(unwrappedWidth / viewport.width);
      const height = rows * THUMBNAIL_HEIGHT;

      return {
        bucketDate: bucket.timeBucket,
        bucketHeight: height,
        assets: [],
        cancelToken: null,
        position: BucketPosition.Unknown,
      };
    });

    this.timelineHeight = this.buckets.reduce((acc, b) => acc + b.bucketHeight, 0);

    this.emit(false);

    let height = 0;
    for (const bucket of this.buckets) {
      if (height < viewport.height) {
        // TODO use viewport.width + wrapping in estimate
        height += bucket.bucketHeight;
        this.loadBucket(bucket.bucketDate, BucketPosition.Visible);
        continue;
      }

      break;
    }
  }

  async loadBucket(bucketDate: string, position: BucketPosition): Promise<void> {
    try {
      const bucket = this.getBucketByDate(bucketDate);
      if (!bucket) {
        return;
      }

      bucket.position = position;

      if (bucket.assets.length !== 0) {
        this.emit(false);
        return;
      }

      bucket.cancelToken = new AbortController();

      const { data: assets } = await api.assetApi.getAssetByTimeBucket(
        {
          getAssetByTimeBucketDto: {
            timeBucket: [bucketDate],
            ...this.options,
            withoutThumbs: true,
          },
        },
        { signal: bucket.cancelToken.signal },
      );

      bucket.assets = assets;
      this.emit(true);
    } catch (error) {
      handleError(error, 'Failed to load assets');
    }
  }

  cancelBucket(bucket: AssetBucket) {
    bucket.cancelToken?.abort();
  }

  updateBucket(bucketDate: string, height: number) {
    const bucket = this.getBucketByDate(bucketDate);
    if (!bucket) {
      return 0;
    }

    const delta = height - bucket.bucketHeight;
    const scrollTimeline = bucket.position == BucketPosition.Above;

    bucket.bucketHeight = height;
    bucket.position = BucketPosition.Unknown;

    this.timelineHeight += delta;

    this.emit(false);

    return scrollTimeline ? delta : 0;
  }

  getBucketByDate(bucketDate: string): AssetBucket | null {
    return this.buckets.find((bucket) => bucket.bucketDate === bucketDate) || null;
  }

  getBucketInfoForAssetId(assetId: string) {
    return this.assetToBucket[assetId] || null;
  }

  getBucketIndexByAssetId(assetId: string) {
    return this.assetToBucket[assetId]?.bucketIndex ?? null;
  }

  updateAsset(assetId: string, isFavorite: boolean) {
    const asset = this.assets.find((asset) => asset.id === assetId);
    if (!asset) {
      return;
    }

    asset.isFavorite = isFavorite;
    this.emit(false);
  }

  removeAsset(assetId: string) {
    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];
      for (let j = 0; j < bucket.assets.length; j++) {
        const asset = bucket.assets[j];
        if (asset.id !== assetId) {
          continue;
        }

        bucket.assets.splice(j, 1);
        if (bucket.assets.length === 0) {
          this.buckets.splice(i, 1);
        }

        this.emit(true);
        return;
      }
    }
  }

  async getPreviousAssetId(assetId: string): Promise<string | null> {
    const info = this.getBucketInfoForAssetId(assetId);
    if (!info) {
      return null;
    }

    const { bucket, assetIndex, bucketIndex } = info;

    if (assetIndex !== 0) {
      return bucket.assets[assetIndex - 1].id;
    }

    if (bucketIndex === 0) {
      return null;
    }

    const previousBucket = this.buckets[bucketIndex - 1];
    await this.loadBucket(previousBucket.bucketDate, BucketPosition.Unknown);
    return previousBucket.assets.at(-1)?.id || null;
  }

  async getNextAssetId(assetId: string): Promise<string | null> {
    const info = this.getBucketInfoForAssetId(assetId);
    if (!info) {
      return null;
    }

    const { bucket, assetIndex, bucketIndex } = info;

    if (assetIndex !== bucket.assets.length - 1) {
      return bucket.assets[assetIndex + 1].id;
    }

    if (bucketIndex === this.buckets.length - 1) {
      return null;
    }

    const nextBucket = this.buckets[bucketIndex + 1];
    await this.loadBucket(nextBucket.bucketDate, BucketPosition.Unknown);
    return nextBucket.assets[0]?.id || null;
  }

  private emit(recalculate: boolean) {
    if (recalculate) {
      this.assets = this.buckets.flatMap(({ assets }) => assets);

      const assetToBucket: Record<string, AssetLookup> = {};
      for (let i = 0; i < this.buckets.length; i++) {
        const bucket = this.buckets[i];
        for (let j = 0; j < bucket.assets.length; j++) {
          const asset = bucket.assets[j];
          assetToBucket[asset.id] = { bucket, bucketIndex: i, assetIndex: j };
        }
      }
      this.assetToBucket = assetToBucket;
    }

    this.store$.update(() => this);
  }
}
