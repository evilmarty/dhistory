import createHistory from 'history/createMemoryHistory';
import compose from './compose';

export default function(routes, options) {
  const history = createHistory(options);
  return compose(history)(routes);
}

