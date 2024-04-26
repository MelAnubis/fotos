import 'package:auto_route/auto_route.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/extensions/asyncvalue_extensions.dart';
import 'package:immich_mobile/modules/search/models/curated_content.dart';
import 'package:immich_mobile/modules/search/providers/search_page_state.provider.dart';
import 'package:immich_mobile/modules/search/ui/explore_grid.dart';

@RoutePage()
class CuratedLocationPage extends HookConsumerWidget {
  const CuratedLocationPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    AsyncValue<List<CuratedContent>> places = ref.watch(getPlacesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'curated_location_page_title',
        ).tr(),
        leading: IconButton(
          onPressed: () => context.popRoute(),
          icon: const Icon(Icons.arrow_back_ios_rounded),
        ),
      ),
      body: places.widgetWhen(
        onData: (data) => ExploreGrid(
          curatedContent: data,
        ),
      ),
    );
  }
}
