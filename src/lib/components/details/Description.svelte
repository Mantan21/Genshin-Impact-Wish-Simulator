<script>
	import { APP_TITLE } from '$lib/env';
	import { getName } from '$lib/functions/nameText';
	import Ads from '../utility/Iklan.svelte';

	export let bannerType;
	export let bannerName = '';
	export let data = [];

	const item5Star = ['events', 'weapons'].includes(bannerType)
		? data.find(({ rarity }) => rarity === 5).items
		: '';
	const item4Star = ['events', 'weapons'].includes(bannerType)
		? data.find(({ rarity }) => rarity === 4).items
		: '';
</script>

<svelte:head>
	<title>
		{bannerName} | {APP_TITLE}
	</title>
</svelte:head>

<Ads type="banner" />

{#if bannerType === 'beginner'}
	<h3>No time limit (Closes after 20 wishes)</h3>
{:else if ['events', 'weapons'].includes(bannerType)}
	<h3>Limited Time Event</h3>
{:else}
	<h3>Permanent</h3>
{/if}

{#if bannerType === 'beginner'}
	{#each data[0].items as { name, title, vision }, x}
		<p>
			Beginners' <span class={vision}> Wish</span> has no time limit and is aimed at Travelers who
			have recently landed in Teyvat. Non-promotional characters and weapons are available. <br />
			In Beginners' Wish, 10-wish sets cost <span> 20%</span> less Acquaint Fate, and your first
			10-wish set is guaranteedto include
			<span class={vision}>
				"{title}" {getName(name)} ({vision})
			</span>, and your second 10-wish set is guaranteed to include one <span> other </span> min.
			4-star character! Beginners' Wish expires after <span> 20 </span> attempts. After the wish expires,
			the page will disappear.
		</p>

		<p>〓Rules〓</p>
		<p>
			Base probability of winning 5-star character = <span> 0.600%</span> <br />
			Base probability of winning 4-star character = <span> 5.100%</span>; consolidated probability
			(incl. guarantee) =
			<span> 13.000%</span>; guaranteed to win 4-star or above character at least once per
			<span> 10</span>
			attempts 3-star weapons won in this wish come with
			<span class="stardust"> Masterless Stardust</span> x15
		</p>

		<p>〓Duplicate Characters〓</p>
		<p>
			On obtaining a 5-star character that you already own (whether obtained in a wish, redeemed at
			the shop, or awarded by the game): The 2nd - 7th time you obtain the character, it will be
			converted into that character's <span class="stardust"> Stella Fortuna</span> x1 and
			<span class="starglitter"> Masterless Starglitter</span>
			x10; from the 8th time onwards it will be converted into
			<span class="starglitter"> Masterless Starglitter</span> x25 On obtaining a 4-star character
			that you already own (whether obtained in a wish, redeemed at the shop, or awarded by the
			game): The 2nd - 7th time you obtain the character, it will be converted into that character's
			<span class="stardust"> Stella Fortuna</span>
			x1 and <span class="starglitter"> Masterless Starglitter</span> x2; from the 8th time onwards
			it will be converted into <span class="starglitter"> Masterless Starglitter</span> x5
		</p>
	{/each}
{:else if bannerType === 'standard'}
	<p>
		Wanderlust <span class="electro"> Invocation</span> is a standard wish with no time limit.
		Non-promotional characters and weapons are available. In this wish, <span> guaranteed</span> to win
		4-star or above item at least once per 10 attempts.
	</p>
	<p>〓Rules〓</p>
	<p>
		Base probability of winning 5-star item = <span> 0.600%</span>; base probability of winning
		5-star character =
		<span> 0.300%</span>, and base probability of winning 5-star weapon = <span> 0.300%</span>;
		consolidated probability (incl. guarantee) of winning 5-star item = <span>1.600%</span>;
		guaranteed to win 5-star item at least once per <span> 90</span> attempts. Base probability of
		winning 4-star item = <span> 5.100%</span>; base probability of winning 4-star character =
		<span> 2.550%</span>, and base probability of winning 4-star weapon = <span> 2.550%</span>;
		consolidated probability (incl. guarantee) of winning 4-star item = <span> 13.000%</span>;
		guaranteed to win 4-star or above item at least once per <span> 10</span> attempts; probability
		of winning 4-star item through the guarantee = <span> 99.400%</span>, and probability of winning
		5-star item through the guarantee = <span> 0.600%</span>. 5-star weapons won in this wish
		include <span class="starglitter"> Masterless Starglitter</span> x10; 4-star weapons include
		<span class="starglitter"> Masterless Starglitter</span>
		x2; 3-star weapons include
		<span class="stardust"> Masterless Stardust</span> x15.
	</p>

	<p>〓Duplicate Characters〓</p>
	<p>
		On obtaining a 5-star character that you already own (whether obtained in a wish, redeemed at
		the shop, or awarded by the game): The 2nd - 7th time you obtain the character, it will be
		converted into that character's <span class="stardust"> Stella Fortuna</span> x1 and
		<span class="starglitter"> Masterless Starglitter</span>
		x10; from the 8th time onwards it will be converted into
		<span class="starglitter"> Masterless Starglitter</span>
		x25. On obtaining a 4-star character that you already own (whether obtained in a wish, redeemed at
		the shop, or awarded by the game): The 2nd - 7th time you obtain the character, it will be converted
		into that character's <span class="stardust"> Stella Fortuna </span> x1 and
		<span class="starglitter">Masterless Starglitter</span>
		x2; from the 8th time onwards it will be converted into
		<span class="starglitter"> Masterless Starglitter</span> x5.
	</p>
{:else if bannerType === 'events'}
	<p>
		Event Wish - <span class={item5Star[0].vision}>
			{bannerName.split(' ')[0]}
		</span>
		{bannerName.split(' ').slice(1).join(' ')} is now available. During this event wish, drifting 5-star
		character
		<span class={item5Star[0].vision}>
			"{item5Star[0].title}" {item5Star[0].name} ({item5Star[0].vision})
		</span>
		as well as 4-star characters
		{#each item4Star as { name, vision, title }, i}
			<span class={vision}> "{title}" {getName(name)} (vision)</span>
			{#if i === 1} and {:else},&nbsp; {/if}
		{/each}
		will get a <span> huge drop-rate boost! </span> <br />
		<span>
			※In most cases, drifting base probability of all characters and weapons is evenly distributed.
			If there is a boost or guarantee in effect, please refer to the corresponding rules.
		</span><br />
		※In most cases, drifting base probability of all characters and weapons is evenly distributed. If
		driftingre is a boost or guarantee in effect, please refer to drifting corresponding rules.
	</p>

	<br />
	<p>〓Rules〓</p>
	<p>5-Star Items</p>

	<p>
		For Event Wish - <span class={item5Star[0].vision}>
			{bannerName.split(' ')[0]}
		</span>
		{bannerName.split(' ').slice(1).join(' ')} : Base probability of winning 5-star character =
		<span> 0.600% </span>; consolidated probability (incl. guarantee) =
		<span>1.600%</span>; guaranteed to win 5-star character at least once per <span> 90</span>
		attempts. The first time you win a 5-star item in this event wish, driftingre is a
		<span> 50%</span>
		chance it will be drifting promotional character
		<span class={item5Star[0].vision}>
			"{item5Star[0].title}" {item5Star[0].name} ({item5Star[0].vision})
		</span>. If drifting first 5-star character you win in this event wish is not drifting
		promotional character, then the next 5-star character you win is <span> guaranteed</span> to be drifting
		promotional character.
	</p>

	<p>4-Star Items</p>
	<p>
		For Event Wish - <span class={item5Star[0].vision}>
			{bannerName.split(' ')[0]}
		</span>
		{bannerName.split(' ').slice(1).join(' ')} : Base probability of winning 4-star item =
		<span> 5.100%</span>; consolidated probability (incl. guarantee) = <span> 13.000%</span>;
		guaranteed to win 4-star or above item at least once per 10 attempts. The first time you win a
		4-star item in this event wish, driftingre is a <span> 50%</span> chance it will be one of
		drifting featured characters
		{#each item4Star as { name, vision, title }, i}
			<span class={vision}> "{title}" {getName(name)} (vision)</span>
			{#if i === 1} and {:else}, {/if}
		{/each}. If drifting first 4-star item you win in this event wish is not one of the featured
		characters, driftingn the next 4-star item you win is <span> guaranteed </span> to be a featured
		character.
	</p>

	<p>
		4-star weapons won in this wish come with <span class="starglitter">
			Masterless Starglitter
		</span>
		x2; 3-star weapons won in this wish come with
		<span class="stardust"> Masterless Stardust</span> x15.
	</p>

	<br />
	<p>〓Duplicate Characters〓</p>
	<p>
		On obtaining a 5-star character that you already own (whedriftingr obtained in a wish, redeemed
		at drifting shop, or awarded by the game): The 2nd - 7th time you obtain drifting character, it
		will be converted into that character's <span class="stardust"> Stella Fortuna</span>
		x1 and <span class="starglitter"> Masterless Starglitter</span> x10; from drifting 8th time
		onwards it will be converted into <span class="starglitter"> Masterless Starglitter </span> x25.
	</p>
	<p>
		On obtaining a 4-star character that you already own (whedrifting obtained in a wish, redeemed
		at drifting shop, or awarded by the game): The 2nd - 7th time you obtain drifting character, it
		will be converted into that character's <span class="stardust"> Stella Fortuna</span> x1 and
		<span class="starglitter"> Masterless Starglitter </span>
		x2; from drifting 8th time onwards it will be converted into
		<span class="starglitter"> Masterless Starglitter </span> x5.
	</p>
	<p>
		※ This is a character event wish. The wish guarantee count is accumulated within character event
		wishes only and is independent of drifting guarantee counts of other types of wishes.
	</p>
{:else if bannerType === 'weapons'}
	<p>
		Event Wish "<span>{bannerName.split(' ')[0]}</span>
		{bannerName.split(' ').slice(1).join(' ')}" is now available. During this event wish,the
		event-exclusive 5-star weapon
		<span class="geo"> {item5Star[0].name} ({item5Star[0].type})</span>
		and the 5-star weapon <span class="pyro"> {item5Star[1].name} ({item5Star[1].type})</span> as
		well as the 4-star weapons
		<span class="stardust">
			{#each item4Star as { name, type }}
				{getName(name)} ({type}),
			{/each}
		</span>
		will get a <span> huge drop-rate boost!</span> <br />
		<span>
			※ Of the above weapons, the event-exclusive weapon will not be available in the standard wish
			"Wanderlust Invocation".
		</span>
	</p>
	<br />

	<p>〓Rules〓</p>
	<p>5-Star Items</p>
	<p>
		For Event Wish "<span> Epitome</span> Invocation": Base probability of winning 5-star weapon =
		<span> 0.700%</span>; consolidated probability (incl. guarantee) = <span> 1.850%</span> ;
		guaranteed to win 5-star weapon at least once per <span> 80</span> attempts. The first time you
		win a 5-star weapon in this event, there is a <span> 75%</span> chance it will be one of the
		promotional weapons <span class="geo"> {item5Star[0].name} ({item5Star[0].type})</span> and
		<span class="geo"> {item5Star[1].name} ({item5Star[1].type})</span>. If the first 5-star weapon
		you win in this event wish is not one of the promotional weapons, then the next 5-star weapon
		you win is <span> guaranteed</span> to be a promotional weapon.
	</p>

	<p>4-Star Items</p>

	<p>
		For Event Wish "<span> Epitome</span> Invocation": Base probability of winning 4-star item =
		<span> 6.000%</span>; base probability of winning 4-star character = <span>3.000%</span> , and
		base probability of winning 4-star weapon = <span> 3.000%</span>; consolidated probability
		(incl. guarantee) of winning 4-star item = <span> 14.500%</span>; guaranteed to win 4-star or
		above item at least once per 10 attempts; probability of winning 4-star item through the
		guarantee = 99.300%, and probability of winning 5-star item through the guarantee =
		<span> 0.700% </span>
		The first time you win a 4-star item in this event wish, there is a <span> 75%</span>
		chance that it will be one of the featured weapons
		<span class="stardust">
			{#each item4Star as { name, type }}
				{getName(name)} ({type}),
			{/each}
		</span>. If the first 4-star item you win in this event wish is not one of the featured weapons,
		then the next 4-star item you win is <span> guaranteed</span> to be a featured weapon.
	</p>
	<p>
		5-star weapons won in this wish come with <span class="starglitter">
			Masterless Starglitter
		</span>
		x10; 4-star weapons won in this wish come with
		<span class="starglitter"> Masterless Starglitter</span>
		x2; 3-star weapons won in this wish come with
		<span class="stardust"> Masterless Stardust </span> x15.
	</p>

	<br />
	<p>〓Duplicate Characters〓</p>
	<p>
		On obtaining a 4-star character that you already own (whether obtained in a wish, redeemed at
		the shop, or awarded by the game): The 2nd - 7th time you obtain the character, it will be
		converted into that character's <span class="stardust"> Stella Fortuna </span> x1 and
		<span class="starglitter"> Masterless Starglitter </span>
		x2; from the 8th time onwards it will be converted into
		<span class="starglitter"> Masterless Starglitter</span> x5.
	</p>

	<p>
		※ This is a weapon event wish. The wish guarantee count is accumulated within this event only
		and is independent of the guarantee counts of other wishes.
	</p>
{/if}

<Ads type="banner" />

<style>
	span {
		color: #cf5e47;
		text-transform: capitalize;
	}

	span.invocation {
		color: #cba885;
	}

	span.starglitter {
		color: #c37b4d;
	}
	span.stardust {
		color: #a256e1;
	}

	span.hydro {
		color: #06bbff;
	}
	span.geo {
		color: #f9aa02;
	}
	span.pyro {
		color: #fe6606;
	}
	span.anemo {
		color: #369396;
	}
	span.electro {
		color: #ca82fc;
	}
	span.cryo {
		color: #4682b4;
	}

	p {
		font-size: 1.2rem;
		margin: 1rem 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
	h3 {
		padding: 0.2rem 0.7rem;
		font-weight: 400;
		color: #fff;
		background-color: #a28052;
		vertical-align: middle;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>
