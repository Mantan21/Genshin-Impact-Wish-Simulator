<script>
	export let type = '';
	export let width = '20px';
	export let height = 'auto';
	export let style = '';

	const pic = {
		acquaint: './assets/images/utility/acquaint-fate.webp',
		intertwined: './assets/images/utility/intertwined-fate.webp',
		stardust: './assets/images/utility/masterless-stardust.webp',
		starglitter: './assets/images/utility/masterless-starglitter.webp',
		primogem: './assets/images/utility/primogem.webp',
		genesis: './assets/images/utility/genesis.webp'
	};
</script>

<img src={pic[type]} alt={type} {width} {height} {style} />
