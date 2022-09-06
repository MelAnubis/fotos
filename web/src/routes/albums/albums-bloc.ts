import {
	notificationController,
	NotificationType
} from '$lib/components/shared-components/notification/notification';
import { AlbumResponseDto, api } from '@api';
import { OnShowContextMenuDetail } from '$lib/components/album-page/album-card.svelte';
import { writable, get } from 'svelte/store';

type AlbumsProps = { albums: AlbumResponseDto[] };

export const useAlbums = (props: AlbumsProps) => {
	const albums = writable([...props.albums]);
	const isShowContextMenu = writable(false);
	const contextMenuPosition = writable<OnShowContextMenuDetail>({ x: 0, y: 0 });
	const contextMenuTargetAlbum = writable<AlbumResponseDto | undefined>();

	async function loadAlbums(): Promise<void> {
		const { data } = await api.albumApi.getAllAlbums();
		albums.set(data);

		// Delete album that has no photos and is named 'Untitled'
		for (const album of data) {
			if (album.albumName === 'Untitled' && album.assetCount === 0) {
				setTimeout(async () => {
					await deleteAlbum(album);
					const _albums = get(albums);
					albums.set(_albums.filter((a) => a.id !== album.id));
				}, 500);
			}
		}
	}

	async function createAlbum(): Promise<AlbumResponseDto | undefined> {
		try {
			const { data: newAlbum } = await api.albumApi.createAlbum({
				albumName: 'Untitled'
			});

			return newAlbum;
		} catch (e) {
			console.error('Error [createAlbum] ', e);
			notificationController.show({
				message: 'Error creating album, check console for more details',
				type: NotificationType.Error
			});
		}
	}

	async function deleteAlbum(album: AlbumResponseDto): Promise<void> {
		try {
			await api.albumApi.deleteAlbum(album.id);
		} catch (e) {
			console.error('Error [deleteAlbum] ', e);
		}
	}

	async function showAlbumContextMenu(
		contextMenuDetail: OnShowContextMenuDetail,
		album: AlbumResponseDto
	): Promise<void> {
		contextMenuTargetAlbum.set(album);

		contextMenuPosition.set({
			x: contextMenuDetail.x,
			y: contextMenuDetail.y
		});
		const _isShowContextMenu = get(isShowContextMenu);
		isShowContextMenu.set(!_isShowContextMenu);
	}

	async function deleteSelectedContextAlbum(): Promise<void> {
		const albumToDelete = get(contextMenuTargetAlbum);
		if (!albumToDelete) {
			return;
		}
		if (
			window.confirm(
				`Are you sure you want to delete album ${albumToDelete.albumName}? If the album is shared, other users will not be able to access it.`
			)
		) {
			try {
				await api.albumApi.deleteAlbum(albumToDelete.id);
				const _albums = get(albums);
				albums.set(_albums.filter((a) => a.id !== albumToDelete.id));
			} catch (e) {
				console.error('Error [userDeleteMenu] ', e);
				notificationController.show({
					message: 'Error deleting user, check console for more details',
					type: NotificationType.Error
				});
			}
		}

		isShowContextMenu.set(false);
	}

	return {
		albums,
		isShowContextMenu,
		contextMenuPosition,
		loadAlbums,
		createAlbum,
		showAlbumContextMenu,
		deleteSelectedContextAlbum
	};
};
