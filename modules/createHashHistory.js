import createHistory from 'history/createHashHistory';
import enhancer from './enhancer';

export default function(routes, options) {
  const history = createHistory(options);
  return enhancer(history)(routes);
}
