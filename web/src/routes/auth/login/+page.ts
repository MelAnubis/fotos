import { AppRoute } from '$lib/constants';
import { defaults, getServerConfig } from '@immich/sdk';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  defaults.fetch = fetch;
  const { isInitialized } = await getServerConfig();
  if (!isInitialized) {
    // Admin not registered
    redirect(302, AppRoute.AUTH_REGISTER);
  }

  return {
    meta: {
      title: 'Login',
    },
  };
}) satisfies PageLoad;
