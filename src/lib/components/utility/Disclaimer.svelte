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

<PopUp {show} title={$t('title')} button="confirm" disclaimer on:confirm={closeDisclaimer}>
	<section>
		<p class="sp">{$t('fanmade')}</p>
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
				<img src="/images/utility/donate-kofi.png" alt="ko-fi icon" />
				<span> Ko-fi </span>
			</a>
			<a class="sociabuzz" href="https://sociabuzz.com/mantan21/posts" target="_blank">
				<img src="/images/utility/sociabuzz.png" alt="Sociabuzz icon" />
				<span> Sociabuzz </span>
			</a>
		</div>
		<p class="credit">{$t('disclaimer')}</p>
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
		background-color: #24ade1;
	}
	a.sociabuzz {
		background-image: linear-gradient(to right, #3fa9f5, #78c845);
		color: #fff;
	}
	a.sociabuzz img {
		border-radius: 100%;
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
