/* eslint-disable no-undef */

/**
 * Copy and paste to Console Dev Tools.
 */

const script1 = document.createElement('script');
script1.src = 'https://unpkg.com/dexie';
document.body.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://unpkg.com/dexie-export-import';
document.body.appendChild(script2);

const theDBName = 'WishSimulator';

const createIDBExportLink = async () => {
	let theDB = new Dexie(theDBName);
	let { verno, tables } = await theDB.open();
	theDB.close();
	theDB = new Dexie(theDBName);
	theDB.version(verno).stores(
		tables.reduce((p, c) => {
			p[c.name] = c.schema.primKey.keyPath || '';
			return p;
		}, {})
	);
	const theBlob = await theDB.export();
	document.body.innerHTML = `
    <a href='${URL.createObjectURL(theBlob)}'> CLick here, copy all and paste to file.json</a>
  `;
};

createIDBExportLink();
