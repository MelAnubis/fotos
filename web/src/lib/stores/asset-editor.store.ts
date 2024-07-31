import CropTool from '$lib/components/asset-viewer/editor/crop-tool/crop-tool.svelte';
import { mdiCropRotate } from '@mdi/js';
import { derived, get, writable } from 'svelte/store';

export const cropSettings = writable<CropSettings>({ x: 0, y: 0, width: 100, height: 100 });
export const cropImageSize = writable([1000, 1000]);
export const cropImageScale = writable(1);
export const cropAspectRatio = writable<CropAspectRatio>('free');
export const cropSettingsChanged = writable<boolean>(false);

export const showCancelConfirmDialog = writable<boolean | CallableFunction>(false);

export const editTypes = [
  {
    name: 'crop',
    icon: mdiCropRotate,
    component: CropTool,
    changesFlag: cropSettingsChanged,
  },
];

export function closeEditorCofirm(closeCallback: CallableFunction) {
  if (get(hasChanges)) {
    showCancelConfirmDialog.set(closeCallback);
  } else {
    closeCallback();
  }
}

export const hasChanges = derived(
  editTypes.map((t) => t.changesFlag),
  ($flags) => {
    return $flags.some(Boolean);
  },
);

export function resetGlobalCropStore() {
  cropSettings.set({ x: 0, y: 0, width: 100, height: 100 });
  cropImageSize.set([1000, 1000]);
  cropImageScale.set(1);
  cropAspectRatio.set('free');
  cropSettingsChanged.set(false);
  showCancelConfirmDialog.set(false);
}

export type CropAspectRatio =
  | '1:1'
  | '16:9'
  | '4:3'
  | '3:2'
  | '7:5'
  | '9:16'
  | '3:4'
  | '2:3'
  | '5:7'
  | 'free'
  | 'reset';

export type CropSettings = {
  x: number;
  y: number;
  width: number;
  height: number;
};
