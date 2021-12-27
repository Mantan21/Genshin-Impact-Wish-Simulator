<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import weapons from '$lib/setup/weapons.json';
	import characters from '$lib/setup/characters.json';
	import WishListResult from '$lib/banner/WishListResult.svelte';
	let wishlist = [
		{
			type: 'character',
			rarity: 4,
			name: 'yanfei',
			isNew: true,
			stelaFortuna: false,
			fateQty: 10,
			vision: 'pyro',
			style: ''
		},
		{
			type: 'weapon',
			rarity: 3,
			name: '',
			isNew: false,
			fateType: '',
			fateQty: 15,
			weaponType: 'claymore',
			style: ''
		}
	];

	const getList = (decoded) => {
		let list = [];
		const arr = decoded.split('|');

		arr.forEach((v) => {
			let [name, rarity, type, isNew, fateType, stelaFortuna] = v.split('/');
			let fateQty = rarity > 3 ? 10 : 15;
			isNew = !(isNew === '0');
			stelaFortuna = stelaFortuna === '1';
			rarity = parseInt(rarity, 10);
			fateType = fateType !== 'undefined' ? fateType : false;

			if (type === 'weapon') {
				const { weaponType, style } = weapons.data
					.filter((d) => d.rarity === rarity)[0]
					.list.filter((d) => d.name === name)[0];

				list.push({
					type,
					weaponType,
					name,
					rarity,
					isNew,
					stelaFortuna,
					fateType,
					fateQty,
					style
				});
				return;
			}

			if (type === 'character') {
				const { vision, style } = characters.data
					.filter((d) => d.rarity === rarity)[0]
					.list.filter((d) => d.name === name)[0];

				list.push({
					type,
					vision,
					name,
					rarity,
					isNew,
					stelaFortuna,
					fateType,
					fateQty,
					style
				});
				return;
			}
		});
		wishlist = list;
	};

	const encoded = $page.query.get('a');
	onMount(() => {
		try {
			if (encoded) {
				let decoded = atob(encoded);
				return getList(decoded);
			}
			window.location.href = '/';
		} catch (e) {
			window.location.href = '/';
		}
	});
</script>

<div class="wish-result">
	<WishListResult preview {wishlist} />
</div>

<style>
	.wish-result {
		width: 100vw;
		height: 100vh;
		background-color: #fff;
		background-image: url('/assets/images/background/splash-background.webp');
		background-size: cover;
	}
</style>
