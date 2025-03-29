<script>
	import { getContext } from 'svelte';
	import { t } from 'svelte-i18n';
	import { cookie } from '$lib/helpers/dataAPI/api-cookie';
	import { assets, genesis, primogem } from '$lib/store/app-stores';
	import { localBalance } from '$lib/helpers/dataAPI/api-localstore';
	import { playSfx } from '$lib/helpers/audio/audio';

	import Modal from '$lib/components/ModalTpl.svelte';
	import Icon from '$lib/components/Icon.svelte';

    import SvgIcon from '$lib/components/SVGIcon.svelte';
    import characters from '$lib/data/characters.json';

    export let character;
    export let charion;
    export let outfit;

    const closeModal = getContext('closeModal');
    
	function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);}

	function caps(str) {
    return str.toUpperCase();
}
</script>

<Modal on:cancel={closeModal} blank>
    <div class="container">
        <div class="row">
            <img src={$assets[`face/${outfit || character}`]} alt={outfit || character} style="width: 15%;"/>
            <h1>{capitalize(character)}</h1>
            <div class="icon" style="width: 15%;">
                <SvgIcon name={charion} />
            </div>
        </div>
    </div>

    <div class="details">
        {#each [...characters.data] as characterName}
            {#if characterName.name === character}
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
            {/if}
        {/each}
    </div>
</Modal>

<style>
	.header {
		display: flex;
		width: 100%;
		align-items: center;
	}

	button.back {
		font-size: 2rem;
		padding: 0.4rem;
		line-height: 1rem;
	}

	.title {
		width: 100%;
		padding: 0.4rem;
		font-size: 1.5rem;
		line-height: 1rem;
	}

	.body {
		display: flex;
		width: center;
		width: 100%;
		flex-direction: column;
	}

    .container {
    display: flex;
    justify-content: center;
    width: 100%;
    }

    .row {
		display: flex;
        justify-content: space-between;
		width: 100%;
		align-items: center;
        padding: 0.4rem;
        margin: 2% 2% 2% 2%;
	}

    h2 {
        flex-grow: 1;
		font-size: calc(0.015 * var(--content-width));
		padding: calc(0.007 * var(--content-width)) 0;
        text-align: center;
	}

    table {
		padding: 0 0 calc(0.02 * var(--content-width));
		width: 100%;
		font-size: 0.9rem;
		border: 1px solid #CFB383;
    	border-collapse: collapse;
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

	:global(.mobile) .item {
		padding: 0.3rem;
	}

    .icon :global(svg) {
		width: 80%;
		aspect-ratio: 1/1;
	}
</style>
