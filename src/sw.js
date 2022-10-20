import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

clientsClaim();
skipWaiting();
cleanupOutdatedCaches();

let preCache = self.__WB_MANIFEST;
setCacheNameDetails({
	prefix: 'WishSim',
	precache: 'Core'
});

preCache = ['./favicon.ico', './appmanifest.json'];
precacheAndRoute(preCache);

registerRoute(
	new RegExp('.(?:css|js)$'),
	new NetworkFirst({
		cacheName: 'chunks'
	})
);

registerRoute('./', new NetworkFirst({ cacheName: 'Static' }));
registerRoute(new RegExp('.(?:html)$'), new NetworkFirst({ cacheName: 'Static' }));

registerRoute(
	new RegExp('.(?:woff|woff2|ttf)$'),
	new CacheFirst({
		cacheName: 'Static'
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

