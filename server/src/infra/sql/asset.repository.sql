-- NOTE: This file is auto generated by ./sql-generator

-- AssetRepository.getByDate
SELECT
  "AssetEntity"."id" AS "AssetEntity_id",
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
  "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
  "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
  "AssetEntity"."type" AS "AssetEntity_type",
  "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
  "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
  "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
  "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
  "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
  "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
  "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
  "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
  "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
  "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
  "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
  "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
  "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
  "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
  "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
  "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
  "AssetEntity"."checksum" AS "AssetEntity_checksum",
  "AssetEntity"."duration" AS "AssetEntity_duration",
  "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
  "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
  "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
  "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
  "AssetEntity"."stackId" AS "AssetEntity_stackId",
  "AssetEntity__AssetEntity_exifInfo"."assetId" AS "AssetEntity__AssetEntity_exifInfo_assetId",
  "AssetEntity__AssetEntity_exifInfo"."description" AS "AssetEntity__AssetEntity_exifInfo_description",
  "AssetEntity__AssetEntity_exifInfo"."exifImageWidth" AS "AssetEntity__AssetEntity_exifInfo_exifImageWidth",
  "AssetEntity__AssetEntity_exifInfo"."exifImageHeight" AS "AssetEntity__AssetEntity_exifInfo_exifImageHeight",
  "AssetEntity__AssetEntity_exifInfo"."fileSizeInByte" AS "AssetEntity__AssetEntity_exifInfo_fileSizeInByte",
  "AssetEntity__AssetEntity_exifInfo"."orientation" AS "AssetEntity__AssetEntity_exifInfo_orientation",
  "AssetEntity__AssetEntity_exifInfo"."dateTimeOriginal" AS "AssetEntity__AssetEntity_exifInfo_dateTimeOriginal",
  "AssetEntity__AssetEntity_exifInfo"."modifyDate" AS "AssetEntity__AssetEntity_exifInfo_modifyDate",
  "AssetEntity__AssetEntity_exifInfo"."timeZone" AS "AssetEntity__AssetEntity_exifInfo_timeZone",
  "AssetEntity__AssetEntity_exifInfo"."latitude" AS "AssetEntity__AssetEntity_exifInfo_latitude",
  "AssetEntity__AssetEntity_exifInfo"."longitude" AS "AssetEntity__AssetEntity_exifInfo_longitude",
  "AssetEntity__AssetEntity_exifInfo"."projectionType" AS "AssetEntity__AssetEntity_exifInfo_projectionType",
  "AssetEntity__AssetEntity_exifInfo"."city" AS "AssetEntity__AssetEntity_exifInfo_city",
  "AssetEntity__AssetEntity_exifInfo"."livePhotoCID" AS "AssetEntity__AssetEntity_exifInfo_livePhotoCID",
  "AssetEntity__AssetEntity_exifInfo"."autoStackId" AS "AssetEntity__AssetEntity_exifInfo_autoStackId",
  "AssetEntity__AssetEntity_exifInfo"."state" AS "AssetEntity__AssetEntity_exifInfo_state",
  "AssetEntity__AssetEntity_exifInfo"."country" AS "AssetEntity__AssetEntity_exifInfo_country",
  "AssetEntity__AssetEntity_exifInfo"."make" AS "AssetEntity__AssetEntity_exifInfo_make",
  "AssetEntity__AssetEntity_exifInfo"."model" AS "AssetEntity__AssetEntity_exifInfo_model",
  "AssetEntity__AssetEntity_exifInfo"."lensModel" AS "AssetEntity__AssetEntity_exifInfo_lensModel",
  "AssetEntity__AssetEntity_exifInfo"."fNumber" AS "AssetEntity__AssetEntity_exifInfo_fNumber",
  "AssetEntity__AssetEntity_exifInfo"."focalLength" AS "AssetEntity__AssetEntity_exifInfo_focalLength",
  "AssetEntity__AssetEntity_exifInfo"."iso" AS "AssetEntity__AssetEntity_exifInfo_iso",
  "AssetEntity__AssetEntity_exifInfo"."exposureTime" AS "AssetEntity__AssetEntity_exifInfo_exposureTime",
  "AssetEntity__AssetEntity_exifInfo"."profileDescription" AS "AssetEntity__AssetEntity_exifInfo_profileDescription",
  "AssetEntity__AssetEntity_exifInfo"."colorspace" AS "AssetEntity__AssetEntity_exifInfo_colorspace",
  "AssetEntity__AssetEntity_exifInfo"."bitsPerSample" AS "AssetEntity__AssetEntity_exifInfo_bitsPerSample",
  "AssetEntity__AssetEntity_exifInfo"."fps" AS "AssetEntity__AssetEntity_exifInfo_fps"
FROM
  "assets" "AssetEntity"
  LEFT JOIN "exif" "AssetEntity__AssetEntity_exifInfo" ON "AssetEntity__AssetEntity_exifInfo"."assetId" = "AssetEntity"."id"
WHERE
  (
    (
      ("AssetEntity"."ownerId" = $1)
      AND ("AssetEntity"."isVisible" = $2)
      AND ("AssetEntity"."isArchived" = $3)
      AND (NOT ("AssetEntity"."resizePath" IS NULL))
      AND ("AssetEntity"."fileCreatedAt" BETWEEN $4 AND $5)
    )
  )
  AND ("AssetEntity"."deletedAt" IS NULL)
ORDER BY
  "AssetEntity"."fileCreatedAt" DESC

-- AssetRepository.getByDayOfYear
SELECT
  "entity"."id" AS "entity_id",
  "entity"."deviceAssetId" AS "entity_deviceAssetId",
  "entity"."ownerId" AS "entity_ownerId",
  "entity"."libraryId" AS "entity_libraryId",
  "entity"."deviceId" AS "entity_deviceId",
  "entity"."type" AS "entity_type",
  "entity"."originalPath" AS "entity_originalPath",
  "entity"."resizePath" AS "entity_resizePath",
  "entity"."webpPath" AS "entity_webpPath",
  "entity"."thumbhash" AS "entity_thumbhash",
  "entity"."encodedVideoPath" AS "entity_encodedVideoPath",
  "entity"."createdAt" AS "entity_createdAt",
  "entity"."updatedAt" AS "entity_updatedAt",
  "entity"."deletedAt" AS "entity_deletedAt",
  "entity"."fileCreatedAt" AS "entity_fileCreatedAt",
  "entity"."localDateTime" AS "entity_localDateTime",
  "entity"."fileModifiedAt" AS "entity_fileModifiedAt",
  "entity"."isFavorite" AS "entity_isFavorite",
  "entity"."isArchived" AS "entity_isArchived",
  "entity"."isExternal" AS "entity_isExternal",
  "entity"."isReadOnly" AS "entity_isReadOnly",
  "entity"."isOffline" AS "entity_isOffline",
  "entity"."checksum" AS "entity_checksum",
  "entity"."duration" AS "entity_duration",
  "entity"."isVisible" AS "entity_isVisible",
  "entity"."livePhotoVideoId" AS "entity_livePhotoVideoId",
  "entity"."originalFileName" AS "entity_originalFileName",
  "entity"."sidecarPath" AS "entity_sidecarPath",
  "entity"."stackId" AS "entity_stackId",
  "exifInfo"."assetId" AS "exifInfo_assetId",
  "exifInfo"."description" AS "exifInfo_description",
  "exifInfo"."exifImageWidth" AS "exifInfo_exifImageWidth",
  "exifInfo"."exifImageHeight" AS "exifInfo_exifImageHeight",
  "exifInfo"."fileSizeInByte" AS "exifInfo_fileSizeInByte",
  "exifInfo"."orientation" AS "exifInfo_orientation",
  "exifInfo"."dateTimeOriginal" AS "exifInfo_dateTimeOriginal",
  "exifInfo"."modifyDate" AS "exifInfo_modifyDate",
  "exifInfo"."timeZone" AS "exifInfo_timeZone",
  "exifInfo"."latitude" AS "exifInfo_latitude",
  "exifInfo"."longitude" AS "exifInfo_longitude",
  "exifInfo"."projectionType" AS "exifInfo_projectionType",
  "exifInfo"."city" AS "exifInfo_city",
  "exifInfo"."livePhotoCID" AS "exifInfo_livePhotoCID",
  "exifInfo"."autoStackId" AS "exifInfo_autoStackId",
  "exifInfo"."state" AS "exifInfo_state",
  "exifInfo"."country" AS "exifInfo_country",
  "exifInfo"."make" AS "exifInfo_make",
  "exifInfo"."model" AS "exifInfo_model",
  "exifInfo"."lensModel" AS "exifInfo_lensModel",
  "exifInfo"."fNumber" AS "exifInfo_fNumber",
  "exifInfo"."focalLength" AS "exifInfo_focalLength",
  "exifInfo"."iso" AS "exifInfo_iso",
  "exifInfo"."exposureTime" AS "exifInfo_exposureTime",
  "exifInfo"."profileDescription" AS "exifInfo_profileDescription",
  "exifInfo"."colorspace" AS "exifInfo_colorspace",
  "exifInfo"."bitsPerSample" AS "exifInfo_bitsPerSample",
  "exifInfo"."fps" AS "exifInfo_fps"
FROM
  "assets" "entity"
  LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "entity"."id"
WHERE
  (
    "entity"."ownerId" = $1
    AND "entity"."isVisible" = true
    AND "entity"."isArchived" = false
    AND "entity"."resizePath" IS NOT NULL
    AND EXTRACT(
      DAY
      FROM
        "entity"."localDateTime" AT TIME ZONE 'UTC'
    ) = $2
    AND EXTRACT(
      MONTH
      FROM
        "entity"."localDateTime" AT TIME ZONE 'UTC'
    ) = $3
  )
  AND ("entity"."deletedAt" IS NULL)
ORDER BY
  "entity"."localDateTime" DESC

-- AssetRepository.getByIds
SELECT
  "AssetEntity"."id" AS "AssetEntity_id",
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
  "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
  "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
  "AssetEntity"."type" AS "AssetEntity_type",
  "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
  "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
  "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
  "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
  "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
  "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
  "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
  "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
  "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
  "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
  "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
  "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
  "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
  "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
  "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
  "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
  "AssetEntity"."checksum" AS "AssetEntity_checksum",
  "AssetEntity"."duration" AS "AssetEntity_duration",
  "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
  "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
  "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
  "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
  "AssetEntity"."stackId" AS "AssetEntity_stackId",
  "AssetEntity__AssetEntity_exifInfo"."assetId" AS "AssetEntity__AssetEntity_exifInfo_assetId",
  "AssetEntity__AssetEntity_exifInfo"."description" AS "AssetEntity__AssetEntity_exifInfo_description",
  "AssetEntity__AssetEntity_exifInfo"."exifImageWidth" AS "AssetEntity__AssetEntity_exifInfo_exifImageWidth",
  "AssetEntity__AssetEntity_exifInfo"."exifImageHeight" AS "AssetEntity__AssetEntity_exifInfo_exifImageHeight",
  "AssetEntity__AssetEntity_exifInfo"."fileSizeInByte" AS "AssetEntity__AssetEntity_exifInfo_fileSizeInByte",
  "AssetEntity__AssetEntity_exifInfo"."orientation" AS "AssetEntity__AssetEntity_exifInfo_orientation",
  "AssetEntity__AssetEntity_exifInfo"."dateTimeOriginal" AS "AssetEntity__AssetEntity_exifInfo_dateTimeOriginal",
  "AssetEntity__AssetEntity_exifInfo"."modifyDate" AS "AssetEntity__AssetEntity_exifInfo_modifyDate",
  "AssetEntity__AssetEntity_exifInfo"."timeZone" AS "AssetEntity__AssetEntity_exifInfo_timeZone",
  "AssetEntity__AssetEntity_exifInfo"."latitude" AS "AssetEntity__AssetEntity_exifInfo_latitude",
  "AssetEntity__AssetEntity_exifInfo"."longitude" AS "AssetEntity__AssetEntity_exifInfo_longitude",
  "AssetEntity__AssetEntity_exifInfo"."projectionType" AS "AssetEntity__AssetEntity_exifInfo_projectionType",
  "AssetEntity__AssetEntity_exifInfo"."city" AS "AssetEntity__AssetEntity_exifInfo_city",
  "AssetEntity__AssetEntity_exifInfo"."livePhotoCID" AS "AssetEntity__AssetEntity_exifInfo_livePhotoCID",
  "AssetEntity__AssetEntity_exifInfo"."autoStackId" AS "AssetEntity__AssetEntity_exifInfo_autoStackId",
  "AssetEntity__AssetEntity_exifInfo"."state" AS "AssetEntity__AssetEntity_exifInfo_state",
  "AssetEntity__AssetEntity_exifInfo"."country" AS "AssetEntity__AssetEntity_exifInfo_country",
  "AssetEntity__AssetEntity_exifInfo"."make" AS "AssetEntity__AssetEntity_exifInfo_make",
  "AssetEntity__AssetEntity_exifInfo"."model" AS "AssetEntity__AssetEntity_exifInfo_model",
  "AssetEntity__AssetEntity_exifInfo"."lensModel" AS "AssetEntity__AssetEntity_exifInfo_lensModel",
  "AssetEntity__AssetEntity_exifInfo"."fNumber" AS "AssetEntity__AssetEntity_exifInfo_fNumber",
  "AssetEntity__AssetEntity_exifInfo"."focalLength" AS "AssetEntity__AssetEntity_exifInfo_focalLength",
  "AssetEntity__AssetEntity_exifInfo"."iso" AS "AssetEntity__AssetEntity_exifInfo_iso",
  "AssetEntity__AssetEntity_exifInfo"."exposureTime" AS "AssetEntity__AssetEntity_exifInfo_exposureTime",
  "AssetEntity__AssetEntity_exifInfo"."profileDescription" AS "AssetEntity__AssetEntity_exifInfo_profileDescription",
  "AssetEntity__AssetEntity_exifInfo"."colorspace" AS "AssetEntity__AssetEntity_exifInfo_colorspace",
  "AssetEntity__AssetEntity_exifInfo"."bitsPerSample" AS "AssetEntity__AssetEntity_exifInfo_bitsPerSample",
  "AssetEntity__AssetEntity_exifInfo"."fps" AS "AssetEntity__AssetEntity_exifInfo_fps",
  "AssetEntity__AssetEntity_smartInfo"."assetId" AS "AssetEntity__AssetEntity_smartInfo_assetId",
  "AssetEntity__AssetEntity_smartInfo"."tags" AS "AssetEntity__AssetEntity_smartInfo_tags",
  "AssetEntity__AssetEntity_smartInfo"."objects" AS "AssetEntity__AssetEntity_smartInfo_objects",
  "AssetEntity__AssetEntity_tags"."id" AS "AssetEntity__AssetEntity_tags_id",
  "AssetEntity__AssetEntity_tags"."type" AS "AssetEntity__AssetEntity_tags_type",
  "AssetEntity__AssetEntity_tags"."name" AS "AssetEntity__AssetEntity_tags_name",
  "AssetEntity__AssetEntity_tags"."userId" AS "AssetEntity__AssetEntity_tags_userId",
  "AssetEntity__AssetEntity_tags"."renameTagId" AS "AssetEntity__AssetEntity_tags_renameTagId",
  "AssetEntity__AssetEntity_faces"."id" AS "AssetEntity__AssetEntity_faces_id",
  "AssetEntity__AssetEntity_faces"."assetId" AS "AssetEntity__AssetEntity_faces_assetId",
  "AssetEntity__AssetEntity_faces"."personId" AS "AssetEntity__AssetEntity_faces_personId",
  "AssetEntity__AssetEntity_faces"."imageWidth" AS "AssetEntity__AssetEntity_faces_imageWidth",
  "AssetEntity__AssetEntity_faces"."imageHeight" AS "AssetEntity__AssetEntity_faces_imageHeight",
  "AssetEntity__AssetEntity_faces"."boundingBoxX1" AS "AssetEntity__AssetEntity_faces_boundingBoxX1",
  "AssetEntity__AssetEntity_faces"."boundingBoxY1" AS "AssetEntity__AssetEntity_faces_boundingBoxY1",
  "AssetEntity__AssetEntity_faces"."boundingBoxX2" AS "AssetEntity__AssetEntity_faces_boundingBoxX2",
  "AssetEntity__AssetEntity_faces"."boundingBoxY2" AS "AssetEntity__AssetEntity_faces_boundingBoxY2",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."id" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_id",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."createdAt" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_createdAt",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."updatedAt" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_updatedAt",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."ownerId" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_ownerId",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."name" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_name",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."birthDate" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_birthDate",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."thumbnailPath" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_thumbnailPath",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."faceAssetId" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_faceAssetId",
  "8258e303a73a72cf6abb13d73fb592dde0d68280"."isHidden" AS "8258e303a73a72cf6abb13d73fb592dde0d68280_isHidden",
  "AssetEntity__AssetEntity_stack"."id" AS "AssetEntity__AssetEntity_stack_id",
  "AssetEntity__AssetEntity_stack"."primaryAssetId" AS "AssetEntity__AssetEntity_stack_primaryAssetId",
  "bd93d5747511a4dad4923546c51365bf1a803774"."id" AS "bd93d5747511a4dad4923546c51365bf1a803774_id",
  "bd93d5747511a4dad4923546c51365bf1a803774"."deviceAssetId" AS "bd93d5747511a4dad4923546c51365bf1a803774_deviceAssetId",
  "bd93d5747511a4dad4923546c51365bf1a803774"."ownerId" AS "bd93d5747511a4dad4923546c51365bf1a803774_ownerId",
  "bd93d5747511a4dad4923546c51365bf1a803774"."libraryId" AS "bd93d5747511a4dad4923546c51365bf1a803774_libraryId",
  "bd93d5747511a4dad4923546c51365bf1a803774"."deviceId" AS "bd93d5747511a4dad4923546c51365bf1a803774_deviceId",
  "bd93d5747511a4dad4923546c51365bf1a803774"."type" AS "bd93d5747511a4dad4923546c51365bf1a803774_type",
  "bd93d5747511a4dad4923546c51365bf1a803774"."originalPath" AS "bd93d5747511a4dad4923546c51365bf1a803774_originalPath",
  "bd93d5747511a4dad4923546c51365bf1a803774"."resizePath" AS "bd93d5747511a4dad4923546c51365bf1a803774_resizePath",
  "bd93d5747511a4dad4923546c51365bf1a803774"."webpPath" AS "bd93d5747511a4dad4923546c51365bf1a803774_webpPath",
  "bd93d5747511a4dad4923546c51365bf1a803774"."thumbhash" AS "bd93d5747511a4dad4923546c51365bf1a803774_thumbhash",
  "bd93d5747511a4dad4923546c51365bf1a803774"."encodedVideoPath" AS "bd93d5747511a4dad4923546c51365bf1a803774_encodedVideoPath",
  "bd93d5747511a4dad4923546c51365bf1a803774"."createdAt" AS "bd93d5747511a4dad4923546c51365bf1a803774_createdAt",
  "bd93d5747511a4dad4923546c51365bf1a803774"."updatedAt" AS "bd93d5747511a4dad4923546c51365bf1a803774_updatedAt",
  "bd93d5747511a4dad4923546c51365bf1a803774"."deletedAt" AS "bd93d5747511a4dad4923546c51365bf1a803774_deletedAt",
  "bd93d5747511a4dad4923546c51365bf1a803774"."fileCreatedAt" AS "bd93d5747511a4dad4923546c51365bf1a803774_fileCreatedAt",
  "bd93d5747511a4dad4923546c51365bf1a803774"."localDateTime" AS "bd93d5747511a4dad4923546c51365bf1a803774_localDateTime",
  "bd93d5747511a4dad4923546c51365bf1a803774"."fileModifiedAt" AS "bd93d5747511a4dad4923546c51365bf1a803774_fileModifiedAt",
  "bd93d5747511a4dad4923546c51365bf1a803774"."isFavorite" AS "bd93d5747511a4dad4923546c51365bf1a803774_isFavorite",
  "bd93d5747511a4dad4923546c51365bf1a803774"."isArchived" AS "bd93d5747511a4dad4923546c51365bf1a803774_isArchived",
  "bd93d5747511a4dad4923546c51365bf1a803774"."isExternal" AS "bd93d5747511a4dad4923546c51365bf1a803774_isExternal",
  "bd93d5747511a4dad4923546c51365bf1a803774"."isReadOnly" AS "bd93d5747511a4dad4923546c51365bf1a803774_isReadOnly",
  "bd93d5747511a4dad4923546c51365bf1a803774"."isOffline" AS "bd93d5747511a4dad4923546c51365bf1a803774_isOffline",
  "bd93d5747511a4dad4923546c51365bf1a803774"."checksum" AS "bd93d5747511a4dad4923546c51365bf1a803774_checksum",
  "bd93d5747511a4dad4923546c51365bf1a803774"."duration" AS "bd93d5747511a4dad4923546c51365bf1a803774_duration",
  "bd93d5747511a4dad4923546c51365bf1a803774"."isVisible" AS "bd93d5747511a4dad4923546c51365bf1a803774_isVisible",
  "bd93d5747511a4dad4923546c51365bf1a803774"."livePhotoVideoId" AS "bd93d5747511a4dad4923546c51365bf1a803774_livePhotoVideoId",
  "bd93d5747511a4dad4923546c51365bf1a803774"."originalFileName" AS "bd93d5747511a4dad4923546c51365bf1a803774_originalFileName",
  "bd93d5747511a4dad4923546c51365bf1a803774"."sidecarPath" AS "bd93d5747511a4dad4923546c51365bf1a803774_sidecarPath",
  "bd93d5747511a4dad4923546c51365bf1a803774"."stackId" AS "bd93d5747511a4dad4923546c51365bf1a803774_stackId"
FROM
  "assets" "AssetEntity"
  LEFT JOIN "exif" "AssetEntity__AssetEntity_exifInfo" ON "AssetEntity__AssetEntity_exifInfo"."assetId" = "AssetEntity"."id"
  LEFT JOIN "smart_info" "AssetEntity__AssetEntity_smartInfo" ON "AssetEntity__AssetEntity_smartInfo"."assetId" = "AssetEntity"."id"
  LEFT JOIN "tag_asset" "AssetEntity_AssetEntity__AssetEntity_tags" ON "AssetEntity_AssetEntity__AssetEntity_tags"."assetsId" = "AssetEntity"."id"
  LEFT JOIN "tags" "AssetEntity__AssetEntity_tags" ON "AssetEntity__AssetEntity_tags"."id" = "AssetEntity_AssetEntity__AssetEntity_tags"."tagsId"
  LEFT JOIN "asset_faces" "AssetEntity__AssetEntity_faces" ON "AssetEntity__AssetEntity_faces"."assetId" = "AssetEntity"."id"
  LEFT JOIN "person" "8258e303a73a72cf6abb13d73fb592dde0d68280" ON "8258e303a73a72cf6abb13d73fb592dde0d68280"."id" = "AssetEntity__AssetEntity_faces"."personId"
  LEFT JOIN "asset_stack" "AssetEntity__AssetEntity_stack" ON "AssetEntity__AssetEntity_stack"."id" = "AssetEntity"."stackId"
  LEFT JOIN "assets" "bd93d5747511a4dad4923546c51365bf1a803774" ON "bd93d5747511a4dad4923546c51365bf1a803774"."stackId" = "AssetEntity__AssetEntity_stack"."id"
WHERE
  (("AssetEntity"."id" IN ($1)))

-- AssetRepository.deleteAll
DELETE FROM "assets"
WHERE
  "ownerId" = $1

-- AssetRepository.getByLibraryId
SELECT
  "AssetEntity"."id" AS "AssetEntity_id",
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
  "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
  "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
  "AssetEntity"."type" AS "AssetEntity_type",
  "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
  "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
  "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
  "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
  "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
  "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
  "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
  "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
  "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
  "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
  "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
  "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
  "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
  "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
  "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
  "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
  "AssetEntity"."checksum" AS "AssetEntity_checksum",
  "AssetEntity"."duration" AS "AssetEntity_duration",
  "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
  "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
  "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
  "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
  "AssetEntity"."stackId" AS "AssetEntity_stackId"
FROM
  "assets" "AssetEntity"
  LEFT JOIN "libraries" "AssetEntity__AssetEntity_library" ON "AssetEntity__AssetEntity_library"."id" = "AssetEntity"."libraryId"
  AND (
    "AssetEntity__AssetEntity_library"."deletedAt" IS NULL
  )
WHERE
  (
    (
      (
        (("AssetEntity__AssetEntity_library"."id" IN ($1)))
      )
    )
  )
  AND ("AssetEntity"."deletedAt" IS NULL)

-- AssetRepository.getByLibraryIdAndOriginalPath
SELECT DISTINCT
  "distinctAlias"."AssetEntity_id" AS "ids_AssetEntity_id"
FROM
  (
    SELECT
      "AssetEntity"."id" AS "AssetEntity_id",
      "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
      "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
      "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
      "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
      "AssetEntity"."type" AS "AssetEntity_type",
      "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
      "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
      "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
      "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
      "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
      "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
      "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
      "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
      "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
      "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
      "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
      "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
      "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
      "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
      "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
      "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
      "AssetEntity"."checksum" AS "AssetEntity_checksum",
      "AssetEntity"."duration" AS "AssetEntity_duration",
      "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
      "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
      "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
      "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
      "AssetEntity"."stackId" AS "AssetEntity_stackId"
    FROM
      "assets" "AssetEntity"
      LEFT JOIN "libraries" "AssetEntity__AssetEntity_library" ON "AssetEntity__AssetEntity_library"."id" = "AssetEntity"."libraryId"
      AND (
        "AssetEntity__AssetEntity_library"."deletedAt" IS NULL
      )
    WHERE
      (
        (
          ((("AssetEntity__AssetEntity_library"."id" = $1)))
          AND ("AssetEntity"."originalPath" = $2)
        )
      )
      AND ("AssetEntity"."deletedAt" IS NULL)
  ) "distinctAlias"
ORDER BY
  "AssetEntity_id" ASC
LIMIT
  1

-- AssetRepository.getAllByDeviceId
SELECT
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."id" AS "AssetEntity_id"
FROM
  "assets" "AssetEntity"
WHERE
  (
    ("AssetEntity"."ownerId" = $1)
    AND ("AssetEntity"."deviceId" = $2)
    AND ("AssetEntity"."isVisible" = $3)
  )

-- AssetRepository.getById
SELECT
  "AssetEntity"."id" AS "AssetEntity_id",
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
  "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
  "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
  "AssetEntity"."type" AS "AssetEntity_type",
  "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
  "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
  "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
  "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
  "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
  "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
  "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
  "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
  "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
  "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
  "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
  "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
  "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
  "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
  "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
  "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
  "AssetEntity"."checksum" AS "AssetEntity_checksum",
  "AssetEntity"."duration" AS "AssetEntity_duration",
  "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
  "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
  "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
  "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
  "AssetEntity"."stackId" AS "AssetEntity_stackId"
FROM
  "assets" "AssetEntity"
WHERE
  (("AssetEntity"."id" = $1))
LIMIT
  1

-- AssetRepository.updateAll
UPDATE "assets"
SET
  "deviceId" = $1,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE
  "id" IN ($2)

-- AssetRepository.getByChecksum
SELECT
  "AssetEntity"."id" AS "AssetEntity_id",
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
  "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
  "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
  "AssetEntity"."type" AS "AssetEntity_type",
  "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
  "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
  "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
  "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
  "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
  "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
  "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
  "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
  "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
  "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
  "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
  "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
  "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
  "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
  "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
  "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
  "AssetEntity"."checksum" AS "AssetEntity_checksum",
  "AssetEntity"."duration" AS "AssetEntity_duration",
  "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
  "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
  "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
  "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
  "AssetEntity"."stackId" AS "AssetEntity_stackId"
FROM
  "assets" "AssetEntity"
WHERE
  (
    (
      ("AssetEntity"."ownerId" = $1)
      AND ("AssetEntity"."checksum" = $2)
    )
  )
  AND ("AssetEntity"."deletedAt" IS NULL)
LIMIT
  1

-- AssetRepository.getWithout (sidecar)
SELECT
  "AssetEntity"."id" AS "AssetEntity_id",
  "AssetEntity"."deviceAssetId" AS "AssetEntity_deviceAssetId",
  "AssetEntity"."ownerId" AS "AssetEntity_ownerId",
  "AssetEntity"."libraryId" AS "AssetEntity_libraryId",
  "AssetEntity"."deviceId" AS "AssetEntity_deviceId",
  "AssetEntity"."type" AS "AssetEntity_type",
  "AssetEntity"."originalPath" AS "AssetEntity_originalPath",
  "AssetEntity"."resizePath" AS "AssetEntity_resizePath",
  "AssetEntity"."webpPath" AS "AssetEntity_webpPath",
  "AssetEntity"."thumbhash" AS "AssetEntity_thumbhash",
  "AssetEntity"."encodedVideoPath" AS "AssetEntity_encodedVideoPath",
  "AssetEntity"."createdAt" AS "AssetEntity_createdAt",
  "AssetEntity"."updatedAt" AS "AssetEntity_updatedAt",
  "AssetEntity"."deletedAt" AS "AssetEntity_deletedAt",
  "AssetEntity"."fileCreatedAt" AS "AssetEntity_fileCreatedAt",
  "AssetEntity"."localDateTime" AS "AssetEntity_localDateTime",
  "AssetEntity"."fileModifiedAt" AS "AssetEntity_fileModifiedAt",
  "AssetEntity"."isFavorite" AS "AssetEntity_isFavorite",
  "AssetEntity"."isArchived" AS "AssetEntity_isArchived",
  "AssetEntity"."isExternal" AS "AssetEntity_isExternal",
  "AssetEntity"."isReadOnly" AS "AssetEntity_isReadOnly",
  "AssetEntity"."isOffline" AS "AssetEntity_isOffline",
  "AssetEntity"."checksum" AS "AssetEntity_checksum",
  "AssetEntity"."duration" AS "AssetEntity_duration",
  "AssetEntity"."isVisible" AS "AssetEntity_isVisible",
  "AssetEntity"."livePhotoVideoId" AS "AssetEntity_livePhotoVideoId",
  "AssetEntity"."originalFileName" AS "AssetEntity_originalFileName",
  "AssetEntity"."sidecarPath" AS "AssetEntity_sidecarPath",
  "AssetEntity"."stackId" AS "AssetEntity_stackId"
FROM
  "assets" "AssetEntity"
WHERE
  (
    (
      (
        (
          ("AssetEntity"."sidecarPath" IS NULL)
          AND ("AssetEntity"."isVisible" = $1)
        )
      )
      OR (
        (
          ("AssetEntity"."sidecarPath" = $2)
          AND ("AssetEntity"."isVisible" = $3)
        )
      )
    )
  )
  AND ("AssetEntity"."deletedAt" IS NULL)
ORDER BY
  "AssetEntity"."createdAt" ASC
LIMIT
  11

-- AssetRepository.getTimeBuckets
SELECT
  COUNT("asset"."id")::int AS "count",
  (
    date_trunc(
      'month',
      (asset."localDateTime" at time zone 'UTC')
    ) at time zone 'UTC'
  )::timestamptz AS "timeBucket"
FROM
  "assets" "asset"
  LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "asset"."id"
  LEFT JOIN "asset_stack" "stack" ON "stack"."id" = "asset"."stackId"
  LEFT JOIN "assets" "stackedAssets" ON "stackedAssets"."stackId" = "stack"."id"
  AND ("stackedAssets"."deletedAt" IS NULL)
WHERE
  ("asset"."isVisible" = true)
  AND ("asset"."deletedAt" IS NULL)
GROUP BY
  (
    date_trunc(
      'month',
      (asset."localDateTime" at time zone 'UTC')
    ) at time zone 'UTC'
  )::timestamptz
ORDER BY
  (
    date_trunc(
      'month',
      (asset."localDateTime" at time zone 'UTC')
    ) at time zone 'UTC'
  )::timestamptz DESC

-- AssetRepository.getTimeBucket
SELECT
  "asset"."id" AS "asset_id",
  "asset"."deviceAssetId" AS "asset_deviceAssetId",
  "asset"."ownerId" AS "asset_ownerId",
  "asset"."libraryId" AS "asset_libraryId",
  "asset"."deviceId" AS "asset_deviceId",
  "asset"."type" AS "asset_type",
  "asset"."originalPath" AS "asset_originalPath",
  "asset"."resizePath" AS "asset_resizePath",
  "asset"."webpPath" AS "asset_webpPath",
  "asset"."thumbhash" AS "asset_thumbhash",
  "asset"."encodedVideoPath" AS "asset_encodedVideoPath",
  "asset"."createdAt" AS "asset_createdAt",
  "asset"."updatedAt" AS "asset_updatedAt",
  "asset"."deletedAt" AS "asset_deletedAt",
  "asset"."fileCreatedAt" AS "asset_fileCreatedAt",
  "asset"."localDateTime" AS "asset_localDateTime",
  "asset"."fileModifiedAt" AS "asset_fileModifiedAt",
  "asset"."isFavorite" AS "asset_isFavorite",
  "asset"."isArchived" AS "asset_isArchived",
  "asset"."isExternal" AS "asset_isExternal",
  "asset"."isReadOnly" AS "asset_isReadOnly",
  "asset"."isOffline" AS "asset_isOffline",
  "asset"."checksum" AS "asset_checksum",
  "asset"."duration" AS "asset_duration",
  "asset"."isVisible" AS "asset_isVisible",
  "asset"."livePhotoVideoId" AS "asset_livePhotoVideoId",
  "asset"."originalFileName" AS "asset_originalFileName",
  "asset"."sidecarPath" AS "asset_sidecarPath",
  "asset"."stackId" AS "asset_stackId",
  "exifInfo"."assetId" AS "exifInfo_assetId",
  "exifInfo"."description" AS "exifInfo_description",
  "exifInfo"."exifImageWidth" AS "exifInfo_exifImageWidth",
  "exifInfo"."exifImageHeight" AS "exifInfo_exifImageHeight",
  "exifInfo"."fileSizeInByte" AS "exifInfo_fileSizeInByte",
  "exifInfo"."orientation" AS "exifInfo_orientation",
  "exifInfo"."dateTimeOriginal" AS "exifInfo_dateTimeOriginal",
  "exifInfo"."modifyDate" AS "exifInfo_modifyDate",
  "exifInfo"."timeZone" AS "exifInfo_timeZone",
  "exifInfo"."latitude" AS "exifInfo_latitude",
  "exifInfo"."longitude" AS "exifInfo_longitude",
  "exifInfo"."projectionType" AS "exifInfo_projectionType",
  "exifInfo"."city" AS "exifInfo_city",
  "exifInfo"."livePhotoCID" AS "exifInfo_livePhotoCID",
  "exifInfo"."autoStackId" AS "exifInfo_autoStackId",
  "exifInfo"."state" AS "exifInfo_state",
  "exifInfo"."country" AS "exifInfo_country",
  "exifInfo"."make" AS "exifInfo_make",
  "exifInfo"."model" AS "exifInfo_model",
  "exifInfo"."lensModel" AS "exifInfo_lensModel",
  "exifInfo"."fNumber" AS "exifInfo_fNumber",
  "exifInfo"."focalLength" AS "exifInfo_focalLength",
  "exifInfo"."iso" AS "exifInfo_iso",
  "exifInfo"."exposureTime" AS "exifInfo_exposureTime",
  "exifInfo"."profileDescription" AS "exifInfo_profileDescription",
  "exifInfo"."colorspace" AS "exifInfo_colorspace",
  "exifInfo"."bitsPerSample" AS "exifInfo_bitsPerSample",
  "exifInfo"."fps" AS "exifInfo_fps",
  "stack"."id" AS "stack_id",
  "stack"."primaryAssetId" AS "stack_primaryAssetId",
  "stackedAssets"."id" AS "stackedAssets_id",
  "stackedAssets"."deviceAssetId" AS "stackedAssets_deviceAssetId",
  "stackedAssets"."ownerId" AS "stackedAssets_ownerId",
  "stackedAssets"."libraryId" AS "stackedAssets_libraryId",
  "stackedAssets"."deviceId" AS "stackedAssets_deviceId",
  "stackedAssets"."type" AS "stackedAssets_type",
  "stackedAssets"."originalPath" AS "stackedAssets_originalPath",
  "stackedAssets"."resizePath" AS "stackedAssets_resizePath",
  "stackedAssets"."webpPath" AS "stackedAssets_webpPath",
  "stackedAssets"."thumbhash" AS "stackedAssets_thumbhash",
  "stackedAssets"."encodedVideoPath" AS "stackedAssets_encodedVideoPath",
  "stackedAssets"."createdAt" AS "stackedAssets_createdAt",
  "stackedAssets"."updatedAt" AS "stackedAssets_updatedAt",
  "stackedAssets"."deletedAt" AS "stackedAssets_deletedAt",
  "stackedAssets"."fileCreatedAt" AS "stackedAssets_fileCreatedAt",
  "stackedAssets"."localDateTime" AS "stackedAssets_localDateTime",
  "stackedAssets"."fileModifiedAt" AS "stackedAssets_fileModifiedAt",
  "stackedAssets"."isFavorite" AS "stackedAssets_isFavorite",
  "stackedAssets"."isArchived" AS "stackedAssets_isArchived",
  "stackedAssets"."isExternal" AS "stackedAssets_isExternal",
  "stackedAssets"."isReadOnly" AS "stackedAssets_isReadOnly",
  "stackedAssets"."isOffline" AS "stackedAssets_isOffline",
  "stackedAssets"."checksum" AS "stackedAssets_checksum",
  "stackedAssets"."duration" AS "stackedAssets_duration",
  "stackedAssets"."isVisible" AS "stackedAssets_isVisible",
  "stackedAssets"."livePhotoVideoId" AS "stackedAssets_livePhotoVideoId",
  "stackedAssets"."originalFileName" AS "stackedAssets_originalFileName",
  "stackedAssets"."sidecarPath" AS "stackedAssets_sidecarPath",
  "stackedAssets"."stackId" AS "stackedAssets_stackId"
FROM
  "assets" "asset"
  LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "asset"."id"
  LEFT JOIN "asset_stack" "stack" ON "stack"."id" = "asset"."stackId"
  LEFT JOIN "assets" "stackedAssets" ON "stackedAssets"."stackId" = "stack"."id"
  AND ("stackedAssets"."deletedAt" IS NULL)
WHERE
  (
    "asset"."isVisible" = true
    AND (
      date_trunc(
        'month',
        (asset."localDateTime" at time zone 'UTC')
      ) at time zone 'UTC'
    )::timestamptz = $1
  )
  AND ("asset"."deletedAt" IS NULL)
ORDER BY
  (
    date_trunc(
      'month',
      (asset."localDateTime" at time zone 'UTC')
    ) at time zone 'UTC'
  )::timestamptz DESC,
  "asset"."fileCreatedAt" DESC

-- AssetRepository.getAssetIdByCity
WITH
  "cities" AS (
    SELECT
      city
    FROM
      "exif" "e"
    GROUP BY
      city
    HAVING
      count(city) >= $1
  )
SELECT DISTINCT
  ON (c.city) "asset"."id" AS "data",
  c.city AS "value"
FROM
  "assets" "asset"
  INNER JOIN "exif" "e" ON "asset"."id" = e."assetId"
  INNER JOIN "cities" "c" ON c.city = "e"."city"
WHERE
  (
    "asset"."isVisible" = true
    AND "asset"."type" = $2
    AND "asset"."ownerId" IN ($3)
    AND "asset"."isArchived" = $4
  )
  AND ("asset"."deletedAt" IS NULL)
LIMIT
  12

-- AssetRepository.getAssetIdByTag
WITH
  "random_tags" AS (
    SELECT
      unnest(tags) AS "tag"
    FROM
      "smart_info" "si"
    GROUP BY
      tag
    HAVING
      count(*) >= $1
  )
SELECT DISTINCT
  ON (unnest("si"."tags")) "asset"."id" AS "data",
  unnest("si"."tags") AS "value"
FROM
  "assets" "asset"
  INNER JOIN "smart_info" "si" ON "asset"."id" = si."assetId"
  INNER JOIN "random_tags" "t" ON "si"."tags" @> ARRAY[t.tag]
WHERE
  (
    "asset"."isVisible" = true
    AND "asset"."type" = $2
    AND "asset"."ownerId" IN ($3)
    AND "asset"."isArchived" = $4
  )
  AND ("asset"."deletedAt" IS NULL)
LIMIT
  12

-- AssetRepository.searchMetadata
SELECT
  asset.*,
  e.*,
  COALESCE("si"."tags", array[]::text []) AS "tags",
  COALESCE("si"."objects", array[]::text []) AS "objects"
FROM
  "assets" "asset"
  INNER JOIN "exif" "e" ON asset."id" = e."assetId"
  LEFT JOIN "smart_info" "si" ON si."assetId" = asset."id"
WHERE
  (
    "asset"."isVisible" = true
    AND "asset"."ownerId" IN ($1)
    AND "asset"."isArchived" = $2
    AND (
      (
        e."exifTextSearchableColumn" || COALESCE(
          si."smartInfoTextSearchableColumn",
          to_tsvector('english', '')
        )
      ) @@ PLAINTO_TSQUERY('english', $3)
      OR asset."originalFileName" = $4
    )
  )
  AND ("asset"."deletedAt" IS NULL)
ORDER BY
  "asset"."fileCreatedAt" DESC
LIMIT
  250
