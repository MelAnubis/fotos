import 'package:immich_mobile/modules/activities/providers/activity_statistics.provider.dart';
import 'package:immich_mobile/modules/activities/services/activity.service.dart';
import 'package:mocktail/mocktail.dart';

class ActivityServiceMock extends Mock implements ActivityService {}

class ActivityStatisticsMock extends ActivityStatisticsInternal
    with Mock
    implements ActivityStatistics {}
