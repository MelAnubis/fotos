import {
  Action,
  AssetBulkUploadCheckResult,
  AssetFileUploadResponseDto,
  addAssetsToAlbum,
  checkBulkUpload,
  createAlbum,
  defaults,
  getAllAlbums,
  getSupportedMediaTypes,
} from '@immich/sdk';
import byteSize from 'byte-size';
import { Presets, SingleBar } from 'cli-progress';
import { chunk } from 'lodash-es';
import { Stats, createReadStream } from 'node:fs';
import { stat, unlink } from 'node:fs/promises';
import os from 'node:os';
import path, { basename } from 'node:path';
import { BaseOptions, authenticate, crawl, sha1 } from 'src/utils';

const s = (count: number) => (count === 1 ? '' : 's');

// TODO figure out why `id` is missing
type AssetBulkUploadCheckResults = Array<AssetBulkUploadCheckResult & { id: string }>;
type Asset = { id: string; filepath: string };

interface UploadOptionsDto {
  recursive?: boolean;
  exclusionPatterns?: string[];
  dryRun?: boolean;
  skipHash?: boolean;
  delete?: boolean;
  album?: boolean;
  albumName?: string;
  includeHidden?: boolean;
  concurrency: number;
}

class UploadFile extends File {
  constructor(
    private filepath: string,
    private _size: number,
  ) {
    super([], basename(filepath));
  }

  get size() {
    return this._size;
  }

  stream() {
    return createReadStream(this.filepath) as any;
  }
}

export const upload = async (paths: string[], baseOptions: BaseOptions, options: UploadOptionsDto) => {
  await authenticate(baseOptions);

  const scanFiles = await scan(paths, options);
  if (scanFiles.length === 0) {
    console.log('No files found, exiting');
    return;
  }

  const { newFiles, duplicates } = await checkForDuplicates(scanFiles, options);
  const newAssets = await uploadFiles(newFiles, options);
  await updateAlbums([...newAssets, ...duplicates], options);
  await deleteFiles(newFiles, options);
};

const scan = async (pathsToCrawl: string[], options: UploadOptionsDto) => {
  const { image, video } = await getSupportedMediaTypes();

  console.log('Crawling for assets...');
  const files = await crawl({
    pathsToCrawl,
    recursive: options.recursive,
    exclusionPatterns: options.exclusionPatterns,
    includeHidden: options.includeHidden,
    extensions: [...image, ...video],
  });

  return files;
};

const checkForDuplicates = async (files: string[], { concurrency, skipHash }: UploadOptionsDto) => {
  if (skipHash) {
    console.log('Skipping hash check, assuming all files are new');
    return { newFiles: files, duplicates: [] };
  }

  const progressBar = new SingleBar(
    { format: 'Checking files | {bar} | {percentage}% | ETA: {eta}s | {value}/{total} assets' },
    Presets.shades_classic,
  );

  progressBar.start(files.length, 0);

  const newFiles: string[] = [];
  const duplicates: Asset[] = [];

  try {
    // TODO refactor into a queue
    for (const items of chunk(files, concurrency)) {
      const dto = await Promise.all(items.map(async (filepath) => ({ id: filepath, checksum: await sha1(filepath) })));
      const { results } = await checkBulkUpload({ assetBulkUploadCheckDto: { assets: dto } });

      for (const { id: filepath, assetId, action } of results as AssetBulkUploadCheckResults) {
        if (action === Action.Accept) {
          newFiles.push(filepath);
        } else {
          // rejects are always duplicates
          duplicates.push({ id: assetId as string, filepath });
        }
        progressBar.increment();
      }
    }
  } finally {
    progressBar.stop();
  }

  console.log(`Found ${newFiles.length} new files and ${duplicates.length} duplicate${s(duplicates.length)}`);

  return { newFiles, duplicates };
};

const uploadFiles = async (files: string[], { dryRun, concurrency }: UploadOptionsDto): Promise<Asset[]> => {
  if (files.length === 0) {
    console.log('All assets were already uploaded, nothing to do.');
    return [];
  }

  // Compute total size first
  let totalSize = 0;
  const statsMap = new Map<string, Stats>();
  for (const filepath of files) {
    const stats = await stat(filepath);
    statsMap.set(filepath, stats);
    totalSize += stats.size;
  }

  if (dryRun) {
    console.log(`Would have uploaded ${files.length} asset${s(files.length)} (${byteSize(totalSize)})`);
    return [];
  }

  const uploadProgress = new SingleBar(
    { format: 'Uploading assets | {bar} | {percentage}% | ETA: {eta_formatted} | {value_formatted}/{total_formatted}' },
    Presets.shades_classic,
  );
  uploadProgress.start(totalSize, 0);
  uploadProgress.update({ value_formatted: 0, total_formatted: byteSize(totalSize) });

  let duplicateCount = 0;
  let duplicateSize = 0;
  let successCount = 0;
  let successSize = 0;

  const newAssets: Asset[] = [];

  try {
    for (const items of chunk(files, concurrency)) {
      await Promise.all(
        items.map(async (filepath) => {
          const stats = statsMap.get(filepath) as Stats;
          const response = await uploadFile(filepath, stats);

          newAssets.push({ id: response.id, filepath });

          if (response.duplicate) {
            duplicateCount++;
            duplicateSize += stats.size ?? 0;
          } else {
            successCount++;
            successSize += stats.size ?? 0;
          }

          uploadProgress.update(successSize, { value_formatted: byteSize(successSize + duplicateSize) });

          return response;
        }),
      );
    }
  } finally {
    uploadProgress.stop();
  }

  console.log(`Successfully uploaded ${successCount} new asset${s(successCount)} (${byteSize(successSize)})`);
  if (duplicateCount > 0) {
    console.log(`Skipped ${duplicateCount} duplicate asset${s(duplicateCount)} (${byteSize(duplicateSize)})`);
  }
  return newAssets;
};

const uploadFile = async (input: string, stats: Stats): Promise<AssetFileUploadResponseDto> => {
  const { baseUrl, headers } = defaults;

  const assetPath = path.parse(input);
  const noExtension = path.join(assetPath.dir, assetPath.name);

  const sidecarsFiles = await Promise.all(
    // XMP sidecars can come in two filename formats. For a photo named photo.ext, the filenames are photo.ext.xmp and photo.xmp
    [`${noExtension}.xmp`, `${input}.xmp`].map(async (sidecarPath) => {
      try {
        const stats = await stat(sidecarPath);
        return new UploadFile(sidecarPath, stats.size);
      } catch {
        return false;
      }
    }),
  );

  const sidecarData = sidecarsFiles.find((file): file is UploadFile => file !== false);

  const formData = new FormData();
  formData.append('deviceAssetId', `${basename(input)}-${stats.size}`.replaceAll(/\s+/g, ''));
  formData.append('deviceId', 'CLI');
  formData.append('fileCreatedAt', stats.mtime.toISOString());
  formData.append('fileModifiedAt', stats.mtime.toISOString());
  formData.append('fileSize', String(stats.size));
  formData.append('isFavorite', 'false');
  formData.append('assetData', new UploadFile(input, stats.size));

  if (sidecarData) {
    formData.append('sidecarData', sidecarData);
  }

  const response = await fetch(`${baseUrl}/asset/upload`, {
    method: 'post',
    redirect: 'error',
    headers: headers as Record<string, string>,
    body: formData,
  });
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(await response.text());
  }

  return response.json();
};

const deleteFiles = async (files: string[], options: UploadOptionsDto): Promise<void> => {
  if (!options.delete) {
    return;
  }

  if (options.dryRun) {
    console.log(`Would now have deleted assets, but skipped due to dry run`);
    return;
  }

  console.log('Deleting assets that have been uploaded...');

  const deletionProgress = new SingleBar(
    { format: 'Deleting local assets | {bar} | {percentage}% | ETA: {eta}s | {value}/{total} assets' },
    Presets.shades_classic,
  );
  deletionProgress.start(files.length, 0);

  try {
    for (const assetBatch of chunk(files, options.concurrency)) {
      await Promise.all(assetBatch.map((input: string) => unlink(input)));
      deletionProgress.update(assetBatch.length);
    }
  } finally {
    deletionProgress.stop();
  }
};

const updateAlbums = async (assets: Asset[], options: UploadOptionsDto) => {
  if (!options.album && !options.albumName) {
    return;
  }
  const { dryRun, concurrency } = options;

  const albums = await getAllAlbums({});
  const existingAlbums = new Map(albums.map((album) => [album.albumName, album.id]));
  const newAlbums: Set<string> = new Set();
  for (const { filepath } of assets) {
    const albumName = getAlbumName(filepath, options);
    if (albumName && !existingAlbums.has(albumName)) {
      newAlbums.add(albumName);
    }
  }

  if (dryRun) {
    // TODO print asset counts for new albums
    console.log(`Would have created ${newAlbums.size} new album${s(newAlbums.size)}`);
    console.log(`Would have updated ${assets.length} asset${s(assets.length)}`);
    return;
  }

  const progressBar = new SingleBar(
    { format: 'Creating albums | {bar} | {percentage}% | ETA: {eta}s | {value}/{total} albums' },
    Presets.shades_classic,
  );
  progressBar.start(newAlbums.size, 0);

  try {
    for (const albumNames of chunk([...newAlbums], concurrency)) {
      const items = await Promise.all(
        albumNames.map((albumName: string) => createAlbum({ createAlbumDto: { albumName } })),
      );
      for (const { id, albumName } of items) {
        existingAlbums.set(albumName, id);
      }
      progressBar.increment(albumNames.length);
    }
  } finally {
    progressBar.stop();
  }

  console.log(`Successfully created ${newAlbums.size} new album${s(newAlbums.size)}`);
  console.log(`Successfully updated ${assets.length} asset${s(assets.length)}`);

  const albumToAssets = new Map<string, string[]>();
  for (const asset of assets) {
    const albumName = getAlbumName(asset.filepath, options);
    if (!albumName) {
      continue;
    }
    const albumId = existingAlbums.get(albumName);
    if (albumId) {
      if (!albumToAssets.has(albumId)) {
        albumToAssets.set(albumId, []);
      }
      albumToAssets.get(albumId)?.push(asset.id);
    }
  }

  const albumUpdateProgress = new SingleBar(
    { format: 'Adding assets to albums | {bar} | {percentage}% | ETA: {eta}s | {value}/{total} assets' },
    Presets.shades_classic,
  );
  albumUpdateProgress.start(assets.length, 0);

  try {
    for (const [albumId, assets] of albumToAssets.entries()) {
      for (const assetBatch of chunk(assets, Math.min(1000 * concurrency, 65_000))) {
        await addAssetsToAlbum({ id: albumId, bulkIdsDto: { ids: assetBatch } });
        albumUpdateProgress.increment(assetBatch.length);
      }
    }
  } finally {
    albumUpdateProgress.stop();
  }
};

const getAlbumName = (filepath: string, options: UploadOptionsDto) => {
  const folderName = os.platform() === 'win32' ? filepath.split('\\').at(-2) : filepath.split('/').at(-2);
  return options.albumName ?? folderName;
};
