import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/modules/asset_viewer/models/request_download_asset_info.model.dart';
import 'package:immich_mobile/modules/asset_viewer/providers/image_viewer_page_state.provider.dart';
import 'package:immich_mobile/shared/models/immich_asset.model.dart';

class TopControlAppBar extends ConsumerWidget with PreferredSizeWidget {
  const TopControlAppBar({Key? key, required this.asset, required this.onMoreInfoPressed}) : super(key: key);

  final ImmichAsset asset;
  final Function onMoreInfoPressed;
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    double iconSize = 18.0;

    return AppBar(
      foregroundColor: Colors.grey[100],
      toolbarHeight: 60,
      backgroundColor: Colors.black,
      leading: IconButton(
        onPressed: () {
          AutoRouter.of(context).pop();
        },
        icon: const Icon(
          Icons.arrow_back_ios_new_rounded,
          size: 20.0,
        ),
      ),
      actions: [
        IconButton(
          iconSize: iconSize,
          splashRadius: iconSize,
          onPressed: () {
            ref.watch(downloadAssetProvider(RequestDownloadAssetInfo(asset.deviceAssetId, asset.deviceId)));
          },
          icon: const Icon(Icons.cloud_download_rounded),
        ),
        IconButton(
          iconSize: iconSize,
          splashRadius: iconSize,
          onPressed: () {
            print("favorite");
          },
          icon: asset.isFavorite ? const Icon(Icons.favorite_rounded) : const Icon(Icons.favorite_border_rounded),
        ),
        IconButton(
            iconSize: iconSize,
            splashRadius: iconSize,
            onPressed: () {
              onMoreInfoPressed();
            },
            icon: const Icon(Icons.more_horiz_rounded))
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
