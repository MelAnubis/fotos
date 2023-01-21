//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class RestoreAssetsDto {
  /// Returns a new [RestoreAssetsDto] instance.
  RestoreAssetsDto({
    this.assetIds = const [],
  });

  List<String> assetIds;

  @override
  bool operator ==(Object other) => identical(this, other) || other is RestoreAssetsDto &&
     other.assetIds == assetIds;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (assetIds.hashCode);

  @override
  String toString() => 'RestoreAssetsDto[assetIds=$assetIds]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'assetIds'] = this.assetIds;
    return json;
  }

  /// Returns a new [RestoreAssetsDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static RestoreAssetsDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "RestoreAssetsDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "RestoreAssetsDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return RestoreAssetsDto(
        assetIds: json[r'assetIds'] is List
            ? (json[r'assetIds'] as List).cast<String>()
            : const [],
      );
    }
    return null;
  }

  static List<RestoreAssetsDto>? listFromJson(dynamic json, {bool growable = false,}) {
    final result = <RestoreAssetsDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = RestoreAssetsDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, RestoreAssetsDto> mapFromJson(dynamic json) {
    final map = <String, RestoreAssetsDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RestoreAssetsDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of RestoreAssetsDto-objects as value to a dart map
  static Map<String, List<RestoreAssetsDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<RestoreAssetsDto>>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = RestoreAssetsDto.listFromJson(entry.value, growable: growable,);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'assetIds',
  };
}

