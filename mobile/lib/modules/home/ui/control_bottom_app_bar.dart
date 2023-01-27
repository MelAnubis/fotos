import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/modules/album/ui/add_to_album_sliverlist.dart';
import 'package:immich_mobile/modules/home/ui/delete_diaglog.dart';
import 'package:immich_mobile/shared/ui/drag_sheet.dart';
import 'package:openapi/api.dart';

class ControlBottomAppBar extends ConsumerWidget {
  final Function onShare;
  final Function onDelete;
  final Function(AlbumResponseDto album) onAddToAlbum;
  final void Function() onCreateNewAlbum;

  final List<AlbumResponseDto> albums;
  final List<AlbumResponseDto> sharedAlbums;

  const ControlBottomAppBar({
    Key? key,
    required this.onShare,
    required this.onDelete,
    required this.sharedAlbums,
    required this.albums,
    required this.onAddToAlbum,
    required this.onCreateNewAlbum,
  }) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    Widget renderActionButtons() {
      return Row(
        children: [
          ControlBoxButton(
            iconData: Icons.ios_share_rounded,
            label: "control_bottom_app_bar_share".tr(),
            onPressed: () {
              onShare();
            },
          ),
          ControlBoxButton(
            iconData: Icons.delete_outline_rounded,
            label: "control_bottom_app_bar_delete".tr(),
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return DeleteDialog(
                    onDelete: onDelete,
                  );
                },
              );
            },
          ),
        ],
      );
    }

    return DraggableScrollableSheet(
      initialChildSize: 0.30,
      minChildSize: 0.15,
      maxChildSize: 0.57,
      snap: true,
      builder: (
        BuildContext context,
        ScrollController scrollController,
      ) {
        return Card(
          elevation: 12.0,
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(12),
              topRight: Radius.circular(12),
            ),
          ),
          margin: const EdgeInsets.all(0),
          child: Container(
            decoration: const BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: CustomScrollView(
              controller: scrollController,
              slivers: [
                SliverToBoxAdapter(
                  child: Column(
                    children: <Widget>[
                      const SizedBox(height: 12),
                      const CustomDraggingHandle(),
                      const SizedBox(height: 12),
                      renderActionButtons(),
                      const Divider(
                        indent: 16,
                        endIndent: 16,
                        thickness: 1,
                      ),
                      AddToAlbumTitleRow(onCreateNewAlbum: onCreateNewAlbum),
                    ],
                  ),
                ),
                if (doShowAddToAlbum)
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    sliver: AddToAlbumSliverList(
                      albums: albums,
                      sharedAlbums: sharedAlbums,
                      onAddToAlbum: onAddToAlbum,
                    ),
                  ),
                const SliverToBoxAdapter(
                  child: SizedBox(height: 200),
                )
              ],
            ),
          ),
        );
      },
    );
  }
}

class AddToAlbumTitleRow extends StatelessWidget {
  const AddToAlbumTitleRow({
    super.key,
    required this.onCreateNewAlbum,
  });

  final VoidCallback onCreateNewAlbum;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            "control_bottom_app_bar_add_to_album",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
            ),
          ).tr(),
          TextButton.icon(
            onPressed: onCreateNewAlbum,
            icon: const Icon(Icons.add),
            label: Text(
              "control_bottom_app_bar_create_new_album",
              style: TextStyle(
                color: Theme.of(context).primaryColor,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ).tr(),
          ),
        ],
      ),
    );
  }
}
