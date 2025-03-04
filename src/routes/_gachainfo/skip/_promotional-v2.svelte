<script>
	import { t } from 'svelte-i18n';
	import { assets, activeVersion, customData, isCustomBanner } from '$lib/store/app-stores';
	import { getName } from '$lib/helpers/nameText';
	import { lazyLoad } from '$lib/helpers/lazyload';
	import Iklan from '$lib/components/Iklan.svelte';
	import updates from '$lib/data/updates.json';
	import characters from '$lib/data/characters.json';


	const { patch: version, phase } = $activeVersion;

	let processedUpdates = [...updates.data].reverse();

	let latestIndex = processedUpdates.findIndex(item => item.patch == version);
	let newPatchIndex = latestIndex + 1;

	function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);}

	function caps(str) {
    return str.toUpperCase();
}
</script>

{#each processedUpdates as { video, description, date, patch, character }, i (i)}
	{#if i == newPatchIndex}
		<br>
		<h2>
			<i class="tgl"> {date} </i>
				( New Patch )
		</h2>
		{#each character as name, i (i)}
			{#each [...characters.data] as characterName}
				{#if characterName.name === name}
					<p>{@html description[i]}</p> 
					<br>
					<table>
						<tr>
							<th>{$t('skip.origin')}</th>
							{#if characterName.class != null}
								<th>{$t('skip.class')}</th>
							{/if}
							<th>{$t('skip.vision')}</th>
						</tr>
						<tr>
							<td>{capitalize(characterName.origin)}</td>
							{#if characterName.class != null}
								<td>{caps(characterName.class)}</td>
							{/if}
							<td>{capitalize(characterName.vision)}</td>
						</tr>
					</table>
					<br>
					{#if characterName.b_dmg != null}
						<table>
							<tr>
								<th>{$t('skip.bdmg')}</th>
								{#if characterName.b_mult != null}
									<th>{$t('skip.bmult')}</th>
									<th>{$t('skip.c4mult')}</th>
									<th>{$t('skip.c6mult')}</th>
								{:else}
									<th>{$t('skip.c4dmg')}</th>
									<th>{$t('skip.c6dmg')}</th>
								{/if}
							</tr>
							<tr>
								<td>{characterName.b_dmg}</td>
								{#if characterName.b_mult != null}
									<td>{characterName.b_mult}</td>
									<td>{characterName.c4_mult}</td>
									<td>{characterName.c6_mult}</td>
								{:else}
									<td>{characterName.c4_dmg}</td>
									<td>{characterName.c6_dmg}</td>
								{/if}
							</tr>
						</table>
					<br>
					{/if}
					<div align="center"><iframe width="640" height="360"
						src={video[i]} title="Preview">
						</iframe></div>
					<br>
				{/if}
			{/each}
		{/each}
	{:else if i === null || newPatchIndex === null}
			<h1>End of Session</h1>
	{/if}
{/each}

<style>
	.beginner :global(span) {
		color: #cba885;
	}

	.gi-star {
		color: #feca33;
	}

	h2 {
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
	}

	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		font-size: calc(0.014 * var(--content-width));
		color: #fff;
		display: flex;
		align-items: center;
		line-height: 0;
		padding: 0.5% 1%;
	}
	h3 span {
		padding-left: 2rem;
		color: #fff;
	}
	h3.star5 {
		background-color: #cfb383;
	}
	h3.star4 {
		background-color: #b5a8c9;
	}
	.weapon-flat {
		color: #bd6932;
	}

	.name {
		flex-basis: 35%;
		padding: 1.5%;
	}
	.name span {
		font-size: calc(0.014 * var(--content-width));
		display: block;
		padding: 2% 0;
	}
	.pic {
		flex-basis: 65%;
		padding-bottom: 1%;
	}

	.pic-item {
		margin: 2% 1.5% 0 0;
		padding-bottom: 4%;
		display: inline-block;
		position: relative;
		background-color: #fff;
		border-radius: 4%;
		overflow: hidden;
	}

	picture {
		height: calc(0.095 * var(--content-width));
		display: block;
		aspect-ratio: 1/1;
		background-size: cover;
		position: relative;
		overflow: hidden;
		border-bottom-right-radius: 20%;
	}

	img {
		width: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
	}

	img.claymore {
		transform: rotate(18deg) scale(1.15) translateX(-0.7em);
	}

	img.bow {
		transform: rotate(10deg) scale(1.25) translate(-0.5em, 0em);
	}

	img.polearm {
		transform: rotate(10deg) scale(1.5) translate(-12%, 12%);
		height: 200%;
	}

	img.sword {
		transform: rotate(10deg) scale(1.2) translateY(-1em) translate(-0.2em, 0.5em);
	}

	.stars {
		position: absolute;
		bottom: 10%;
		left: 50%;
		font-size: calc(0.015 * var(--content-width));
		transform: translateX(-50%);
	}

	picture i {
		position: absolute;
		z-index: +1;
		top: 0;
		left: 0;
		font-size: 1.3rem;
	}

	caption {
		font-size: calc(0.013 * var(--content-width));
		display: block;
		width: 100%;
		text-align: center;
		position: absolute;
		padding: 3%;
	}

	table {
		padding: 0 0 calc(0.02 * var(--content-width));
		width: 100%;
		font-size: 0.9rem;
		border: 1px solid #CFB383;
    	border-collapse: collapse;
	}
	.v2 .table {
		padding: 0 0 calc(0.02 * var(--content-width));
	}

	th, td {
        padding: 8px 12px;
		margin: 1px;
		border: 1px solid #CFB383;
    }

	th {
        text-align: center;
        background-color: #ede1ca;
    }

	td {
        text-align: left;
    }
</style>
