import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/widgets/asset_viewer/description_input.dart';
import 'package:immich_mobile/widgets/asset_viewer/detail_panel/asset_date_time.dart';
import 'package:immich_mobile/widgets/asset_viewer/detail_panel/asset_details.dart';
import 'package:immich_mobile/widgets/asset_viewer/detail_panel/asset_location.dart';
import 'package:immich_mobile/widgets/asset_viewer/detail_panel/people_info.dart';
import 'package:immich_mobile/entities/asset.entity.dart';
import 'package:immich_mobile/entities/exif_info.entity.dart';
import 'package:immich_mobile/providers/asset.provider.dart';
import 'package:immich_mobile/utils/selection_handlers.dart';

class DetailPanel extends HookConsumerWidget {
  final Asset asset;

  const DetailPanel({super.key, required this.asset});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assetWithExif = ref.watch(assetDetailProvider(asset));
    final ExifInfo? exifInfo = (assetWithExif.value ?? asset).exifInfo;

    void editLocation() {
      handleEditLocation(ref, context, [assetWithExif.value ?? asset]);
    }

    return ListView(
      shrinkWrap: true,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            children: [
              AssetDateTime(asset: asset),
              asset.isRemote
                  ? DescriptionInput(asset: asset, exifInfo: exifInfo)
                  : const SizedBox.shrink(),
              PeopleInfo(asset: asset),
              AssetLocation(
                asset: asset,
                exifInfo: exifInfo,
                editLocation: editLocation,
              ),
              AssetDetails(asset: asset, exifInfo: exifInfo),
            ],
          ),
        ),
      ],
    );
  }
}
