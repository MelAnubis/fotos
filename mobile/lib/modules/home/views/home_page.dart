import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/modules/home/providers/home_page_state.provider.dart';
import 'package:immich_mobile/modules/home/ui/control_bottom_app_bar.dart';
import 'package:immich_mobile/modules/home/ui/daily_title_text.dart';
import 'package:immich_mobile/modules/home/ui/disable_multi_select_button.dart';
import 'package:immich_mobile/modules/home/ui/draggable_scrollbar.dart';
import 'package:immich_mobile/modules/home/ui/image_grid.dart';
import 'package:immich_mobile/modules/home/ui/immich_asset_grid.dart';
import 'package:immich_mobile/modules/home/ui/immich_sliver_appbar.dart';
import 'package:immich_mobile/modules/home/ui/monthly_title_text.dart';
import 'package:immich_mobile/modules/home/ui/profile_drawer/profile_drawer.dart';
import 'package:immich_mobile/modules/settings/providers/app_settings.provider.dart';
import 'package:immich_mobile/modules/settings/services/app_settings.service.dart';

import 'package:immich_mobile/shared/providers/asset.provider.dart';
import 'package:immich_mobile/shared/providers/server_info.provider.dart';
import 'package:immich_mobile/shared/providers/websocket.provider.dart';
import 'package:openapi/api.dart';

class HomePage extends HookConsumerWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appSettingService = ref.watch(appSettingsServiceProvider);

    ScrollController scrollController = useScrollController();
    var assetGroupByDateTime = ref.watch(assetGroupByDateTimeProvider);
    List<Widget> imageGridGroup = [];
    var isMultiSelectEnable =
        ref.watch(homePageStateProvider).isMultiSelectEnable;
    var homePageState = ref.watch(homePageStateProvider);
    List<AssetResponseDto> sortedAssetList = [];
    // set sorted List
    for (var group in assetGroupByDateTime.values) {
      for (var value in group) {
        sortedAssetList.add(value);
      }
    }

    useEffect(
      () {
        ref.read(websocketProvider.notifier).connect();
        ref.read(assetProvider.notifier).getAllAsset();
        ref.watch(serverInfoProvider.notifier).getServerVersion();
        return null;
      },
      [],
    );

    void reloadAllAsset() {
      ref.read(assetProvider.notifier).getAllAsset();
    }

    _buildSelectedItemCountIndicator() {
      return DisableMultiSelectButton(
        onPressed: ref.watch(homePageStateProvider.notifier).disableMultiSelect,
        selectedItemCount: homePageState.selectedItems.length,
      );
    }

    Widget _buildBody() {
      _buildSliverAppBar() {
        return isMultiSelectEnable
            ? const SliverToBoxAdapter(
                child: SizedBox(
                  height: 70,
                  child: null,
                ),
              )
            : ImmichSliverAppBar(
                onPopBack: reloadAllAsset,
              );
      }

      return SafeArea(
        bottom: !isMultiSelectEnable,
        top: !isMultiSelectEnable,
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                _buildSliverAppBar(),
              ],
            ),
            Padding(
              padding: const EdgeInsets.only(top: 60.0, bottom: 0.0),
              child: ImmichAssetGrid(
                assetGroups: assetGroupByDateTime,
                assetsPerRow:
                    appSettingService.getSetting(AppSettingsEnum.tilesPerRow),
                showStorageIndicator: appSettingService
                    .getSetting(AppSettingsEnum.storageIndicator),
              ),
            ),
            if (isMultiSelectEnable) ...[
              _buildSelectedItemCountIndicator(),
              const ControlBottomAppBar(),
            ],
          ],
        ),
      );
    }

    return Scaffold(
      drawer: const ProfileDrawer(),
      body: _buildBody(),
    );
  }
}
