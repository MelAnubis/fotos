import 'dart:async';
import 'dart:math';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:immich_mobile/utils/environment.dart';
import 'package:immich_mobile/shared/models/store.dart';
import 'package:integration_test/integration_test.dart';
import 'package:isar/isar.dart';
// ignore: depend_on_referenced_packages
import 'package:meta/meta.dart';
import 'package:immich_mobile/main.dart' as app;
import 'package:path_provider/path_provider.dart';

import 'album_helper.dart';
import 'asset_grid_helper.dart';
import 'login_helper.dart';
import 'navigation_helper.dart';

class ImmichTestHelper {
  final WidgetTester tester;

  ImmichTestHelper(this.tester);

  ImmichTestLoginHelper? _loginHelper;
  ImmichTestNavigationHelper? _navigationHelper;
  ImmichTestAssetGridHelper? _assetGridHelper;
  ImmichTestAlbumHelper? _albumHelper;

  ImmichTestLoginHelper get loginHelper {
    _loginHelper ??= ImmichTestLoginHelper(tester);
    return _loginHelper!;
  }

  ImmichTestNavigationHelper get navigationHelper {
    _navigationHelper ??= ImmichTestNavigationHelper(tester);
    return _navigationHelper!;
  }

  ImmichTestAssetGridHelper get assetGridHelper {
    _assetGridHelper ??= ImmichTestAssetGridHelper(tester);
    return _assetGridHelper!;
  }

  ImmichTestAlbumHelper get albumHelper {
    _albumHelper ??= ImmichTestAlbumHelper(tester);
    return _albumHelper!;
  }

  static Future<IntegrationTestWidgetsFlutterBinding> initialize() async {
    final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
    binding.framePolicy = LiveTestWidgetsFlutterBindingFramePolicy.fullyLive;

    // Load hive, localization...
    await app.initApp();

    return binding;
  }

  static Future<void> clearCacheFiles() async {
    final temp = await getTemporaryDirectory();
    temp.listSync().forEach((element) {
      element.deleteSync(recursive: true);
    });
  }

  static Future<void> loadApp(WidgetTester tester) async {
    // Clear cache
    await clearCacheFiles();
    // Clear all data from Hive
    await Hive.deleteFromDisk();
    await app.openBoxes();
    // Clear all data from Isar (reuse existing instance if available)
    final db = Isar.getInstance() ?? await app.loadDb();
    await Store.clear();
    await db.writeTxn(() => db.clear());
    // Load main Widget
    await tester.pumpWidget(app.getMainWidget(db));
    // Post run tasks
    await EasyLocalization.ensureInitialized();
  }

  String createRandomAlbumName() {
    return "Album_${DateTime.now().year}_${DateTime.now().month}_${DateTime.now().day}_${Random().nextInt(20000)}";
  }
}

class ImmichTestFindUtils {
  static Finder findByWidgetKeyStartsWith(String expression) {
    return find.byWidgetPredicate((widget) {
      if (widget.key == null || widget.key is! ValueKey<String>) {
        return false;
      }
      final keyValue = (widget.key as ValueKey<String>).value;
      return keyValue.startsWith(expression);
    });
  }
}

@isTest
void immichWidgetTest(
  String description,
  Future<void> Function(WidgetTester, ImmichTestHelper) test,
) {
  testWidgets(
    description,
    (widgetTester) async {
      ImmichEnvironment.instance.testMode = true;
      await ImmichTestHelper.loadApp(widgetTester);
      await test(widgetTester, ImmichTestHelper(widgetTester));
    },
    semanticsEnabled: false,
  );
}

Future<void> pumpUntilFound(
    WidgetTester tester,
    Finder finder, {
      Duration timeout = const Duration(seconds: 120),
    }) async {
  bool found = false;
  final timer = Timer(timeout, () => throw TimeoutException("Pump until has timed out"));
  while (found != true) {
    await tester.pump();
    found = tester.any(finder);
  }
  timer.cancel();
}
