import createHistory from 'history/createMemoryHistory';
import middleware from './middleware';

export default function(routes, options) {
  const history = createHistory(options);
  return middleware(history)(routes);
}
