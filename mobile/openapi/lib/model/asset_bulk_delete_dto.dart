//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class AssetBulkDeleteDto {
  /// Returns a new [AssetBulkDeleteDto] instance.
  AssetBulkDeleteDto({
    this.emptyTrash,
    this.force,
    this.ids = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? emptyTrash;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  bool? force;

  List<String> ids;

  @override
  bool operator ==(Object other) => identical(this, other) || other is AssetBulkDeleteDto &&
     other.emptyTrash == emptyTrash &&
     other.force == force &&
     other.ids == ids;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (emptyTrash == null ? 0 : emptyTrash!.hashCode) +
    (force == null ? 0 : force!.hashCode) +
    (ids.hashCode);

  @override
  String toString() => 'AssetBulkDeleteDto[emptyTrash=$emptyTrash, force=$force, ids=$ids]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.emptyTrash != null) {
      json[r'emptyTrash'] = this.emptyTrash;
    } else {
    //  json[r'emptyTrash'] = null;
    }
    if (this.force != null) {
      json[r'force'] = this.force;
    } else {
    //  json[r'force'] = null;
    }
      json[r'ids'] = this.ids;
    return json;
  }

  /// Returns a new [AssetBulkDeleteDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static AssetBulkDeleteDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return AssetBulkDeleteDto(
        emptyTrash: mapValueOfType<bool>(json, r'emptyTrash'),
        force: mapValueOfType<bool>(json, r'force'),
        ids: json[r'ids'] is List
            ? (json[r'ids'] as List).cast<String>()
            : const [],
      );
    }
    return null;
  }

  static List<AssetBulkDeleteDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <AssetBulkDeleteDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = AssetBulkDeleteDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, AssetBulkDeleteDto> mapFromJson(dynamic json) {
    final map = <String, AssetBulkDeleteDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = AssetBulkDeleteDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of AssetBulkDeleteDto-objects as value to a dart map
  static Map<String, List<AssetBulkDeleteDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<AssetBulkDeleteDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = AssetBulkDeleteDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'ids',
  };
}

