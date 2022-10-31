import 'package:hive/hive.dart';
import 'package:immich_mobile/constants/hive_box.dart';
import 'package:openapi/api.dart';
import 'package:photo_manager/photo_manager.dart';

/// Asset (online or local)
class Asset {
  Asset.remote(this.remote) {
    local = null;
  }

  Asset.local(this.local) {
    remote = null;
  }

  late final AssetResponseDto? remote;
  late final AssetEntity? local;

  bool get isRemote => remote != null;
  bool get isLocal => local != null;

  String get deviceId =>
      isRemote ? remote!.deviceId : Hive.box(userInfoBox).get(deviceIdKey);

  String get deviceAssetId => isRemote ? remote!.deviceAssetId : local!.id;

  String get id => isLocal ? local!.id : remote!.id;

  double? get latitude =>
      isLocal ? local!.latitude : remote!.exifInfo?.latitude?.toDouble();

  double? get longitude =>
      isLocal ? local!.longitude : remote!.exifInfo?.longitude?.toDouble();

  DateTime get createdAt =>
      isLocal ? local!.createDateTime : DateTime.parse(remote!.createdAt);

  bool get isImage => isLocal
      ? local!.type == AssetType.image
      : remote!.type == AssetTypeEnum.IMAGE;

  String get duration => isRemote
      ? remote!.duration
      : Duration(seconds: local!.duration).toString();

  set createdAt(DateTime val) {
    if (isRemote) {
      remote!.createdAt = val.toIso8601String();
    }
  }

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (isLocal) {
      json["local"] = _assetEntityToJson(local!);
    } else {
      json["remote"] = remote!.toJson();
    }
    return json;
  }

  static Asset? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();
      final l = json["local"];
      if (l != null) {
        return Asset.local(_assetEntityFromJson(l));
      } else {
        return Asset.remote(AssetResponseDto.fromJson(json["remote"]));
      }
    }
    return null;
  }
}

Map<String, dynamic> _assetEntityToJson(AssetEntity a) {
  final json = <String, dynamic>{};
  json["id"] = a.id;
  json["typeInt"] = a.typeInt;
  json["width"] = a.width;
  json["height"] = a.height;
  return json;
}

AssetEntity? _assetEntityFromJson(dynamic value) {
  if (value is Map) {
    final json = value.cast<String, dynamic>();
    return AssetEntity(
      id: json["id"],
      typeInt: json["typeInt"],
      width: json["width"],
      height: json["height"],
    );
  }
  return null;
}
