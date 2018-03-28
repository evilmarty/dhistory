import createHistory from 'history/createBrowserHistory';
import middleware from './middleware';

export default function(options) {
  const history = createHistory(options);
  return middleware(history);
}
