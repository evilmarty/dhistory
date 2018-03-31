import createHistory from 'history/createHashHistory';
import compose from './compose';

export default function(routes, options) {
  const history = createHistory(options);
  return compose(history)(routes);
}

