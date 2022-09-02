import { writable, derived, readable } from 'svelte/store';
import lodash from 'lodash-es';
import _ from 'lodash';
import moment from 'moment';
import { api, AssetCountByTimeBucketResponseDto, AssetResponseDto } from '@api';
import { AssetGridState } from '$lib/models/asset-grid-state';
import { calculateViewportHeightByNumberOfAsset } from '$lib/utils/viewport-utils';

/**
 * The state that holds information about the asset grid
 */
export const assetGridState = writable<AssetGridState>(new AssetGridState());

function createAssetStore() {
	let currentState = new AssetGridState();
	assetGridState.subscribe((state) => {
		currentState = state;
	});

	/**
	 * Set intial state
	 * @param viewportHeight
	 * @param viewportWidth
	 * @param data
	 */
	const setInitialState = (
		viewportHeight: number,
		viewportWidth: number,
		data: AssetCountByTimeBucketResponseDto
	) => {
		assetGridState.set({
			viewportHeight,
			viewportWidth,
			timelineHeight: calculateViewportHeightByNumberOfAsset(data.totalCount, viewportWidth),
			buckets: data.buckets.map((d) => ({
				bucketDate: d.timeBucket,
				bucketHeight: calculateViewportHeightByNumberOfAsset(d.count, viewportWidth),
				assets: []
			})),
			assets: [],
			assetsGroupByDate: []
		});
	};

	/**
	 * Get all assets belong to a time bucket
	 * @param bucket time bucket in String format
	 */
	const getAssetsByBucket = async (bucket: string) => {
		try {
			const currentBucketData = currentState.buckets.find((b) => b.bucketDate === bucket);
			if (currentBucketData?.assets && currentBucketData.assets.length > 0) {
				console.log('already fetch');
				return;
			}
			const { data: assets } = await api.assetApi.getAssetByTimeBucket({
				timeBucket: [bucket]
			});

			// Update assetGridState with assets by time bucket
			assetGridState.update((state) => {
				const bucketIndex = state.buckets.findIndex((b) => b.bucketDate === bucket);
				state.buckets[bucketIndex].assets = assets;
				state.assets = lodash.flatMap(state.buckets, (b) => b.assets);
				state.assetsGroupByDate = lodash
					.chain(state.assets)
					.groupBy((a) => moment(a.createdAt).format('ddd, MMM DD YYYY'))
					.sortBy((group) => state.assets.indexOf(group[0]))
					.value();

				return state;
			});
		} catch (e) {
			console.error('Failed to get asset for bucket ', bucket);
			console.error(e);
		}
	};

	return {
		setInitialState,
		getAssetsByBucket
	};
}

export const assetStore = createAssetStore();
