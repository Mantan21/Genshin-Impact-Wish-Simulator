<script>
	import { showBeginner, bannerActive, backsound, showDisclaimer } from '$lib/store/stores';
	import PopUp from './PopUp.svelte';

	const confirm = () => {
		showDisclaimer.set(false);
		backsound.set(true);
		if ($showBeginner) bannerActive.set('beginner');
		else bannerActive.set('limited');
	};
</script>

<PopUp
	show={$showDisclaimer}
	title="Genshin Impact Wish Simulator"
	button="confirm"
	on:confirm={confirm}
>
	<section>
		<p class="sp">This is purely a fan made Application, enjoy it !</p>
		<div class="updates">
			<span>
				Latest Update <i class="tgl">( 01-Sep-2021 )</i> :
			</span>
			<p><strong> Raiden Shogun and Kujou Sara </strong> Banner was here !</p>
			<p><strong> Engulfing Lightning Weapon Banner </strong> has been added .</p>
			<p>Mobile App soon.</p>
		</div>
		<p class="sp">
			If you find any bugs or problems, please email me ( <a href="mailto:lockagz@gmail.com">
				lockagz@gmail.com
			</a> )
		</p>
		<p class="credit">All assets used in this site are owned by Mihoyo.</p>
	</section>
</PopUp>

<style>
	section {
		width: 100%;
		padding: 0 2rem;
	}
	.credit {
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		font-size: 0.9rem;
	}

	.updates {
		text-align: left;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		padding: 1rem 2rem;
		background-color: #fff;
		font-size: 0.97rem;
	}

	.updates > span {
		font-weight: bold;
		color: #f7cf33;
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
		padding: 1rem 0;
	}
</style>
