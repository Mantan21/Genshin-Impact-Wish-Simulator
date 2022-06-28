# Realistic Genshin Impact Wish Simulator

![License](https://badgen.net/github/license/AguzzTN54/Genshin-Impact-Wish-Simulator?icon:github) ![Repo Size](https://img.shields.io/github/repo-size/AguzzTN54/Genshin-Impact-Wish-Simulator?color=fa0) [![CodeFactor](https://www.codefactor.io/repository/github/aguzztn54/genshin-impact-wish-simulator/badge)](https://www.codefactor.io/repository/github/aguzztn54/genshin-impact-wish-simulator) ![Status](https://badgen.net/github/checks/AguzzTN54/Genshin-Impact-Wish-Simulator) ![Code Standard](https://badgen.net/badge/code%20style/standard/f2a) [![Saweria](https://badgen.net/badge/Saweria/Mantan21/F96854)](https://saweria.co/mantan21)

I'm not expert, I can't write clean code, but I try to create this Genshin Impact Wish Simulator. I can claim this is the most Realistic one for web version. However, I still need your feedbacks to improve the wishing experience. If you like this Simulator, please give a star to this repository

## Screenshots

#### Main Banner

![Main Banner](static/screenshot/meta-picture.jpg)

#### Layout on Mobile Version

![Weapon Banner](static/screenshot/mobile-weapon.jpg)

#### Epitomized Path

![Epitomized Path](static/screenshot/epitomized-path.jpg)

#### Inventory

![Weapon Banner](static/screenshot/inventory.jpg)

#### Switch banner

![Weapon Banner](static/screenshot/switch-banner.jpg)

> For more preview, please visit the live version at [https://wishsimulator.app](https://wishsimulator.app)

---

## Features

1. Gacha on all banner ( Beginner, Standard, Event and Weapon Banner )
2. Dual or Single Character Event Banner.
3. Epitomized Path System for Weapon Banner.
4. Pity System almost like the real game.
5. User can do gacha on all banner version start from version 1.0 - latest.
6. Gacha Milestone Bonus, Starglitter and Stardust, exchangable to Aquaint or Intertwined Fate at Shop
7. **Shop** section to refill Primogem and Genesis Crystal
8. Shared Pity with previous banner, User can continuously gacha on different banner version without reset pity.
9. **Wish Details** for every banner.
10. Different banner type has different **Gacha History**
11. **Inventory** to show all items ( characters and weapons ) that already owned by gacha
12. Screenshot and download wish result localy.
13. Pity Counter, User can track their current pity and pity history
14. Responsive layout and mobile friendly both landscape or portrait orientation.
15. All user data will saves to localstorage and indexedDB.
16. Link generator when user want to share their gacha result through internet.

## Pity System

I don't know how HoyoVerse's algorithm is, so I tried to create mine as realistic as possible with the following points based on in-game wish details. I also use [GI Gacha Dataset](https://github.com/OneBST/GI_gacha_dataset) as reference for wish probability.

> if you feel luckier when you roll in this simulator, I can tell you it's just a feeling, In the simulator you can do a thousand or more rolls without limit, In real games your wishes are limited by the game currencies, therefore more chance to get multiple \*5 item in this wish simulator

1. Probability for \*4 item

   - 4* Item guaranteed at 10 roll and promoted *4 item guaranteed at 20 roll.
   - Probability to get \*4 item is 5.1%, at pity 9 the rate increased to 56.1% and at pity 10 or more, the rate is 100% (guaranteed)

   | **Pity** |  1   |  2   |  3   |  4   |  5   |  6   |  7   |  8   |   9   |  10  |  11  |
   | -------: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :---: | :--: | :--: |
   | **Rate** | 5.1% | 5.1% | 5.1% | 5.1% | 5.1% | 5.1% | 5.1% | 5.1% | 56.1% | 100% | 100% |

2. Character Event and Standard Wish Probability

   - *5 Item guaranteed at 90 roll and promoted *5 item guaranteed at 180 roll.
   - Probability to get \*5 item is 0.6%, at pity 74 the rate starts to increase by 6% and guaranteed at 90.

   | **Pity** | 1-73 |  74  |  75   |  76   |  77   |  78   |  79   |  80   |  81   |  82   |  83   |  84   |  85   |  86   |  87   |  88   |  89   |  90  |
   | -------: | :--: | :--: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--: |
   | **Rate** | 0.6% | 6.6% | 12.6% | 18.6% | 24.6% | 30.6% | 36.6% | 42.6% | 48.6% | 54.6% | 60.6% | 66.6% | 72.6% | 78.6% | 84.6% | 90.6% | 96.6% | 100% |

3. Weapons Wish Probability

   - *5 Item guaranteed at 80 roll and promoted *5 item guaranteed at 160 roll.
   - Probability to get \*5 item is 0.7%, at pity 63 the rate starts to increase by 7%, after pity 73 the rate increased by 3.5% and guaranteed at pity 80.

   | **Pity** | 1-62 |  63  |  64   |  65   |  66   |  67   |  68   |  69   |  70   |  71   |  72   |  73   |  74   |  75   |  76   |  77   |  78   |  79   |  80  |
   | -------: | :--: | :--: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--: |
   | **Rate** | 0.7% | 7.7% | 14.7% | 21.7% | 28.7% | 35.7% | 42.7% | 49.7% | 56.7% | 63.7% | 70.7% | 77.7% | 81.2% | 84.7% | 88.2% | 91.7% | 95.2% | 98.7% | 100% |

4. When you are guaranteed for *5 and *4 item at the same time, your next pull priority is *5 star item and *4 item will appear next at pity 11. For example: On Character Event Banner, you doesn't get *5 star item until pity 89 and your *4 pity is 9, So your next pull will appear like screenshot below.

   ![double guaranteed](static/screenshot/double-guaranteed.png)

## Developing

This app build with Svelte Kit base on Javascript programming language.

Once you've cloned this project, install all dependencies with `npm install` (or `pnpm install` or `yarn`), and start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment. Then:

```bash
npm run build
```

## Deploying

Before Deploy to online server, please setup the environment variables by renaming file `.env.example` to `.env`, please change the variables if needed.
After that, if you want to serve some assets through cdn, you can set your Github informations that you use to save your assets. The site will use free cdn service for free, if you want to use another cdn service, please do setup yourself

---

`Note : This App is not affiliated with Hoyoverse, all data used for this application belongs to Hoyoverse`
