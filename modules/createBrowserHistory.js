import createHistory from 'history/createBrowserHistory';
import enhancer from './enhancer';

export default function(routes, options) {
  const history = createHistory(options);
  return enhancer(history)(routes);
}
