import 'package:flutter/material.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/modules/home/ui/thumbnail_image.dart';
import 'package:openapi/api.dart';

// ignore: must_be_immutable
class ImageGrid extends ConsumerWidget {
  final List<AssetResponseDto> assetGroup;
  final List<AssetResponseDto> sortedAssetGroup;
  final int tilesPerRow;
  final bool showStorageIndicator;
  final BaseCacheManager? cacheManager;

  ImageGrid({
    Key? key,
    required this.assetGroup,
    required this.sortedAssetGroup,
    this.cacheManager,
    this.tilesPerRow = 4,
    this.showStorageIndicator = true,
  }) : super(key: key);

  List<AssetResponseDto> imageSortedList = [];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SliverGrid(
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: tilesPerRow,
        crossAxisSpacing: 5.0,
        mainAxisSpacing: 5,
      ),
      delegate: SliverChildBuilderDelegate(
        (BuildContext context, int index) {
          var assetType = assetGroup[index].type;
          return GestureDetector(
            onTap: () {},
            child: Stack(
              children: [
                ThumbnailImage(
                  cacheManager: cacheManager,
                  asset: assetGroup[index],
                  assetList: sortedAssetGroup,
                  showStorageIndicator: showStorageIndicator,
                ),
                if (assetType != AssetTypeEnum.IMAGE)
                  Positioned(
                    top: 5,
                    right: 5,
                    child: Row(
                      children: [
                        Text(
                          assetGroup[index].duration.toString().substring(0, 7),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                          ),
                        ),
                        const Icon(
                          Icons.play_circle_outline_rounded,
                          color: Colors.white,
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          );
        },
        childCount: assetGroup.length,
      ),
    );
  }
}
