//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

import 'package:openapi/api.dart';
import 'package:test/test.dart';


/// tests for AssetApi
void main() {
  // final instance = AssetApi();

  group('tests for AssetApi', () {
    // Check duplicated asset before uploading - for Web upload used
    //
    //Future<CheckDuplicateAssetResponseDto> checkDuplicateAsset(CheckDuplicateAssetDto checkDuplicateAssetDto) async
    test('test checkDuplicateAsset', () async {
      // TODO
    });

    // Checks if multiple assets exist on the server and returns all existing - used by background backup
    //
    //Future<CheckExistingAssetsResponseDto> checkExistingAssets(CheckExistingAssetsDto checkExistingAssetsDto) async
    test('test checkExistingAssets', () async {
      // TODO
    });

    //Future<List<DeleteAssetResponseDto>> deleteAsset(DeleteAssetDto deleteAssetDto) async
    test('test deleteAsset', () async {
      // TODO
    });

    //Future<Object> downloadFile(String assetId, { bool isThumb, bool isWeb, String key }) async
    test('test downloadFile', () async {
      // TODO
    });

    //Future<Object> downloadLibrary({ num skip }) async
    test('test downloadLibrary', () async {
      // TODO
    });

    // Get all AssetEntity belong to the user
    //
    //Future<List<AssetResponseDto>> getAllAssets({ String ifNoneMatch }) async
    test('test getAllAssets', () async {
      // TODO
    });

    // Get a single asset's information
    //
    //Future<AssetResponseDto> getAssetById(String assetId) async
    test('test getAssetById', () async {
      // TODO
    });

    //Future<List<AssetResponseDto>> getAssetByTimeBucket(GetAssetByTimeBucketDto getAssetByTimeBucketDto) async
    test('test getAssetByTimeBucket', () async {
      // TODO
    });

    //Future<AssetCountByTimeBucketResponseDto> getAssetCountByTimeBucket(GetAssetCountByTimeBucketDto getAssetCountByTimeBucketDto) async
    test('test getAssetCountByTimeBucket', () async {
      // TODO
    });

    //Future<AssetCountByUserIdResponseDto> getAssetCountByUserId() async
    test('test getAssetCountByUserId', () async {
      // TODO
    });

    //Future<List<String>> getAssetSearchTerms() async
    test('test getAssetSearchTerms', () async {
      // TODO
    });

    //Future<Object> getAssetThumbnail(String assetId, { ThumbnailFormat format, String key }) async
    test('test getAssetThumbnail', () async {
      // TODO
    });

    //Future<List<CuratedLocationsResponseDto>> getCuratedLocations() async
    test('test getCuratedLocations', () async {
      // TODO
    });

    //Future<List<CuratedObjectsResponseDto>> getCuratedObjects() async
    test('test getCuratedObjects', () async {
      // TODO
    });

    // Get all asset of a device that are in the database, ID only.
    //
    //Future<List<String>> getUserAssetsByDeviceId(String deviceId) async
    test('test getUserAssetsByDeviceId', () async {
      // TODO
    });

    //Future<List<AssetResponseDto>> searchAsset(SearchAssetDto searchAssetDto) async
    test('test searchAsset', () async {
      // TODO
    });

    //Future<Object> serveFile(String assetId, { bool isThumb, bool isWeb, String key }) async
    test('test serveFile', () async {
      // TODO
    });

    // Update an asset
    //
    //Future<AssetResponseDto> updateAsset(String assetId, UpdateAssetDto updateAssetDto) async
    test('test updateAsset', () async {
      // TODO
    });

    //Future<AssetFileUploadResponseDto> uploadFile(String key, MultipartFile assetData) async
    test('test uploadFile', () async {
      // TODO
    });

  });
}
