import 'package:auto_route/auto_route.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart' hide Store;
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:immich_mobile/modules/search/models/curated_content.dart';
import 'package:immich_mobile/modules/search/providers/search_page_state.provider.dart';
import 'package:immich_mobile/modules/search/ui/curated_people_row.dart';
import 'package:immich_mobile/modules/search/ui/curated_row.dart';
import 'package:immich_mobile/modules/search/ui/search_bar.dart';
import 'package:immich_mobile/modules/search/ui/search_row_title.dart';
import 'package:immich_mobile/modules/search/ui/search_suggestion_list.dart';
import 'package:immich_mobile/routing/router.dart';
import 'package:immich_mobile/shared/ui/immich_loading_indicator.dart';

// ignore: must_be_immutable
class SearchPage extends HookConsumerWidget {
  SearchPage({Key? key}) : super(key: key);

  FocusNode searchFocusNode = FocusNode();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isSearchEnabled = ref.watch(searchPageStateProvider).isSearchEnabled;
    final curatedLocation = ref.watch(getCuratedLocationProvider);
    final curatedObjects = ref.watch(getCuratedObjectProvider);
    final curatedPeople = ref.watch(getCuratedPeopleProvider);
    var isDarkTheme = Theme.of(context).brightness == Brightness.dark;
    double imageSize = MediaQuery.of(context).size.width / 3;

    TextStyle categoryTitleStyle = const TextStyle(
      fontWeight: FontWeight.bold,
      fontSize: 14.0,
    );

    Color categoryIconColor = isDarkTheme ? Colors.white : Colors.black;

    useEffect(
      () {
        searchFocusNode = FocusNode();
        return () => searchFocusNode.dispose();
      },
      [],
    );

    onSearchSubmitted(String searchTerm) async {
      searchFocusNode.unfocus();
      ref.watch(searchPageStateProvider.notifier).disableSearch();

      AutoRouter.of(context).push(
        SearchResultRoute(
          searchTerm: searchTerm,
        ),
      );
    }

    buildPeople() {
      return SizedBox(
        height: MediaQuery.of(context).size.width / 3,
        child: curatedPeople.when(
          loading: () => const Center(child: ImmichLoadingIndicator()),
          error: (err, stack) => Center(child: Text('Error: $err')),
          data: (person) => CuratedPeopleRow(
            content: person
                .map(
                  (o) => CuratedContent(
                    id: o.id,
                    label: o.name,
                  ),
                )
                .toList(),
            onTap: (content, index) {
              AutoRouter.of(context).push(
                PersonResultRoute(
                  personId: content.id,
                  personName: content.label,
                ),
              );
            },
            onNameTap: (person, index) => {print("Change name for $person")},
          ),
        ),
      );
    }

    buildPlaces() {
      return SizedBox(
        height: imageSize,
        child: curatedLocation.when(
          loading: () => const Center(child: ImmichLoadingIndicator()),
          error: (err, stack) => Center(child: Text('Error: $err')),
          data: (locations) => CuratedRow(
            content: locations
                .map(
                  (o) => CuratedContent(
                    id: o.id,
                    label: o.city,
                  ),
                )
                .toList(),
            imageSize: imageSize,
            onTap: (content, index) {
              AutoRouter.of(context).push(
                SearchResultRoute(
                  searchTerm: 'm:${content.label}',
                ),
              );
            },
          ),
        ),
      );
    }

    buildThings() {
      return SizedBox(
        height: imageSize,
        child: curatedObjects.when(
          loading: () => SizedBox(
            height: imageSize,
            child: const Center(child: ImmichLoadingIndicator()),
          ),
          error: (err, stack) => SizedBox(
            height: imageSize,
            child: Center(child: Text('Error: $err')),
          ),
          data: (objects) => CuratedRow(
            content: objects
                .map(
                  (o) => CuratedContent(
                    id: o.id,
                    label: o.object,
                  ),
                )
                .toList(),
            imageSize: imageSize,
            onTap: (content, index) {
              AutoRouter.of(context).push(
                SearchResultRoute(
                  searchTerm: 'm:${content.label}',
                ),
              );
            },
          ),
        ),
      );
    }

    return Scaffold(
      appBar: SearchBar(
        searchFocusNode: searchFocusNode,
        onSubmitted: onSearchSubmitted,
      ),
      body: GestureDetector(
        onTap: () {
          searchFocusNode.unfocus();
          ref.watch(searchPageStateProvider.notifier).disableSearch();
        },
        child: Stack(
          children: [
            ListView(
              children: [
                SearchRowTitle(
                  title: "search_page_people".tr(),
                  onViewAllPressed: () => {},
                ),
                buildPeople(),
                SearchRowTitle(
                  title: "search_page_places".tr(),
                  onViewAllPressed: () => AutoRouter.of(context).push(
                    const CuratedLocationRoute(),
                  ),
                ),
                buildPlaces(),
                SearchRowTitle(
                  title: "search_page_things".tr(),
                  onViewAllPressed: () => AutoRouter.of(context).push(
                    const CuratedObjectRoute(),
                  ),
                ),
                buildThings(),
                const SizedBox(height: 24.0),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'search_page_your_activity',
                    style: Theme.of(context).textTheme.titleSmall,
                  ).tr(),
                ),
                ListTile(
                  leading: Icon(
                    Icons.star_outline,
                    color: categoryIconColor,
                  ),
                  title:
                      Text('search_page_favorites', style: categoryTitleStyle)
                          .tr(),
                  onTap: () => AutoRouter.of(context).push(
                    const FavoritesRoute(),
                  ),
                ),
                const CategoryDivider(),
                ListTile(
                  leading: Icon(
                    Icons.schedule_outlined,
                    color: categoryIconColor,
                  ),
                  title: Text(
                    'search_page_recently_added',
                    style: categoryTitleStyle,
                  ).tr(),
                  onTap: () => AutoRouter.of(context).push(
                    const RecentlyAddedRoute(),
                  ),
                ),
                const SizedBox(height: 24.0),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Text(
                    'search_page_categories',
                    style: Theme.of(context).textTheme.titleSmall,
                  ).tr(),
                ),
                ListTile(
                  title: Text('Screenshots', style: categoryTitleStyle).tr(),
                  leading: Icon(
                    Icons.screenshot,
                    color: categoryIconColor,
                  ),
                  onTap: () => AutoRouter.of(context).push(
                    SearchResultRoute(
                      searchTerm: 'screenshots',
                    ),
                  ),
                ),
                const CategoryDivider(),
                ListTile(
                  title: Text('search_page_selfies', style: categoryTitleStyle)
                      .tr(),
                  leading: Icon(
                    Icons.photo_camera_front_outlined,
                    color: categoryIconColor,
                  ),
                  onTap: () => AutoRouter.of(context).push(
                    SearchResultRoute(
                      searchTerm: 'selfies',
                    ),
                  ),
                ),
                const CategoryDivider(),
                ListTile(
                  title: Text('search_page_videos', style: categoryTitleStyle)
                      .tr(),
                  leading: Icon(
                    Icons.play_circle_outline,
                    color: categoryIconColor,
                  ),
                  onTap: () => AutoRouter.of(context).push(
                    const AllVideosRoute(),
                  ),
                ),
                const CategoryDivider(),
                ListTile(
                  title: Text(
                    'search_page_motion_photos',
                    style: categoryTitleStyle,
                  ).tr(),
                  leading: Icon(
                    Icons.motion_photos_on_outlined,
                    color: categoryIconColor,
                  ),
                  onTap: () => AutoRouter.of(context).push(
                    const AllMotionPhotosRoute(),
                  ),
                ),
              ],
            ),
            if (isSearchEnabled)
              SearchSuggestionList(onSubmitted: onSearchSubmitted),
          ],
        ),
      ),
    );
  }
}

class CategoryDivider extends StatelessWidget {
  const CategoryDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.only(
        left: 72,
        right: 16,
      ),
      child: Divider(
        height: 0,
      ),
    );
  }
}
