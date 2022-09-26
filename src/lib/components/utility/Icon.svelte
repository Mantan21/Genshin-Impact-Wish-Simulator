<script>
	import { assets } from '$lib/store/stores';

	export let type = '';
	export let width = '20px';
	export let height = 'auto';
	export let style = '';

	$: pic = {
		acquaint: $assets['acquaint-fate.webp'],
		intertwined: $assets['intertwined-fate.webp'],
		stardust: $assets['masterless-stardust.webp'],
		starglitter: $assets['masterless-starglitter.webp'],
		primogem: $assets['primogem.webp'],
		genesis: $assets['genesis.webp']
	};
</script>

<img src={pic[type]} alt={type} {width} {height} {style} />
