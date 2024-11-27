-- NOTE: This file is auto generated by ./sql-generator

-- SearchRepository.searchMetadata
SELECT DISTINCT
  "distinctAlias"."asset_id" AS "ids_asset_id",
  "distinctAlias"."asset_fileCreatedAt"
FROM
  (
    SELECT
      "asset"."id" AS "asset_id",
      "asset"."deviceAssetId" AS "asset_deviceAssetId",
      "asset"."ownerId" AS "asset_ownerId",
      "asset"."libraryId" AS "asset_libraryId",
      "asset"."deviceId" AS "asset_deviceId",
      "asset"."type" AS "asset_type",
      "asset"."status" AS "asset_status",
      "asset"."originalPath" AS "asset_originalPath",
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
      "asset"."isOffline" AS "asset_isOffline",
      "asset"."checksum" AS "asset_checksum",
      "asset"."duration" AS "asset_duration",
      "asset"."isVisible" AS "asset_isVisible",
      "asset"."livePhotoVideoId" AS "asset_livePhotoVideoId",
      "asset"."originalFileName" AS "asset_originalFileName",
      "asset"."sidecarPath" AS "asset_sidecarPath",
      "asset"."stackId" AS "asset_stackId",
      "asset"."duplicateId" AS "asset_duplicateId",
      "stack"."id" AS "stack_id",
      "stack"."ownerId" AS "stack_ownerId",
      "stack"."primaryAssetId" AS "stack_primaryAssetId",
      "stackedAssets"."id" AS "stackedAssets_id",
      "stackedAssets"."deviceAssetId" AS "stackedAssets_deviceAssetId",
      "stackedAssets"."ownerId" AS "stackedAssets_ownerId",
      "stackedAssets"."libraryId" AS "stackedAssets_libraryId",
      "stackedAssets"."deviceId" AS "stackedAssets_deviceId",
      "stackedAssets"."type" AS "stackedAssets_type",
      "stackedAssets"."status" AS "stackedAssets_status",
      "stackedAssets"."originalPath" AS "stackedAssets_originalPath",
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
      "stackedAssets"."isOffline" AS "stackedAssets_isOffline",
      "stackedAssets"."checksum" AS "stackedAssets_checksum",
      "stackedAssets"."duration" AS "stackedAssets_duration",
      "stackedAssets"."isVisible" AS "stackedAssets_isVisible",
      "stackedAssets"."livePhotoVideoId" AS "stackedAssets_livePhotoVideoId",
      "stackedAssets"."originalFileName" AS "stackedAssets_originalFileName",
      "stackedAssets"."sidecarPath" AS "stackedAssets_sidecarPath",
      "stackedAssets"."stackId" AS "stackedAssets_stackId",
      "stackedAssets"."duplicateId" AS "stackedAssets_duplicateId"
    FROM
      "assets" "asset"
      LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "asset"."id"
      LEFT JOIN "asset_stack" "stack" ON "stack"."id" = "asset"."stackId"
      LEFT JOIN "assets" "stackedAssets" ON "stackedAssets"."stackId" = "stack"."id"
      AND ("stackedAssets"."deletedAt" IS NULL)
    WHERE
      (
        "asset"."fileCreatedAt" >= $1
        AND "exifInfo"."lensModel" = $2
        AND 1 = 1
        AND "asset"."ownerId" IN ($3)
        AND 1 = 1
        AND (
          "asset"."isFavorite" = $4
          AND "asset"."isArchived" = $5
        )
      )
      AND ("asset"."deletedAt" IS NULL)
  ) "distinctAlias"
ORDER BY
  "distinctAlias"."asset_fileCreatedAt" DESC,
  "asset_id" ASC
LIMIT
  101

-- SearchRepository.searchRandom
SELECT DISTINCT
  "distinctAlias"."asset_id" AS "ids_asset_id",
  "distinctAlias"."asset_id"
FROM
  (
    SELECT
      "asset"."id" AS "asset_id",
      "asset"."deviceAssetId" AS "asset_deviceAssetId",
      "asset"."ownerId" AS "asset_ownerId",
      "asset"."libraryId" AS "asset_libraryId",
      "asset"."deviceId" AS "asset_deviceId",
      "asset"."type" AS "asset_type",
      "asset"."status" AS "asset_status",
      "asset"."originalPath" AS "asset_originalPath",
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
      "asset"."isOffline" AS "asset_isOffline",
      "asset"."checksum" AS "asset_checksum",
      "asset"."duration" AS "asset_duration",
      "asset"."isVisible" AS "asset_isVisible",
      "asset"."livePhotoVideoId" AS "asset_livePhotoVideoId",
      "asset"."originalFileName" AS "asset_originalFileName",
      "asset"."sidecarPath" AS "asset_sidecarPath",
      "asset"."stackId" AS "asset_stackId",
      "asset"."duplicateId" AS "asset_duplicateId",
      "stack"."id" AS "stack_id",
      "stack"."ownerId" AS "stack_ownerId",
      "stack"."primaryAssetId" AS "stack_primaryAssetId",
      "stackedAssets"."id" AS "stackedAssets_id",
      "stackedAssets"."deviceAssetId" AS "stackedAssets_deviceAssetId",
      "stackedAssets"."ownerId" AS "stackedAssets_ownerId",
      "stackedAssets"."libraryId" AS "stackedAssets_libraryId",
      "stackedAssets"."deviceId" AS "stackedAssets_deviceId",
      "stackedAssets"."type" AS "stackedAssets_type",
      "stackedAssets"."status" AS "stackedAssets_status",
      "stackedAssets"."originalPath" AS "stackedAssets_originalPath",
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
      "stackedAssets"."isOffline" AS "stackedAssets_isOffline",
      "stackedAssets"."checksum" AS "stackedAssets_checksum",
      "stackedAssets"."duration" AS "stackedAssets_duration",
      "stackedAssets"."isVisible" AS "stackedAssets_isVisible",
      "stackedAssets"."livePhotoVideoId" AS "stackedAssets_livePhotoVideoId",
      "stackedAssets"."originalFileName" AS "stackedAssets_originalFileName",
      "stackedAssets"."sidecarPath" AS "stackedAssets_sidecarPath",
      "stackedAssets"."stackId" AS "stackedAssets_stackId",
      "stackedAssets"."duplicateId" AS "stackedAssets_duplicateId"
    FROM
      "assets" "asset"
      LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "asset"."id"
      LEFT JOIN "asset_stack" "stack" ON "stack"."id" = "asset"."stackId"
      LEFT JOIN "assets" "stackedAssets" ON "stackedAssets"."stackId" = "stack"."id"
      AND ("stackedAssets"."deletedAt" IS NULL)
    WHERE
      (
        "asset"."fileCreatedAt" >= $1
        AND "exifInfo"."lensModel" = $2
        AND 1 = 1
        AND "asset"."ownerId" IN ($3)
        AND 1 = 1
        AND (
          "asset"."isFavorite" = $4
          AND "asset"."isArchived" = $5
        )
        AND "asset"."id" > $6
      )
      AND ("asset"."deletedAt" IS NULL)
  ) "distinctAlias"
ORDER BY
  "distinctAlias"."asset_id" ASC,
  "asset_id" ASC
LIMIT
  100
SELECT DISTINCT
  "distinctAlias"."asset_id" AS "ids_asset_id",
  "distinctAlias"."asset_id"
FROM
  (
    SELECT
      "asset"."id" AS "asset_id",
      "asset"."deviceAssetId" AS "asset_deviceAssetId",
      "asset"."ownerId" AS "asset_ownerId",
      "asset"."libraryId" AS "asset_libraryId",
      "asset"."deviceId" AS "asset_deviceId",
      "asset"."type" AS "asset_type",
      "asset"."status" AS "asset_status",
      "asset"."originalPath" AS "asset_originalPath",
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
      "asset"."isOffline" AS "asset_isOffline",
      "asset"."checksum" AS "asset_checksum",
      "asset"."duration" AS "asset_duration",
      "asset"."isVisible" AS "asset_isVisible",
      "asset"."livePhotoVideoId" AS "asset_livePhotoVideoId",
      "asset"."originalFileName" AS "asset_originalFileName",
      "asset"."sidecarPath" AS "asset_sidecarPath",
      "asset"."stackId" AS "asset_stackId",
      "asset"."duplicateId" AS "asset_duplicateId",
      "stack"."id" AS "stack_id",
      "stack"."ownerId" AS "stack_ownerId",
      "stack"."primaryAssetId" AS "stack_primaryAssetId",
      "stackedAssets"."id" AS "stackedAssets_id",
      "stackedAssets"."deviceAssetId" AS "stackedAssets_deviceAssetId",
      "stackedAssets"."ownerId" AS "stackedAssets_ownerId",
      "stackedAssets"."libraryId" AS "stackedAssets_libraryId",
      "stackedAssets"."deviceId" AS "stackedAssets_deviceId",
      "stackedAssets"."type" AS "stackedAssets_type",
      "stackedAssets"."status" AS "stackedAssets_status",
      "stackedAssets"."originalPath" AS "stackedAssets_originalPath",
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
      "stackedAssets"."isOffline" AS "stackedAssets_isOffline",
      "stackedAssets"."checksum" AS "stackedAssets_checksum",
      "stackedAssets"."duration" AS "stackedAssets_duration",
      "stackedAssets"."isVisible" AS "stackedAssets_isVisible",
      "stackedAssets"."livePhotoVideoId" AS "stackedAssets_livePhotoVideoId",
      "stackedAssets"."originalFileName" AS "stackedAssets_originalFileName",
      "stackedAssets"."sidecarPath" AS "stackedAssets_sidecarPath",
      "stackedAssets"."stackId" AS "stackedAssets_stackId",
      "stackedAssets"."duplicateId" AS "stackedAssets_duplicateId"
    FROM
      "assets" "asset"
      LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "asset"."id"
      LEFT JOIN "asset_stack" "stack" ON "stack"."id" = "asset"."stackId"
      LEFT JOIN "assets" "stackedAssets" ON "stackedAssets"."stackId" = "stack"."id"
      AND ("stackedAssets"."deletedAt" IS NULL)
    WHERE
      (
        "asset"."fileCreatedAt" >= $1
        AND "exifInfo"."lensModel" = $2
        AND 1 = 1
        AND "asset"."ownerId" IN ($3)
        AND 1 = 1
        AND (
          "asset"."isFavorite" = $4
          AND "asset"."isArchived" = $5
        )
        AND "asset"."id" < $6
      )
      AND ("asset"."deletedAt" IS NULL)
  ) "distinctAlias"
ORDER BY
  "distinctAlias"."asset_id" ASC,
  "asset_id" ASC
LIMIT
  100

-- SearchRepository.searchSmart
START TRANSACTION
SET
  LOCAL vectors.hnsw_ef_search = 200;
SELECT
  "asset"."id" AS "asset_id",
  "asset"."deviceAssetId" AS "asset_deviceAssetId",
  "asset"."ownerId" AS "asset_ownerId",
  "asset"."libraryId" AS "asset_libraryId",
  "asset"."deviceId" AS "asset_deviceId",
  "asset"."type" AS "asset_type",
  "asset"."status" AS "asset_status",
  "asset"."originalPath" AS "asset_originalPath",
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
  "asset"."isOffline" AS "asset_isOffline",
  "asset"."checksum" AS "asset_checksum",
  "asset"."duration" AS "asset_duration",
  "asset"."isVisible" AS "asset_isVisible",
  "asset"."livePhotoVideoId" AS "asset_livePhotoVideoId",
  "asset"."originalFileName" AS "asset_originalFileName",
  "asset"."sidecarPath" AS "asset_sidecarPath",
  "asset"."stackId" AS "asset_stackId",
  "asset"."duplicateId" AS "asset_duplicateId",
  "exif"."assetId" AS "exif_assetId",
  "exif"."description" AS "exif_description",
  "exif"."exifImageWidth" AS "exif_exifImageWidth",
  "exif"."exifImageHeight" AS "exif_exifImageHeight",
  "exif"."fileSizeInByte" AS "exif_fileSizeInByte",
  "exif"."orientation" AS "exif_orientation",
  "exif"."dateTimeOriginal" AS "exif_dateTimeOriginal",
  "exif"."modifyDate" AS "exif_modifyDate",
  "exif"."timeZone" AS "exif_timeZone",
  "exif"."latitude" AS "exif_latitude",
  "exif"."longitude" AS "exif_longitude",
  "exif"."projectionType" AS "exif_projectionType",
  "exif"."city" AS "exif_city",
  "exif"."livePhotoCID" AS "exif_livePhotoCID",
  "exif"."autoStackId" AS "exif_autoStackId",
  "exif"."state" AS "exif_state",
  "exif"."country" AS "exif_country",
  "exif"."make" AS "exif_make",
  "exif"."model" AS "exif_model",
  "exif"."lensModel" AS "exif_lensModel",
  "exif"."fNumber" AS "exif_fNumber",
  "exif"."focalLength" AS "exif_focalLength",
  "exif"."iso" AS "exif_iso",
  "exif"."exposureTime" AS "exif_exposureTime",
  "exif"."profileDescription" AS "exif_profileDescription",
  "exif"."colorspace" AS "exif_colorspace",
  "exif"."bitsPerSample" AS "exif_bitsPerSample",
  "exif"."rating" AS "exif_rating",
  "exif"."fps" AS "exif_fps",
  "stack"."id" AS "stack_id",
  "stack"."ownerId" AS "stack_ownerId",
  "stack"."primaryAssetId" AS "stack_primaryAssetId",
  "stackedAssets"."id" AS "stackedAssets_id",
  "stackedAssets"."deviceAssetId" AS "stackedAssets_deviceAssetId",
  "stackedAssets"."ownerId" AS "stackedAssets_ownerId",
  "stackedAssets"."libraryId" AS "stackedAssets_libraryId",
  "stackedAssets"."deviceId" AS "stackedAssets_deviceId",
  "stackedAssets"."type" AS "stackedAssets_type",
  "stackedAssets"."status" AS "stackedAssets_status",
  "stackedAssets"."originalPath" AS "stackedAssets_originalPath",
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
  "stackedAssets"."isOffline" AS "stackedAssets_isOffline",
  "stackedAssets"."checksum" AS "stackedAssets_checksum",
  "stackedAssets"."duration" AS "stackedAssets_duration",
  "stackedAssets"."isVisible" AS "stackedAssets_isVisible",
  "stackedAssets"."livePhotoVideoId" AS "stackedAssets_livePhotoVideoId",
  "stackedAssets"."originalFileName" AS "stackedAssets_originalFileName",
  "stackedAssets"."sidecarPath" AS "stackedAssets_sidecarPath",
  "stackedAssets"."stackId" AS "stackedAssets_stackId",
  "stackedAssets"."duplicateId" AS "stackedAssets_duplicateId",
  "search"."embedding" <= > $1 AS "similarity"
FROM
  "assets" "asset"
  LEFT JOIN "exif" "exif" ON "exif"."assetId" = "asset"."id"
  LEFT JOIN "exif" "exifInfo" ON "exifInfo"."assetId" = "asset"."id"
  LEFT JOIN "asset_stack" "stack" ON "stack"."id" = "asset"."stackId"
  LEFT JOIN "assets" "stackedAssets" ON "stackedAssets"."stackId" = "stack"."id"
  AND ("stackedAssets"."deletedAt" IS NULL)
  INNER JOIN "smart_search" "search" ON "search"."assetId" = "asset"."id"
WHERE
  (
    "asset"."fileCreatedAt" >= $2
    AND "exifInfo"."lensModel" = $3
    AND 1 = 1
    AND 1 = 1
    AND (
      "asset"."isFavorite" = $4
      AND "asset"."isArchived" = $5
    )
    AND "asset"."ownerId" IN ($6)
  )
  AND ("asset"."deletedAt" IS NULL)
ORDER BY
  CASE
    WHEN to_tsvector('english', COALESCE("exif"."description", '')) @@ plainto_tsquery('english', $7) THEN ts_rank(
      to_tsvector('english', COALESCE("exif"."description", '')),
      plainto_tsquery('english', $7)
    )
    ELSE 0
  END * 0.7 + COALESCE((1 - ("search"."embedding" <= > $1)), 0) * 0.3 DESC
LIMIT
  201
COMMIT

-- SearchRepository.searchDuplicates
WITH
  "cte" AS (
    SELECT
      "asset"."duplicateId" AS "duplicateId",
      "search"."assetId" AS "assetId",
      "search"."embedding" <= > $1 AS "distance"
    FROM
      "assets" "asset"
      INNER JOIN "smart_search" "search" ON "search"."assetId" = "asset"."id"
    WHERE
      (
        "asset"."ownerId" IN ($2)
        AND "asset"."id" != $3
        AND "asset"."isVisible" = $4
        AND "asset"."type" = $5
      )
      AND ("asset"."deletedAt" IS NULL)
    ORDER BY
      "search"."embedding" <= > $1 ASC
    LIMIT
      64
  )
SELECT
  res.*
FROM
  "cte" "res"
WHERE
  res.distance <= $6

-- SearchRepository.searchFaces
START TRANSACTION
SET
  LOCAL vectors.hnsw_ef_search = 100;
WITH
  "cte" AS (
    SELECT
      "faces"."id" AS "id",
      "faces"."assetId" AS "assetId",
      "faces"."personId" AS "personId",
      "faces"."imageWidth" AS "imageWidth",
      "faces"."imageHeight" AS "imageHeight",
      "faces"."boundingBoxX1" AS "boundingBoxX1",
      "faces"."boundingBoxY1" AS "boundingBoxY1",
      "faces"."boundingBoxX2" AS "boundingBoxX2",
      "faces"."boundingBoxY2" AS "boundingBoxY2",
      "faces"."sourceType" AS "sourceType",
      "search"."embedding" <= > $1 AS "distance"
    FROM
      "asset_faces" "faces"
      INNER JOIN "assets" "asset" ON "asset"."id" = "faces"."assetId"
      AND ("asset"."deletedAt" IS NULL)
      INNER JOIN "face_search" "search" ON "search"."faceId" = "faces"."id"
    WHERE
      "asset"."ownerId" IN ($2)
    ORDER BY
      "search"."embedding" <= > $1 ASC
    LIMIT
      64
  )
SELECT
  res.*
FROM
  "cte" "res"
WHERE
  res.distance <= $3
ORDER BY
  res.distance ASC
COMMIT

-- SearchRepository.searchPlaces
SELECT
  "geoplaces"."id" AS "geoplaces_id",
  "geoplaces"."name" AS "geoplaces_name",
  "geoplaces"."longitude" AS "geoplaces_longitude",
  "geoplaces"."latitude" AS "geoplaces_latitude",
  "geoplaces"."countryCode" AS "geoplaces_countryCode",
  "geoplaces"."admin1Code" AS "geoplaces_admin1Code",
  "geoplaces"."admin2Code" AS "geoplaces_admin2Code",
  "geoplaces"."admin1Name" AS "geoplaces_admin1Name",
  "geoplaces"."admin2Name" AS "geoplaces_admin2Name",
  "geoplaces"."alternateNames" AS "geoplaces_alternateNames",
  "geoplaces"."modificationDate" AS "geoplaces_modificationDate"
FROM
  "geodata_places" "geoplaces"
WHERE
  f_unaccent (name) %>> f_unaccent ($1)
  OR f_unaccent ("admin2Name") %>> f_unaccent ($1)
  OR f_unaccent ("admin1Name") %>> f_unaccent ($1)
  OR f_unaccent ("alternateNames") %>> f_unaccent ($1)
ORDER BY
  COALESCE(f_unaccent (name) <->>> f_unaccent ($1), 0.1) + COALESCE(
    f_unaccent ("admin2Name") <->>> f_unaccent ($1),
    0.1
  ) + COALESCE(
    f_unaccent ("admin1Name") <->>> f_unaccent ($1),
    0.1
  ) + COALESCE(
    f_unaccent ("alternateNames") <->>> f_unaccent ($1),
    0.1
  ) ASC
LIMIT
  20

-- SearchRepository.getAssetsByCity
WITH RECURSIVE
  cte AS (
    (
      SELECT
        city,
        "assetId"
      FROM
        exif
        INNER JOIN assets ON exif."assetId" = assets.id
      WHERE
        "ownerId" = ANY ($1::uuid [])
        AND "isVisible" = $2
        AND "isArchived" = $3
        AND type = $4
      ORDER BY
        city
      LIMIT
        1
    )
    UNION ALL
    SELECT
      l.city,
      l."assetId"
    FROM
      cte c,
      LATERAL (
        SELECT
          city,
          "assetId"
        FROM
          exif
          INNER JOIN assets ON exif."assetId" = assets.id
        WHERE
          city > c.city
          AND "ownerId" = ANY ($1::uuid [])
          AND "isVisible" = $2
          AND "isArchived" = $3
          AND type = $4
        ORDER BY
          city
        LIMIT
          1
      ) l
  )
SELECT
  "asset"."id" AS "asset_id",
  "asset"."deviceAssetId" AS "asset_deviceAssetId",
  "asset"."ownerId" AS "asset_ownerId",
  "asset"."libraryId" AS "asset_libraryId",
  "asset"."deviceId" AS "asset_deviceId",
  "asset"."type" AS "asset_type",
  "asset"."status" AS "asset_status",
  "asset"."originalPath" AS "asset_originalPath",
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
  "asset"."isOffline" AS "asset_isOffline",
  "asset"."checksum" AS "asset_checksum",
  "asset"."duration" AS "asset_duration",
  "asset"."isVisible" AS "asset_isVisible",
  "asset"."livePhotoVideoId" AS "asset_livePhotoVideoId",
  "asset"."originalFileName" AS "asset_originalFileName",
  "asset"."sidecarPath" AS "asset_sidecarPath",
  "asset"."stackId" AS "asset_stackId",
  "asset"."duplicateId" AS "asset_duplicateId",
  "exif"."assetId" AS "exif_assetId",
  "exif"."description" AS "exif_description",
  "exif"."exifImageWidth" AS "exif_exifImageWidth",
  "exif"."exifImageHeight" AS "exif_exifImageHeight",
  "exif"."fileSizeInByte" AS "exif_fileSizeInByte",
  "exif"."orientation" AS "exif_orientation",
  "exif"."dateTimeOriginal" AS "exif_dateTimeOriginal",
  "exif"."modifyDate" AS "exif_modifyDate",
  "exif"."timeZone" AS "exif_timeZone",
  "exif"."latitude" AS "exif_latitude",
  "exif"."longitude" AS "exif_longitude",
  "exif"."projectionType" AS "exif_projectionType",
  "exif"."city" AS "exif_city",
  "exif"."livePhotoCID" AS "exif_livePhotoCID",
  "exif"."autoStackId" AS "exif_autoStackId",
  "exif"."state" AS "exif_state",
  "exif"."country" AS "exif_country",
  "exif"."make" AS "exif_make",
  "exif"."model" AS "exif_model",
  "exif"."lensModel" AS "exif_lensModel",
  "exif"."fNumber" AS "exif_fNumber",
  "exif"."focalLength" AS "exif_focalLength",
  "exif"."iso" AS "exif_iso",
  "exif"."exposureTime" AS "exif_exposureTime",
  "exif"."profileDescription" AS "exif_profileDescription",
  "exif"."colorspace" AS "exif_colorspace",
  "exif"."bitsPerSample" AS "exif_bitsPerSample",
  "exif"."rating" AS "exif_rating",
  "exif"."fps" AS "exif_fps"
FROM
  "assets" "asset"
  INNER JOIN "exif" "exif" ON "exif"."assetId" = "asset"."id"
  INNER JOIN cte ON asset.id = cte."assetId"
ORDER BY
  exif.city

-- SearchRepository.getCountries
SELECT DISTINCT
  ON ("exif"."country") "exif"."country" AS "country"
FROM
  "exif" "exif"
  LEFT JOIN "assets" "asset" ON "asset"."id" = "exif"."assetId"
  AND ("asset"."deletedAt" IS NULL)
WHERE
  "asset"."ownerId" IN ($1)

-- SearchRepository.getStates
SELECT DISTINCT
  ON ("exif"."state") "exif"."state" AS "state"
FROM
  "exif" "exif"
  LEFT JOIN "assets" "asset" ON "asset"."id" = "exif"."assetId"
  AND ("asset"."deletedAt" IS NULL)
WHERE
  "asset"."ownerId" IN ($1)
  AND "exif"."country" = $2

-- SearchRepository.getCities
SELECT DISTINCT
  ON ("exif"."city") "exif"."city" AS "city"
FROM
  "exif" "exif"
  LEFT JOIN "assets" "asset" ON "asset"."id" = "exif"."assetId"
  AND ("asset"."deletedAt" IS NULL)
WHERE
  "asset"."ownerId" IN ($1)
  AND "exif"."country" = $2
  AND "exif"."state" = $3

-- SearchRepository.getCameraMakes
SELECT DISTINCT
  ON ("exif"."make") "exif"."make" AS "make"
FROM
  "exif" "exif"
  LEFT JOIN "assets" "asset" ON "asset"."id" = "exif"."assetId"
  AND ("asset"."deletedAt" IS NULL)
WHERE
  "asset"."ownerId" IN ($1)
  AND "exif"."model" = $2

-- SearchRepository.getCameraModels
SELECT DISTINCT
  ON ("exif"."model") "exif"."model" AS "model"
FROM
  "exif" "exif"
  LEFT JOIN "assets" "asset" ON "asset"."id" = "exif"."assetId"
  AND ("asset"."deletedAt" IS NULL)
WHERE
  "asset"."ownerId" IN ($1)
  AND "exif"."make" = $2
