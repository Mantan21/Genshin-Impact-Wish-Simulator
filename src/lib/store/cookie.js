export const setCookie = (cname, cvalue) => {
	const d = new Date();
	d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = `${cname}=${cvalue};${expires};SameSite=Lax; Secure;path=/`;
};

export const getCookie = (cname) => {
	const splitted = document.cookie.split('; ');
	const cuuid = splitted.find((row) => row.startsWith(`${cname}=`));
	return cuuid ? cuuid.split('=')[1] : '';
};

export const deleteCookie = (cname) => {
	const d = new Date();
	d.setTime(d.getTime() - 1 * 24 * 60 * 60 * 1000);
	let expires = 'expires=' + d.toUTCString();
	document.cookie = `${cname}=;${expires};SameSite=Lax; Secure;path=/`;
};

