import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/entities/album.entity.dart';
import 'package:immich_mobile/interfaces/media.interface.dart';
import 'package:immich_mobile/repositories/media.repository.dart';
import 'package:immich_mobile/services/background.service.dart';
import 'package:immich_mobile/entities/android_device_asset.entity.dart';
import 'package:immich_mobile/entities/asset.entity.dart';
import 'package:immich_mobile/entities/device_asset.entity.dart';
import 'package:immich_mobile/entities/ios_device_asset.entity.dart';
import 'package:immich_mobile/providers/db.provider.dart';
import 'package:immich_mobile/extensions/string_extensions.dart';
import 'package:isar/isar.dart';
import 'package:logging/logging.dart';

class HashService {
  HashService(this._db, this._backgroundService, this._mediaRepository);
  final Isar _db;
  final BackgroundService _backgroundService;
  final IMediaRepository _mediaRepository;
  final _log = Logger('HashService');

  /// Returns all assets that were successfully hashed
  Future<List<Asset>> getHashedAssets(
    Album album, {
    int start = 0,
    int end = 0x7fffffffffffffff,
    DateTime? modifiedFrom,
    DateTime? modifiedUntil,
    Set<String>? excludedAssets,
  }) async {
    final entities = await _mediaRepository.getAssetsByAlbumId(
      album.localId!,
      start: start,
      end: end,
      modifiedFrom: modifiedFrom,
      modifiedUntil: modifiedUntil,
    );
    final filtered = excludedAssets == null
        ? entities
        : entities.where((e) => !excludedAssets.contains(e.localId!)).toList();
    return _hashAssets(filtered);
  }

  /// Processes a list of local [Asset]s, storing their hash and returning only those
  /// that were successfully hashed. Hashes are looked up in a DB table
  /// [AndroidDeviceAsset] / [IOSDeviceAsset] by local id. Only missing
  /// entries are newly hashed and added to the DB table.
  Future<List<Asset>> _hashAssets(List<Asset> assets) async {
    const int batchFileCount = 128;
    const int batchDataSize = 1024 * 1024 * 1024; // 1GB

    final ids = assets
        .map(Platform.isAndroid ? (a) => a.localId!.toInt() : (a) => a.localId!)
        .toList();
    final List<DeviceAsset?> hashes = await _lookupHashes(ids);
    final List<DeviceAsset> toAdd = [];
    final List<String> toHash = [];

    int bytes = 0;

    for (int i = 0; i < assets.length; i++) {
      if (hashes[i] != null) {
        continue;
      }
      final file = await assets[i].local!.originFile;
      if (file == null) {
        final fileName = assets[i].fileName;

        _log.warning(
          "Failed to get file for asset ${assets[i].localId}, name: $fileName, created on: ${assets[i].fileCreatedAt}, skipping",
        );
        continue;
      }
      bytes += await file.length();
      toHash.add(file.path);
      final deviceAsset = Platform.isAndroid
          ? AndroidDeviceAsset(id: ids[i] as int, hash: const [])
          : IOSDeviceAsset(id: ids[i] as String, hash: const []);
      toAdd.add(deviceAsset);
      hashes[i] = deviceAsset;
      if (toHash.length == batchFileCount || bytes >= batchDataSize) {
        await _processBatch(toHash, toAdd);
        toAdd.clear();
        toHash.clear();
        bytes = 0;
      }
    }
    if (toHash.isNotEmpty) {
      await _processBatch(toHash, toAdd);
    }
    return _mapAllHashedAssets(assets, hashes);
  }

  /// Lookup hashes of assets by their local ID
  Future<List<DeviceAsset?>> _lookupHashes(List<Object> ids) =>
      Platform.isAndroid
          ? _db.androidDeviceAssets.getAll(ids.cast())
          : _db.iOSDeviceAssets.getAllById(ids.cast());

  /// Processes a batch of files and saves any successfully hashed
  /// values to the DB table.
  Future<void> _processBatch(
    final List<String> toHash,
    final List<DeviceAsset> toAdd,
  ) async {
    final hashes = await _hashFiles(toHash);
    bool anyNull = false;
    for (int j = 0; j < hashes.length; j++) {
      if (hashes[j]?.length == 20) {
        toAdd[j].hash = hashes[j]!;
      } else {
        _log.warning("Failed to hash file ${toHash[j]}, skipping");
        anyNull = true;
      }
    }
    final validHashes = anyNull
        ? toAdd.where((e) => e.hash.length == 20).toList(growable: false)
        : toAdd;
    await _db.writeTxn(
      () => Platform.isAndroid
          ? _db.androidDeviceAssets.putAll(validHashes.cast())
          : _db.iOSDeviceAssets.putAll(validHashes.cast()),
    );
    _log.fine("Hashed ${validHashes.length}/${toHash.length} assets");
  }

  /// Hashes the given files and returns a list of the same length
  /// files that could not be hashed have a `null` value
  Future<List<Uint8List?>> _hashFiles(List<String> paths) async {
    final List<Uint8List?>? hashes =
        await _backgroundService.digestFiles(paths);
    if (hashes == null) {
      throw Exception("Hashing ${paths.length} files failed");
    }
    return hashes;
  }

  /// Converts [AssetEntity]s that were successfully hashed to [Asset]s
  List<Asset> _mapAllHashedAssets(
    List<Asset> assets,
    List<DeviceAsset?> hashes,
  ) {
    final List<Asset> result = [];
    for (int i = 0; i < assets.length; i++) {
      if (hashes[i] != null && hashes[i]!.hash.isNotEmpty) {
        assets[i].byteHash = hashes[i]!.hash;
        result.add(assets[i]);
      }
    }
    return result;
  }
}

final hashServiceProvider = Provider(
  (ref) => HashService(
    ref.watch(dbProvider),
    ref.watch(backgroundServiceProvider),
    ref.watch(mediaRepositoryProvider),
  ),
);
