import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration/ExpirationPlugin';

const cacheVersion = 'v3';
const maxAgeSeconds = 15 * 24 * 60 * 60; // 15 Days
const maxEntries = 60;

clientsClaim();
skipWaiting();
cleanupOutdatedCaches();

setCacheNameDetails({
	prefix: 'WishSim',
	precache: 'Core',
	suffix: cacheVersion
});

let precache = self.__WB_MANIFEST;
precache = [];
precacheAndRoute(precache, { ignoreURLParametersMatching: [/.*/] });

registerRoute('/', new NetworkFirst({ cacheName: `Static-${cacheVersion}` }));

registerRoute(
	new RegExp('.(?:/?pwa=true|/?pwasc)'),
	new NetworkFirst({
		cacheName: `Static-${cacheVersion}`,
		plugins: [
			new ExpirationPlugin({ maxEntries, maxAgeSeconds }),
			{
				cachedResponseWillBeUsed: ({ cachedResponse }) => {
					if (cachedResponse) return cachedResponse;
					return caches.match('/');
				},
				cacheWillUpdate: () => null // prevent update cache
			}
		]
	})
);

registerRoute(
	({ url, request }) => {
		const isAudio = url.href.includes('sfx');
		const isVideo = url.href.includes('/videos');

		const imgPath = url.pathname.includes('/internal/immutable/assets');
		const transformPath = url.href.match(/(\/transform\/|\/cb\/)/);
		const imagePaths = imgPath || transformPath;

		const matchImage = url.href.match(new RegExp('.(?:svg|webp|jpg|png|jpeg)')) || [];
		const isMatch = matchImage.length > 0;
		const isImage = (request.destination === 'image' || isMatch) && imagePaths;
		return isAudio || isImage || isVideo;
	},
	new CacheFirst({
		cacheName: `Static-${cacheVersion}`,
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			new ExpirationPlugin({ maxEntries, maxAgeSeconds })
		]
	})
);

registerRoute(
	({ url }) => {
		const font = url.href.match(new RegExp('.(?:woff|woff2|ttf)$')) || [];
		return font.length > 0;
	},
	new NetworkFirst({
		cacheName: `Static-${cacheVersion}`,
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			new ExpirationPlugin({ maxEntries, maxAgeSeconds })
		]
	})
);

registerRoute(
	new RegExp('/internal/immutable/assets'),
	new CacheFirst({
		cacheName: `Chunks-${cacheVersion}`,
		plugins: [new ExpirationPlugin({ maxEntries, maxAgeSeconds })]
	})
);

registerRoute(
	({ url }) => {
		const cdnParser = url.href.match('/js/image-cdn');
		const isIcons = url.pathname.match('/icons');
		const isStatic = url.pathname.match(new RegExp('.(?:css|js|json)$'));
		const validOrigin = url.origin.match(new RegExp(/wishsimulator/));
		return (cdnParser || isIcons || isStatic) && validOrigin;
	},
	new NetworkFirst({
		cacheName: `Chunks-${cacheVersion}`,
		plugins: [new ExpirationPlugin({ maxEntries, maxAgeSeconds })]
	})
);
