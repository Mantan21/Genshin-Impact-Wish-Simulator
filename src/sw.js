import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

clientsClaim();
skipWaiting();
cleanupOutdatedCaches();

setCacheNameDetails({
	prefix: 'WishSim',
	precache: 'Core',
	suffix: 'v1'
});

let precache = self.__WB_MANIFEST;
precache = [];
precacheAndRoute(precache, { ignoreURLParametersMatching: [/.*/] });

registerRoute('/', new NetworkFirst({ cacheName: 'Static' }));

registerRoute(
	new RegExp('.(?:/?pwa=true|/?pwasc)'),
	new NetworkFirst({
		cacheName: 'Static',
		plugins: [
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
	({ url }) =>
		url.href.includes('videos') || url.href.includes('images') || url.href.includes('sfx'),
	new CacheFirst({
		cacheName: 'Static',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 30 * 24 * 60 * 60
			})
		]
	})
);

registerRoute(
	new RegExp('.(?:woff|woff2|ttf)$'),
	new CacheFirst({
		cacheName: 'Static'
	})
);

registerRoute(
	new RegExp('.(?:css|js|json)$'),
	new NetworkFirst({
		cacheName: 'Chunks',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 15 * 24 * 60 * 60
			})
		]
	})
);
