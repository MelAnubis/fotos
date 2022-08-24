export const prerender = false;
import { redirect } from '@sveltejs/kit';
import { api } from '@api';
import { browser } from '$app/env';
import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async () => {
	if (browser) {
		try {
			const { data: user } = await api.userApi.getMyUserInfo();
			console.log('user', user);
			// throw redirect(302, '/photos');

			goto('/photos');
		} catch (e) {}

		const { data } = await api.userApi.getUserCount();

		return {
			isAdminUserExist: data.userCount != 0
		};
	}
};
