import { AppRoute } from '$lib/constants';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ url }) => {
  enum LinkTarget {
    HOME = 'home',
    UNSUBSCRIBE = 'unsubscribe',
    VIEW_ASSET = 'view_asset',
    ACTIVATE_LICENSE = 'activate_license',
  }

  const queryParams = url.searchParams;
  const target = queryParams.get('target') as LinkTarget;
  switch (target) {
    case LinkTarget.HOME: {
      return redirect(302, AppRoute.PHOTOS);
    }

    case LinkTarget.UNSUBSCRIBE: {
      return redirect(302, `${AppRoute.USER_SETTINGS}?isOpen=notifications`);
    }

    case LinkTarget.VIEW_ASSET: {
      const id = queryParams.get('id');
      if (id) {
        return redirect(302, `${AppRoute.PHOTOS}/${id}`);
      }
      break;
    }

    case LinkTarget.ACTIVATE_LICENSE: {
      // https://my.immich.app/link?target=activate_license&licenseKey=IMCL-76S5-B4KG-4HXA-KRQF-C1G1-7PJ6-9V9V-7WQH
      const licenseKey = queryParams.get('licenseKey');
      const activationKey = queryParams.get('activationKey');

      if (licenseKey && activationKey) {
        return redirect(302, `${AppRoute.BUY}?licenseKey=${licenseKey}&activationKey=${activationKey}`);
      }

      if (licenseKey) {
        return redirect(302, `${AppRoute.BUY}?licenseKey=${licenseKey}`);
      }
    }
  }

  return redirect(302, AppRoute.PHOTOS);
}) satisfies PageLoad;
