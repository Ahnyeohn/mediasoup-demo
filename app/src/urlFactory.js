import urlFactoryOrigin from './urlFactory.origin';
import urlFactoryEdge from './urlFactory.edge';

const mode = window.__CFG__?.mode ?? 'origin';

export default (mode === 'edge') ? urlFactoryEdge : urlFactoryOrigin;
