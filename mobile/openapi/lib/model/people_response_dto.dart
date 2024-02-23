//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.12

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class PeopleResponseDto {
  /// Returns a new [PeopleResponseDto] instance.
  PeopleResponseDto({
    required this.hidden,
    this.people = const [],
    required this.total,
  });

  int hidden;

  List<PersonResponseDto> people;

  int total;

  @override
  bool operator ==(Object other) => identical(this, other) || other is PeopleResponseDto &&
    other.hidden == hidden &&
    _deepEquality.equals(other.people, people) &&
    other.total == total;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (hidden.hashCode) +
    (people.hashCode) +
    (total.hashCode);

  @override
  String toString() => 'PeopleResponseDto[hidden=$hidden, people=$people, total=$total]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'hidden'] = this.hidden;
      json[r'people'] = this.people;
      json[r'total'] = this.total;
    return json;
  }

  /// Returns a new [PeopleResponseDto] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static PeopleResponseDto? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return PeopleResponseDto(
        hidden: mapValueOfType<int>(json, r'hidden')!,
        people: PersonResponseDto.listFromJson(json[r'people']),
        total: mapValueOfType<int>(json, r'total')!,
      );
    }
    return null;
  }

  static List<PeopleResponseDto> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <PeopleResponseDto>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = PeopleResponseDto.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, PeopleResponseDto> mapFromJson(dynamic json) {
    final map = <String, PeopleResponseDto>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = PeopleResponseDto.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of PeopleResponseDto-objects as value to a dart map
  static Map<String, List<PeopleResponseDto>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<PeopleResponseDto>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = PeopleResponseDto.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'hidden',
    'people',
    'total',
  };
}

