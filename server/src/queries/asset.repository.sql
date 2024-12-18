-- NOTE: This file is auto generated by ./sql-generator

-- AssetRepository.getByDayOfYear
with
  "res" as (
    with
      "today" as (
        select
          make_date(year::int, $1::int, $2::int) as "date"
        from
          generate_series(
            $3,
            extract(
              year
              from
                current_date
            ) - 1
          ) as "year"
      )
    select
      "a".*,
      to_jsonb("exif") as "exifInfo"
    from
      "today"
      inner join lateral (
        select
          "assets".*
        from
          "assets"
          inner join "asset_job_status" on "assets"."id" = "asset_job_status"."assetId"
        where
          "asset_job_status"."previewAt" is not null
          and (assets."localDateTime" at time zone 'UTC')::date = today.date
          and "assets"."ownerId" = any ($4::uuid [])
          and "assets"."isVisible" = $5
          and "assets"."isArchived" = $6
          and exists (
            select
            from
              "asset_files"
            where
              "assetId" = "assets"."id"
              and "asset_files"."type" = $7
          )
          and "assets"."deletedAt" is null
        limit
          $8
      ) as "a" on true
      inner join "exif" on "a"."id" = "exif"."assetId"
  )
select
  (
    (now() at time zone 'UTC')::date - ("localDateTime" at time zone 'UTC')::date
  ) / 365 as "yearsAgo",
  jsonb_agg("res") as "assets"
from
  "res"
group by
  ("localDateTime" at time zone 'UTC')::date
order by
  ("localDateTime" at time zone 'UTC')::date desc
limit
  $9

-- AssetRepository.getByIds
select
  "assets".*
from
  "assets"
where
  "assets"."id" = any ($1::uuid [])

-- AssetRepository.getByIdsWithAllRelations
select
  "assets".*,
  (
    select
      jsonb_agg(
        case
          when "person"."id" is not null then jsonb_insert(
            to_jsonb("asset_faces"),
            '{person}'::text[],
            to_jsonb("person")
          )
          else to_jsonb("asset_faces")
        end
      ) as "faces"
    from
      "asset_faces"
      left join "person" on "person"."id" = "asset_faces"."personId"
    where
      "asset_faces"."assetId" = "assets"."id"
  ) as "faces",
  (
    select
      coalesce(json_agg(agg), '[]')
    from
      (
        select
          "tags".*
        from
          "tags"
          inner join "tag_asset" on "tags"."id" = "tag_asset"."tagsId"
        where
          "assets"."id" = "tag_asset"."assetsId"
      ) as agg
  ) as "tags",
  to_jsonb("exif") as "exifInfo",
  to_jsonb("stacked_assets") as "stack"
from
  "assets"
  left join "exif" on "assets"."id" = "exif"."assetId"
  left join lateral (
    select
      "asset_stack".*,
      "s"."assets"
    from
      "asset_stack"
      inner join lateral (
        select
          array_agg("stacked") as "assets"
        from
          "assets" as "stacked"
        where
          "asset_stack"."id" = "stacked"."stackId"
          and "asset_stack"."primaryAssetId" != "stacked"."id"
      ) as "s" on (
        "asset_stack"."primaryAssetId" = "assets"."id"
        or "assets"."stackId" is null
      )
    where
      "assets"."stackId" = "asset_stack"."id"
  ) as "stacked_assets" on true
where
  "assets"."id" = any ($1::uuid [])

-- AssetRepository.deleteAll
delete from "assets"
where
  "ownerId" = $1

-- AssetRepository.getByLibraryIdAndOriginalPath
select
  "assets".*
from
  "assets"
where
  "libraryId" = $1::uuid
  and "originalPath" = $2
limit
  $3

-- AssetRepository.getAllByDeviceId
select
  "deviceAssetId"
from
  "assets"
where
  "ownerId" = $1::uuid
  and "deviceId" = $2
  and "isVisible" = $3
  and "deletedAt" is null

-- AssetRepository.getLivePhotoCount
select
  count(*) as "count"
from
  "assets"
where
  "livePhotoVideoId" = $1::uuid

-- AssetRepository.getById
select
  "assets".*
from
  "assets"
where
  "assets"."id" = $1::uuid
limit
  $2

-- AssetRepository.updateAll
update "assets"
set
  "deviceId" = $1
where
  "id" = any ($2::uuid [])

-- AssetRepository.updateDuplicates
update "assets"
set
  "duplicateId" = $1
where
  (
    "duplicateId" = any ($2::uuid [])
    or "id" = any ($3::uuid [])
  )

-- AssetRepository.getByChecksum
select
  "assets".*
from
  "assets"
where
  "ownerId" = $1::uuid
  and "checksum" = $2
  and "libraryId" = $3::uuid
limit
  $4

-- AssetRepository.getUploadAssetIdByChecksum
select
  "id"
from
  "assets"
where
  "ownerId" = $1::uuid
  and "checksum" = $2
  and "libraryId" is null
limit
  $3

-- AssetRepository.getWithout (sidecar)
select
  "assets".*
from
  "assets"
where
  (
    "assets"."sidecarPath" = $1
    or "assets"."sidecarPath" is null
  )
  and "assets"."isVisible" = $2
  and "deletedAt" is null
order by
  "createdAt" asc
limit
  $3
offset
  $4

-- AssetRepository.getTimeBuckets
with
  "assets" as (
    select
      date_trunc($1, "localDateTime" at time zone 'UTC') as "timeBucket"
    from
      "assets"
    where
      "assets"."deletedAt" is null
      and "assets"."isVisible" = $2
  )
select
  "timeBucket",
  count(*) as "count"
from
  "assets"
group by
  "timeBucket"
order by
  "timeBucket" desc

-- AssetRepository.getTimeBucket
select
  "assets".*,
  to_jsonb("exif") as "exifInfo"
from
  "assets"
  left join "exif" on "assets"."id" = "exif"."assetId"
where
  "assets"."deletedAt" is null
  and "assets"."isVisible" = $1
  and date_trunc($2, assets."localDateTime" at time zone 'UTC') = $3
order by
  "assets"."localDateTime" desc

-- AssetRepository.getAssetIdByCity
with
  "cities" as (
    select
      "city"
    from
      "exif"
    where
      "city" is not null
    group by
      "city"
    having
      count("assetId") >= $1
  )
select distinct
  on ("exif"."city") "assetId" as "data",
  "exif"."city" as "value"
from
  "assets"
  inner join "exif" on "assets"."id" = "exif"."assetId"
  inner join "cities" on "exif"."city" = "cities"."city"
where
  "ownerId" = $2::uuid
  and "isVisible" = $3
  and "isArchived" = $4
  and "type" = $5
  and "deletedAt" is null
limit
  $6

-- AssetRepository.getAllForUserFullSync
select
from
  "assets"
where
  "ownerId" = $1::uuid
  and "isVisible" = $2
  and "updatedAt" <= $3
  and "id" > $4
order by
  "id" asc
limit
  $5
