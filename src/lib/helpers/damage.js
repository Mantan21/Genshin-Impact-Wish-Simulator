import characters from '$lib/data/characters.json';
import { HistoryManager } from '$lib/helpers/dataAPI/api-indexeddb';


export default function DieBar (){

    let charDPS = [...characters.data].filter(char => char.rarity == 5 && char.class == "dps");
    let charSPT = [...characters.data].filter(char => char.rarity == 5 && char.class == "spt");

    let inv = [];
    let cons = [];
    
    HistoryManager.getAllHistories().then((data) => {
        inv = data;
        for (let cop of inv) {
            let key = cop.name;
            cons[key] = (cons[key] || 0) + 1;
        }
    })

    
    

    console.log(cons);
    console.log(charDPS);

    let boom;













    return boom;
}