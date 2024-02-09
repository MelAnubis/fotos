import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

interface UpdateParamAction {
  param: string;
  value: string;
  add: boolean;
}

const getParamValues = (param: string) =>
  new Set((get(page).url.searchParams.get(param) || '').split(' ').filter((x) => x !== ''));

export const hasParamValue = (param: string, value: string) => getParamValues(param).has(value);

export const updateParamList = async ({ param, value, add }: UpdateParamAction) => {
  const values = getParamValues(param);

  if (add) {
    values.add(value);
  } else {
    values.delete(value);
  }

  get(page).url.searchParams.set(param, [...values.values()].join(' '));

  if (values.size === 0) {
    get(page).url.searchParams.delete(param);
  }

  await goto(get(page).url, { replaceState: true, noScroll: true, keepFocus: true });
};
