# Guide to Add new Locale

1. To add a language, just duplicate `en-US.json`, rename to your locale then edit it, change everythings that need to change.
2. Some languages keep character and weapon names in English, if the language you want to add has its own name for the characters/weapons you can localize it by duplicating the `en-US.json` file from the `items` folders too.
3. Then open `/src/lib/data/country.json`, insert the Locale Name and Flag here. You can take the base46 flag from this gist [https://gist.github.com/CodeTheInternet/9312404](https://gist.githubusercontent.com/CodeTheInternet/9312404/raw/4987ca07c4032bb6262a65794f428b350e1d86a1/gistfile1.json)
4. Last Step, navigate to `/src/lib/helpers/i18n.js`. Insert the new locale into `supportedLocales` array, if you have localized characters/weapons too, insert the new locale name to `itemLocales` array as well.
   https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator/blob/c0dfd3335bf717863845e6763d5db715ae5c5fc7/src/lib/helpers/i18n.js#L4-L5

If you are not familiar with javascript especially sveltekit or don't know how to use github and can't do development, don't worry, you can still contribute just by creating a new json file based on `en-US.json` and attach it in [new issue](https://github.com/AguzzTN54/Genshin-Impact-Wish-Simulator/issues/new), next I will combine it with the main program. I really appreciate your works.

---

## It might take a long time to type all the text manually, so here are some links from the official site that you can open and copy the text

> Replace `LANGUAGE` with language that you want to add, such as **en**, **es**, **fr**, **vi**, **ja**, **th** or others language that available in Genhsin Impact game.

1. [Beginners' Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?lang=en&region=os_asia#/newbiegacha)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?lang=LANGUAGE&region=os_asia#/newbiegacha
   ```
2. [Standard Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=fecafa7b6560db5f3182222395d88aaa6aaac1bc&lang=en&region=os_asia#/)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=fecafa7b6560db5f3182222395d88aaa6aaac1bc&lang=LANGUAGE&region=os_asia#/
   ```
3. [Character Event Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=d7d9d26fd678245ee04bec46b4bab7a8f5359c90&lang=en&region=os_asia#/) (Yoimiya Banner)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=d7d9d26fd678245ee04bec46b4bab7a8f5359c90&lang=LANGUAGE&region=os_asia#/
   ```
4. [Weapon Wish](https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=38aa9125d7f6a5c4cdaceff8ac720b22ad9236b3&lang=en&region=os_asia#/)
   ```
   https://webstatic-sea.hoyoverse.com/genshin/event/e20190909gacha/index.html?gacha_id=38aa9125d7f6a5c4cdaceff8ac720b22ad9236b3&lang=LANGUAGE&region=os_asia#/
   ```

## Thanks to all contributors who have carried out localization

<table>
   <thead>
      <tr>
         <th> Language </th>
         <th> Contributor </th>
      </tr>
   <thead>
   <tbody>
      <tr>
         <td> Chinese (Simplified) </td>
         <td>
            <a href="https://github.com/SleepyAsh0191">
               <img width="20px" src="https://avatars.githubusercontent.com/u/64446140?s=20" />
               SleepyAsh0191
            </a>
         </td>
      </tr>
      <tr>
         <td> Italiano </td>
         <td>
            <a href="https://github.com/OCTIPI1">
               <img width="20px" src="https://avatars.githubusercontent.com/u/64631735?s=20" />
               OCTIPI1
            </a>
         </td>
      </tr>
   </tbody>
</table>
