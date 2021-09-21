<script>
	import { onMount } from 'svelte';
	import OverlayScrollbars from 'overlayscrollbars';
	import { showBeginner, bannerActive, backsound, showDisclaimer } from '$lib/store/stores';
	import updates from '$lib/setup/updates.json';
	import PopUp from './PopUp.svelte';

	let audio;
	let content;
	const confirm = () => {
		audio.play();
		showDisclaimer.set(false);
		backsound.set(true);
		if ($showBeginner) bannerActive.set('beginner');
		else bannerActive.set('limited');
	};

	onMount(() => {
		audio = document.querySelector('#button-sfx');
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
		</div>
		<p class="sp">
			If you find any bugs or problems, please email me <br />
			( <a href="mailto:lockagz@gmail.com"> lockagz@gmail.com </a> )
		</p>
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
</style>
