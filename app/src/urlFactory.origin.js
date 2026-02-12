import qs from 'qs';

export function getProtooUrl(params) {
	let protooPort = 4443;

	if (window.location.hostname === 'test.mediasoup.org') {
		protooPort = 4444;
	}

	const hostname = window.location.hostname;
	const protocol = 'wss';

	const query = qs.stringify(params);

	return `${protocol}://${hostname}:${protooPort}/?${query}`;
}
