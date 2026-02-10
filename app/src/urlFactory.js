import qs from 'qs';

//let protooPort = 4443;
let protooPort = 5216; // yun

if (window.location.hostname === 'test.mediasoup.org') {
	protooPort = 4444;
}

const hostname = window.location.hostname;
const protocol = 'wss';

export function getProtooUrl(params) {
	const query = qs.stringify(params);

	return `${protocol}://${hostname}:${protooPort}/?${query}`;
}
