import { compose } from 'redux';
import enhancer from './enhancer';

export default history => routes => func => createStore => (...args) => {
  const store = func(createStore)(...args);
  return enhancer(history)(routes)(() => store)(...args);
}
