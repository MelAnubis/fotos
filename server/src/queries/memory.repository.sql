-- NOTE: This file is auto generated by ./sql-generator

-- MemoryRepository.getAssetIds
SELECT
  "memories_assets"."assetsId" AS "assetId"
FROM
  "memories_assets_assets" "memories_assets"
WHERE
  "memories_assets"."memoriesId" = $1
  AND "memories_assets"."assetsId" IN ($2)

-- MemoryRepository.addAssetIds
INSERT INTO
  "memories_assets_assets" ("memoriesId", "assetsId")
VALUES
  ($1, $2)

-- MemoryRepository.removeAssetIds
DELETE FROM "memories_assets_assets"
WHERE
  (
    "memoriesId" = $1
    AND "assetsId" IN ($2)
  )
