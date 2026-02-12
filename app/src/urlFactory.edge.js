import qs from 'qs';

export function getProtooUrl(params) {
	let protooPort = 5216; // yun: HA Proxy's Port

	if (window.location.hostname === 'test.mediasoup.org') {
		protooPort = 4444;
	}

	//const hostname = window.location.hostname;
	const hostname = '10.20.13.190'; // yun: HA Proxy's IP addr
	const protocol = 'wss';
	const query = qs.stringify(params);

	return `${protocol}://${hostname}:${protooPort}/?${query}`;
}
