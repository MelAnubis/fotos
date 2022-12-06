//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class FFmpegSystemConfigResponseDto {
  /// Returns a new [FFmpegSystemConfigResponseDto] instance.
  FFmpegSystemConfigResponseDto({
    required this.crf,
    required this.preset,
    required this.targetVideoCodec,
    required this.targetAudioCodec,
    required this.targetScaling,
  });

  String crf;

  String preset;

  String targetVideoCodec;

  String targetAudioCodec;

  String targetScaling;

  @override
  bool operator ==(Object other) => identical(this, other) || other is FFmpegSystemConfigResponseDto &&
     other.crf == crf &&
     other.preset == preset &&
     other.targetVideoCodec == targetVideoCodec &&
     other.targetAudioCodec == targetAudioCodec &&
     other.targetScaling == targetScaling;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (crf.hashCode) +
    (preset.hashCode) +
    (targetVideoCodec.hashCode) +
    (targetAudioCodec.hashCode) +
    (targetScaling.hashCode);

  @override
  String toString() => 'FFmpegSystemConfigResponseDto[crf=$crf, preset=$preset, targetVideoCodec=$targetVideoCodec, targetAudioCodec=$targetAudioCodec, targetScaling=$targetScaling]';

  Map<String, dynamic> toJson() {
    final _json = <String, dynamic>{};
      _json[r'crf'] = crf;
      _json[r'preset'] = preset;
      _json[r'targetVideoCodec'] = targetVideoCodec;
      _json[r'targetAudioCodec'] = targetAudioCodec;
      _json[r'targetScaling'] = targetScaling;
    return _json;
  }

  /// Returns a new [FFmpegSystemConfigResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static FFmpegSystemConfigResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "FFmpegSystemConfigResponseDto[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "FFmpegSystemConfigResponseDto[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return FFmpegSystemConfigResponseDto(
        crf: mapValueOfType<String>(json, r'crf')!,
        preset: mapValueOfType<String>(json, r'preset')!,
        targetVideoCodec: mapValueOfType<String>(json, r'targetVideoCodec')!,
        targetAudioCodec: mapValueOfType<String>(json, r'targetAudioCodec')!,
        targetScaling: mapValueOfType<String>(json, r'targetScaling')!,
      );
    }
    return null;
  }

  static List<FFmpegSystemConfigResponseDto>? listFromJson(dynamic json, {bool growable = false,}) {
    final result = <FFmpegSystemConfigResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = FFmpegSystemConfigResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, FFmpegSystemConfigResponseDto> mapFromJson(dynamic json) {
    final map = <String, FFmpegSystemConfigResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = FFmpegSystemConfigResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of FFmpegSystemConfigResponseDto-objects as value to a dart map
  static Map<String, List<FFmpegSystemConfigResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<FFmpegSystemConfigResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = FFmpegSystemConfigResponseDto.listFromJson(entry.value, growable: growable,);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'crf',
    'preset',
    'targetVideoCodec',
    'targetAudioCodec',
    'targetScaling',
  };
}

