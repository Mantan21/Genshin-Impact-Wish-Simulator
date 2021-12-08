<script>
	import { onMount } from 'svelte';
	import OverlayScrollbars from 'overlayscrollbars';
	import { bannerActive, backsound, showDisclaimer } from '$lib/store/stores';
	import updates from '$lib/setup/updates.json';
	import PopUp from './PopUp.svelte';

	let content;
	const confirm = () => {
		showDisclaimer.set(false);
		backsound.set(true);
		bannerActive.set(0);
	};

	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<PopUp
	show={$showDisclaimer}
	title="Genshin Impact Wish Simulator"
	button="confirm"
	on:confirm={confirm}
>
	<section>
		<p class="sp">This is purely a fan made Application, enjoy it !</p>
		<div class="updates" bind:this={content}>
			{#each updates.data.reverse() as { date, description }, i}
				<span>
					<i class="tgl"> {date} </i>
					{#if i === 0} ( Latest Update ) {/if}
				</span>
				{#each description as txt} <p>{@html txt}</p> {/each}
			{/each}
			<div style="height: .5rem" />
		</div>
		<p class="sp">
			If you find any bugs or problems, please report an issue to <a
				href="https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator"
				target="_blank"
			>
				Github here
			</a>
		</p>
		<span style="font-size: 1rem">Support</span>
		<div class="support">
			<a class="kofi" href="https://ko-fi.com/mantan21" target="_blank">
				<img src="/assets/images/utility/donate-kofi.png" alt="ko-fi icon" />
				<span> Ko-fi </span>
			</a>
			<a class="trakteer" href="https://trakteer.id/GenshinWishSimulator" target="_blank">
				<img src="https://cdn.trakteer.id/images/embed/trbtn-icon.png" alt="trakteer icon" />
				<span> Trakteer </span>
			</a>
		</div>
		<p class="credit">All assets used in this site are owned by Mihoyo.</p>
	</section>
</PopUp>

<style>
	section {
		width: 100%;
		padding: 0 1.5rem 1rem;
	}
	.credit {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 0.9rem;
	}

	.updates {
		text-align: left;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: #fff;
		font-size: 0.97rem;
		height: 8rem;
		padding: 0 1rem;
		display: block;
		overflow: hidden;
	}

	.updates span {
		font-weight: bold;
		color: #f7cf33;
		display: block;
		padding-top: 0.5rem;
	}
	.updates .tgl {
		color: #bd6932;
	}

	.updates p {
		padding-left: 1rem;
		position: relative;
		line-height: 1rem;
		margin: 0.5rem 0;
	}
	.updates p::before {
		content: '*';
		display: inline-block;
		width: 10px;
		line-height: 0;
		font-size: 1.3rem;
		padding-top: 0.5rem;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.sp {
		font-size: 0.97rem;
		padding: 0.5rem 0 1rem;
	}

	.support {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.support a {
		width: 10rem;
		height: 2.2rem;
		margin: 0.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 40px;
		transition: all 0.2s;
		color: #fff;
		font-size: 1rem;
	}

	a.kofi {
		background-color: #00b9fe;
	}
	a.trakteer {
		background-color: #be1e2d;
	}

	a:active {
		transform: scale(0.9);
		background-color: #fff;
		color: #000;
	}

	a img {
		height: 80%;
		margin-right: 0.5rem;
	}
</style>
