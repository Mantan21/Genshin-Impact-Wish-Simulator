<script>
	export let type = '';
	export let width = '20px';
	export let height = 'auto';
	export let style = '';

	const pic = {
		acquaint: '/images/utility/acquaint-fate.webp',
		intertwined: '/images/utility/intertwined-fate.webp',
		stardust: '/images/utility/masterless-stardust.webp',
		starglitter: '/images/utility/masterless-starglitter.webp',
		primogem: '/images/utility/primogem.webp',
		genesis: '/images/utility/genesis.webp'
	};
</script>

<img src={pic[type]} alt={type} {width} {height} {style} />
