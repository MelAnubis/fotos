//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AssetResponseDto {
  /// Returns a new [AssetResponseDto] instance.
  AssetResponseDto({
    required this.type,
    required this.id,
    required this.deviceAssetId,
    required this.ownerId,
    required this.deviceId,
    required this.originalPath,
    required this.resizePath,
    required this.fileCreatedAt,
    required this.fileModifiedAt,
    required this.updatedAt,
    required this.isFavorite,
    required this.mimeType,
    required this.duration,
    required this.webpPath,
    this.encodedVideoPath,
    this.exifInfo,
    this.smartInfo,
    this.livePhotoVideoId,
    this.tags = const [],
  });

  AssetTypeEnum type;

  String id;

  String deviceAssetId;

  String ownerId;

  String deviceId;

  String originalPath;

  String? resizePath;

  String fileCreatedAt;

  String fileModifiedAt;

  String updatedAt;

  bool isFavorite;

  String? mimeType;

  String duration;

  String? webpPath;

  String? encodedVideoPath;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  ExifResponseDto? exifInfo;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  SmartInfoResponseDto? smartInfo;

  String? livePhotoVideoId;

  List<TagResponseDto> tags;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AssetResponseDto &&
          other.type == type &&
          other.id == id &&
          other.deviceAssetId == deviceAssetId &&
          other.ownerId == ownerId &&
          other.deviceId == deviceId &&
          other.originalPath == originalPath &&
          other.resizePath == resizePath &&
          other.fileCreatedAt == fileCreatedAt &&
          other.fileModifiedAt == fileModifiedAt &&
          other.updatedAt == updatedAt &&
          other.isFavorite == isFavorite &&
          other.mimeType == mimeType &&
          other.duration == duration &&
          other.webpPath == webpPath &&
          other.encodedVideoPath == encodedVideoPath &&
          other.exifInfo == exifInfo &&
          other.smartInfo == smartInfo &&
          other.livePhotoVideoId == livePhotoVideoId &&
          other.tags == tags;

  @override
  int get hashCode =>
      // ignore: unnecessary_parenthesis
      (type.hashCode) +
      (id.hashCode) +
      (deviceAssetId.hashCode) +
      (ownerId.hashCode) +
      (deviceId.hashCode) +
      (originalPath.hashCode) +
      (resizePath == null ? 0 : resizePath!.hashCode) +
      (fileCreatedAt.hashCode) +
      (fileModifiedAt.hashCode) +
      (updatedAt.hashCode) +
      (isFavorite.hashCode) +
      (mimeType == null ? 0 : mimeType!.hashCode) +
      (duration.hashCode) +
      (webpPath == null ? 0 : webpPath!.hashCode) +
      (encodedVideoPath == null ? 0 : encodedVideoPath!.hashCode) +
      (exifInfo == null ? 0 : exifInfo!.hashCode) +
      (smartInfo == null ? 0 : smartInfo!.hashCode) +
      (livePhotoVideoId == null ? 0 : livePhotoVideoId!.hashCode) +
      (tags.hashCode);

  @override
  String toString() =>
      'AssetResponseDto[type=$type, id=$id, deviceAssetId=$deviceAssetId, ownerId=$ownerId, deviceId=$deviceId, originalPath=$originalPath, resizePath=$resizePath, fileCreatedAt=$fileCreatedAt, fileModifiedAt=$fileModifiedAt, updatedAt=$updatedAt, isFavorite=$isFavorite, mimeType=$mimeType, duration=$duration, webpPath=$webpPath, encodedVideoPath=$encodedVideoPath, exifInfo=$exifInfo, smartInfo=$smartInfo, livePhotoVideoId=$livePhotoVideoId, tags=$tags]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    json[r'type'] = this.type;
    json[r'id'] = this.id;
    json[r'deviceAssetId'] = this.deviceAssetId;
    json[r'ownerId'] = this.ownerId;
    json[r'deviceId'] = this.deviceId;
    json[r'originalPath'] = this.originalPath;
    if (this.resizePath != null) {
      json[r'resizePath'] = this.resizePath;
    } else {
      // json[r'resizePath'] = null;
    }
    json[r'fileCreatedAt'] = this.fileCreatedAt;
    json[r'fileModifiedAt'] = this.fileModifiedAt;
    json[r'updatedAt'] = this.updatedAt;
    json[r'isFavorite'] = this.isFavorite;
    if (this.mimeType != null) {
      json[r'mimeType'] = this.mimeType;
    } else {
      // json[r'mimeType'] = null;
    }
    json[r'duration'] = this.duration;
    if (this.webpPath != null) {
      json[r'webpPath'] = this.webpPath;
    } else {
      // json[r'webpPath'] = null;
    }
    if (this.encodedVideoPath != null) {
      json[r'encodedVideoPath'] = this.encodedVideoPath;
    } else {
      // json[r'encodedVideoPath'] = null;
    }
    if (this.exifInfo != null) {
      json[r'exifInfo'] = this.exifInfo;
    } else {
      // json[r'exifInfo'] = null;
    }
    if (this.smartInfo != null) {
      json[r'smartInfo'] = this.smartInfo;
    } else {
      // json[r'smartInfo'] = null;
    }
    if (this.livePhotoVideoId != null) {
      json[r'livePhotoVideoId'] = this.livePhotoVideoId;
    } else {
      // json[r'livePhotoVideoId'] = null;
    }
    json[r'tags'] = this.tags;
    return json;
  }

  /// Returns a new [AssetResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AssetResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      // assert(() {
      //   requiredKeys.forEach((key) {
      //     assert(json.containsKey(key), 'Required key "AssetResponseDto[$key]" is missing from JSON.');
      //     assert(json[key] != null, 'Required key "AssetResponseDto[$key]" has a null value in JSON.');
      //   });
      //   return true;
      // }());

      return AssetResponseDto(
        type: AssetTypeEnum.fromJson(json[r'type'])!,
        id: mapValueOfType<String>(json, r'id')!,
        deviceAssetId: mapValueOfType<String>(json, r'deviceAssetId')!,
        ownerId: mapValueOfType<String>(json, r'ownerId')!,
        deviceId: mapValueOfType<String>(json, r'deviceId')!,
        originalPath: mapValueOfType<String>(json, r'originalPath')!,
        resizePath: mapValueOfType<String>(json, r'resizePath'),
        fileCreatedAt: mapValueOfType<String>(json, r'fileCreatedAt')!,
        fileModifiedAt: mapValueOfType<String>(json, r'fileModifiedAt')!,
        updatedAt: mapValueOfType<String>(json, r'updatedAt')!,
        isFavorite: mapValueOfType<bool>(json, r'isFavorite')!,
        mimeType: mapValueOfType<String>(json, r'mimeType'),
        duration: mapValueOfType<String>(json, r'duration')!,
        webpPath: mapValueOfType<String>(json, r'webpPath'),
        encodedVideoPath: mapValueOfType<String>(json, r'encodedVideoPath'),
        exifInfo: ExifResponseDto.fromJson(json[r'exifInfo']),
        smartInfo: SmartInfoResponseDto.fromJson(json[r'smartInfo']),
        livePhotoVideoId: mapValueOfType<String>(json, r'livePhotoVideoId'),
        tags: TagResponseDto.listFromJson(json[r'tags']) ?? const [],
      );
    }
    return null;
  }

  static List<AssetResponseDto>? listFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final result = <AssetResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssetResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssetResponseDto> mapFromJson(dynamic json) {
    final map = <String, AssetResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssetResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AssetResponseDto-objects as value to a dart map
  static Map<String, List<AssetResponseDto>> mapListFromJson(
    dynamic json, {
    bool growable = false,
  }) {
    final map = <String, List<AssetResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssetResponseDto.listFromJson(
          entry.value,
          growable: growable,
        );
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'type',
    'id',
    'deviceAssetId',
    'ownerId',
    'deviceId',
    'originalPath',
    'resizePath',
    'fileCreatedAt',
    'fileModifiedAt',
    'updatedAt',
    'isFavorite',
    'mimeType',
    'duration',
    'webpPath',
  };
}
