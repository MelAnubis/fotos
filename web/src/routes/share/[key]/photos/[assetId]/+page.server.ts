export const prerender = false;
import { error } from '@sveltejs/kit';

import { serverApi } from '@api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const { key, assetId } = params;
		const { data: sharedLink } = await serverApi.shareApi.getSharedLinkByKey(key);
		const { data: asset } = await serverApi.assetApi.getAssetById(assetId, {
			params: {
				key
			}
		});

		if (!asset) {
			return error(404, 'Asset not found');
		}
		return {
			asset,
			sharedLink
		};
	} catch (e) {
		console.log('Error', e);
	}
};
