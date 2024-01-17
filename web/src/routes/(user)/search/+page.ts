import { authenticate } from '$lib/utils/auth';
import { type AssetResponseDto, type SearchResponseDto, api } from '@api';
import type { PageLoad } from './$types';
import { QueryParameter } from '$lib/constants';

export const load = (async (data) => {
  await authenticate();
  const url = new URL(data.url.href);
  const term =
    url.searchParams.get(QueryParameter.SEARCH_TERM) || url.searchParams.get(QueryParameter.QUERY) || undefined;
  let results: SearchResponseDto | null = null;
  if (term) {
    const res = await api.searchApi.search({}, { params: data.url.searchParams });
    const assetItems: Array<AssetResponseDto> = (data as any).results?.assets.items;
    console.log('assetItems', assetItems);
    const assets = {
      ...res.data.assets,
      items: assetItems ? assetItems.concat(res.data.assets.items) : res.data.assets.items
    };
    results = {
      assets,
      albums: res.data.albums
    }
    // results = res.data;
  }

  return {
    term,
    results,
    meta: {
      title: 'Search',
    },
  };
}) satisfies PageLoad;
