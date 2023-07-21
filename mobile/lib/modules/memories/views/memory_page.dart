import 'package:auto_route/auto_route.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/modules/memories/models/memory.dart';
import 'package:immich_mobile/modules/memories/ui/memory_card.dart';
import 'package:immich_mobile/shared/models/asset.dart';
import 'package:immich_mobile/shared/models/store.dart' as store;
import 'package:immich_mobile/utils/image_url_builder.dart';
import 'package:intl/intl.dart';
import 'package:openapi/api.dart' as api;
import 'package:photo_manager/photo_manager.dart';

class MemoryPage extends HookConsumerWidget {
  final List<Memory> memories;
  final int memoryIndex;

  const MemoryPage({
    required this.memories,
    required this.memoryIndex,
    super.key,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final memoryPageController = usePageController(initialPage: memoryIndex);
    final memoryAssetPageController = usePageController();
    final currentMemory = useState(memories[memoryIndex]);
    final currentAssetPage = useState(0);
    final assetProgress = useState(
      "${currentAssetPage.value + 1}|${currentMemory.value.assets.length}",
    );
    const bgColor = Colors.black;

    toNextMemory() {
      memoryPageController.nextPage(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeIn,
      );
    }

    toNextAsset(int currentAssetIndex) {
      if (currentAssetIndex + 1 < currentMemory.value.assets.length) {
        // Go to the next asset
        memoryAssetPageController.nextPage(
          curve: Curves.easeInOut,
          duration: const Duration(milliseconds: 500),
        );
      } else {
        // Go to the next memory since we are at the end of our assets
        toNextMemory();
      }
    }

    updateProgressText() {
      assetProgress.value =
          "${currentAssetPage.value + 1}|${currentMemory.value.assets.length}";
    }

    onMemoryChanged(int otherIndex) {
      HapticFeedback.mediumImpact();
      currentMemory.value = memories[otherIndex];
      currentAssetPage.value = 0;
      updateProgressText();
    }

    /// Downloads and caches the image for the asset at this [currentMemory]'s index
    precacheAsset(int index) async {
      // Guard index out of range
      if (index < 0) {
        return;
      }

      late Asset asset;
      if (index < currentMemory.value.assets.length) {
        // Uses the next asset in this current memory
        asset = currentMemory.value.assets[index];
      } else {
        // Precache the first asset in the next memory if available
        final currentMemoryIndex = memories.indexOf(currentMemory.value);

        // Guard no memory found
        if (currentMemoryIndex == -1) {
          return;
        }

        final nextMemoryIndex = currentMemoryIndex + 1;
        // Guard no next memory
        if (nextMemoryIndex >= memories.length) {
          return;
        }

        // Get the first asset from the next memory
        asset = memories[nextMemoryIndex].assets.first;
      }

      // Gets the thumbnail url and precaches it
      final precaches = <Future<dynamic>>[];

      final authToken = 'Bearer ${store.Store.get(store.StoreKey.accessToken)}';
      final thumbnailUrl = getThumbnailUrl(asset);
      final thumbnailCacheKey = getThumbnailCacheKey(asset);
      final thumbnailProvider = CachedNetworkImageProvider(
        thumbnailUrl,
        cacheKey: thumbnailCacheKey,
        headers: {"Authorization": authToken},
      );

      precaches.add(precacheImage(thumbnailProvider, context));

      // Precache the local image
      if (!asset.isRemote &&
          (asset.isLocal ||
              !store.Store.get(store.StoreKey.preferRemoteImage, false))) {
        final provider = AssetEntityImageProvider(
          asset.local!,
          isOriginal: false,
          thumbnailSize: const ThumbnailSize.square(250), // like server thumbs
        );
        precaches.add(precacheImage(provider, context));
      } else {
        // Precache the remote image since we are not using local images
        final url = getThumbnailUrl(asset, type: api.ThumbnailFormat.JPEG);
        final cacheKey =
            getThumbnailCacheKey(asset, type: api.ThumbnailFormat.JPEG);
        final provider = CachedNetworkImageProvider(
          url,
          cacheKey: cacheKey,
          headers: {"Authorization": authToken},
        );

        precaches.add(precacheImage(provider, context));
      }

      await Future.wait(precaches);
    }

    // Precache the next page right away if we are on the first page
    if (currentAssetPage.value == 0) {
      Future.delayed(const Duration(milliseconds: 200))
          .then((_) => precacheAsset(1));
    }

    onAssetChanged(int otherIndex) {
      HapticFeedback.selectionClick();

      currentAssetPage.value = otherIndex;
      precacheAsset(otherIndex + 1);
      updateProgressText();
    }

    buildBottomInfo() {
      return Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  currentMemory.value.title,
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 11.0,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  DateFormat.yMMMMd().format(
                    currentMemory.value.assets[0].fileCreatedAt,
                  ),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14.0,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: bgColor,
      body: SafeArea(
        child: PageView.builder(
          scrollDirection: Axis.vertical,
          controller: memoryPageController,
          onPageChanged: onMemoryChanged,
          itemCount: memories.length,
          itemBuilder: (context, mIndex) {
            // Build horizontal page
            return Column(
              children: [
                Expanded(
                  child: PageView.builder(
                    controller: memoryAssetPageController,
                    onPageChanged: onAssetChanged,
                    scrollDirection: Axis.horizontal,
                    itemCount: memories[mIndex].assets.length,
                    itemBuilder: (context, index) {
                      final asset = memories[mIndex].assets[index];
                      return Container(
                        color: Colors.black,
                        child: MemoryCard(
                          asset: asset,
                          onTap: () => toNextAsset(index),
                          onClose: () => AutoRouter.of(context).pop(),
                          rightCornerText: assetProgress.value,
                          title: memories[mIndex].title,
                          showTitle: index == 0,
                        ),
                      );
                    },
                  ),
                ),
                buildBottomInfo(),
              ],
            );
          },
        ),
      ),
    );
  }
}
