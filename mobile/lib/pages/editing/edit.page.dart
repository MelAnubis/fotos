import 'dart:io';
import 'dart:typed_data';
import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:immich_mobile/entities/asset.entity.dart';
import 'package:immich_mobile/widgets/common/immich_image.dart';
import 'package:immich_mobile/widgets/common/immich_toast.dart';
import 'package:auto_route/auto_route.dart';
import 'package:immich_mobile/routing/router.dart';
import 'package:photo_manager/photo_manager.dart';
import 'package:path/path.dart' as p;
import 'package:immich_mobile/providers/album/album.provider.dart';

/// A stateless widget that provides functionality for editing an image.
///
/// This widget allows users to edit an image provided either as an [Asset] or
/// directly as an [Image]. It ensures that exactly one of these is provided.
///
/// It also includes a conversion method to convert an [Image] to a [Uint8List] to save the image on the user's phone
/// They automatically navigate to the [HomePage] with the edited image saved and they eventually get backed up to the server.
@immutable
@RoutePage()
class EditImagePage extends ConsumerWidget {
  final Asset asset;
  final Image image;
  final bool isEdited;

  const EditImagePage({
    super.key,
    required this.asset,
    required this.image,
    required this.isEdited,
  });
  Future<Uint8List> _imageToUint8List(Image image) async {
    final Completer<Uint8List> completer = Completer();
    image.image.resolve(const ImageConfiguration()).addListener(
          ImageStreamListener(
            (ImageInfo info, bool _) {
              info.image
                  .toByteData(format: ImageByteFormat.png)
                  .then((byteData) {
                if (byteData != null) {
                  completer.complete(byteData.buffer.asUint8List());
                } else {
                  completer.completeError('Failed to convert image to bytes');
                }
              });
            },
            onError: (exception, stackTrace) =>
                completer.completeError(exception),
          ),
        );
    return completer.future;
  }

  Future<void> _saveEditedImage(
    BuildContext context,
    Asset asset,
    Image image,
    WidgetRef ref,
  ) async {
    try {
      final Uint8List imageData = await _imageToUint8List(image);
      await PhotoManager.editor.saveImage(
        imageData,
        title: "${p.withoutExtension(asset.fileName)}_edited.jpg",
      );
      await ref.read(albumProvider.notifier).getDeviceAlbums();
      Navigator.of(context).popUntil((route) => route.isFirst);
    } catch (e) {
      ImmichToast.show(
        durationInSecond: 6,
        context: context,
        msg: 'Error: $e',
        gravity: ToastGravity.CENTER,
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final Image imageWidget =
        Image(image: ImmichImage.imageProvider(asset: asset));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit'),
        backgroundColor: Theme.of(context).canvasColor,
        leading: IconButton(
          icon: Icon(
            Icons.close_rounded,
            color: Theme.of(context).primaryColor,
            size: 24,
          ),
          onPressed: () =>
              Navigator.of(context).popUntil((route) => route.isFirst),
        ),
        actions: <Widget>[
          TextButton(
            onPressed: isEdited
                ? () => _saveEditedImage(context, asset, image, ref)
                : null,
            child: Text(
              'Save to gallery',
              style: TextStyle(
                color: isEdited ? Theme.of(context).primaryColor : Colors.grey,
              ),
            ),
          ),
        ],
      ),
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.7,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
                color:
                    isEdited ? Theme.of(context).iconTheme.color : Colors.grey,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: image,
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(7),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  spreadRadius: 2,
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(7),
              child: Image(
                image: image.image,
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
      bottomNavigationBar: Container(
        height: 70,
        margin: const EdgeInsets.only(bottom: 60, right: 10, left: 10, top: 10),
        decoration: BoxDecoration(
          color: Theme.of(context).bottomAppBarTheme.color,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            IconButton(
              icon: Icon(
                Platform.isAndroid
                    ? Icons.crop_rotate_rounded
                    : Icons.crop_rotate_rounded,
                color: Theme.of(context).iconTheme.color,
                size: 25,
              ),
              onPressed: () {
                context.pushRoute(
                  CropImageRoute(asset: asset, image: imageWidget),
                );
              },
            ),
            Text('Crop', style: Theme.of(context).textTheme.displayMedium),
          ],
        ),
      ),
    );
  }
}
