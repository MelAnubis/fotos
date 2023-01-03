/**
 * Asset Uploaded Queue Jobs
 */
export const assetUploadedProcessorName = 'asset-uploaded';

/**
 *  Video Conversion Queue Jobs
 **/
export const mp4ConversionProcessorName = 'mp4-conversion';

/**
 * Thumbnail Generator Queue Jobs
 */
export const generateJPEGThumbnailProcessorName = 'generate-jpeg-thumbnail';
export const generateWEBPThumbnailProcessorName = 'generate-webp-thumbnail';

/**
 * Metadata Extraction Queue Jobs
 */
export const exifExtractionProcessorName = 'exif-extraction';
export const videoMetadataExtractionProcessorName = 'extract-video-metadata';
export const reverseGeocodingProcessorName = 'reverse-geocoding';

/**
 * OCR Queue Jobs
 */
 
export const ocrProcessorName = 'image-ocr';

/**
 * Machine learning Queue Jobs
 */

export enum MachineLearningJobNameEnum {
  OBJECT_DETECTION = 'detect-object',
  IMAGE_TAGGING = 'tag-image',
}

/**
 * User deletion Queue Jobs
 */
export const userDeletionProcessorName = 'user-deletion';

/**
 * Storage Template Migration Queue Jobs
 */
export const templateMigrationProcessorName = 'template-migration';
export const updateTemplateProcessorName = 'update-template';
