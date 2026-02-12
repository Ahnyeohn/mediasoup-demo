import qs from 'qs';

//let protooPort = 4443;
let protooPort = 5216; // yun: haproxy 띄운 port

if (window.location.hostname === 'test.mediasoup.org') {
	protooPort = 4444;
}

const hostname = window.location.hostname; // yun: haproxy가 떠 있는 ip 주소 넣어야 함
const protocol = 'wss';

export function getProtooUrl(params) {
	const query = qs.stringify(params);

	return `${protocol}://${hostname}:${protooPort}/?${query}`;
}
