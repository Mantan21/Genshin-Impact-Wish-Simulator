# Guide to Add new Locale

1. To add a language, just duplicate `en-US.json`, rename with Locale code and edit it, change everythings that need to change.
2. Some languages keep character and weapon names in English, if the language you want to add has its own name for the characters/weapons you can localize it by duplicating the `en-US.json` file in the `characters` and `weapons` folders too.
3. Then navigate to `/src/lib/helpers/i18n.js`. Insert the new locale code into `supportedLocales` array, if you also localize character/weapon, insert the new locale code to `itemLocales` array as well.
   https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator/blob/2e2f153de321ed99c747854911e6d269e769d3bb/src/lib/helpers/i18n.js#L4-L5

---

It might take a long time to type all the text manually, so here are some links from the official site that you can open and copy the text

> Replace `LANGUAGE_CODE` with language that you want to add, like **en**, **es**, **fr**, **vi**, **ja**, **th**, or others language that available in genhsin impact game.

1. [Beginners' Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?lang=en&region=os_asia#/newbiegacha)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?lang=LANGUAGE_CODE&region=os_asia#/newbiegacha
   ```
2. [Standard Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=fecafa7b6560db5f3182222395d88aaa6aaac1bc&lang=en&region=os_asia#/)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=fecafa7b6560db5f3182222395d88aaa6aaac1bc&lang=LANGUAGE_CODE&region=os_asia#/
   ```
3. [Character Event Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=d7d9d26fd678245ee04bec46b4bab7a8f5359c90&lang=en&region=os_asia#/) (Yoimiya Banner)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=d7d9d26fd678245ee04bec46b4bab7a8f5359c90&lang=LANGUAGE_CODE&region=os_asia#/
   ```
4. [Weapon Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=38aa9125d7f6a5c4cdaceff8ac720b22ad9236b3&lang=en&region=os_asia#/)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=38aa9125d7f6a5c4cdaceff8ac720b22ad9236b3&lang=LANGUAGE_CODE&region=os_asia#/
   ```
