<script>
	import { getContext, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import OverlayScrollbars from 'overlayscrollbars';
	import { data } from '$lib/setup/updates.json';
	import PopUp from './PopUp.svelte';

	export let show = true;
	let content;

	const closeDisclaimer = getContext('closeDisclaimer');
	const updates = data.filter(({ featured }) => !!featured);

	onMount(() => {
		OverlayScrollbars(content, { sizeAutoCapable: false, className: 'os-theme-light' });
	});
</script>

<PopUp {show} title={$t('site.title')} button="confirm" on:confirm={closeDisclaimer}>
	<section>
		<p class="sp">{$t('site.fanmade')}</p>
		<div class="updates" bind:this={content}>
			{#each updates.reverse() as { description, date }, i (i)}
				<span>
					<i class="tgl"> {date} </i>
					{#if i === 0} ( Latest Update ) {/if}
				</span>
				{#each description as txt} <p>{@html txt}</p> {/each}
			{/each}
			<div style="height: .5rem" />
		</div>
		<span style="font-size: 1rem">Support</span>
		<div class="support">
			<a class="kofi" href="https://ko-fi.com/mantan21" target="_blank">
				<img src="/assets/images/utility/donate-kofi.png" alt="ko-fi icon" />
				<span> Ko-fi </span>
			</a>
			<a class="saweria" href="https://saweria.co/mantan21" target="_blank">
				<img
					src="data:image/webp;base64,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"
					alt="Saweria icon"
				/>
				<span> Saweria </span>
			</a>
		</div>
		<p class="credit">{$t('site.disclaimer')}</p>
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
	a.saweria {
		background-color: #ffe3af;
		color: #bd6932;
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
