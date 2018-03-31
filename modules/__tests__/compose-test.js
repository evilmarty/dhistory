import expect from 'expect';
import createHistory from 'history/createMemoryHistory';
import { createStore, applyMiddleware } from 'redux';
import compose from '../compose';

describe('compose', () => {
  describe('middleware', () => {
    const reducer = (state = {}, action) => state;
    const routes = {
      '/posts/:id': 'VIEW_POST',
      '/posts': 'VIEW_POSTS',
      '/': 'VIEW_HOME',
    };
    const called = store => next => action => {
      isCalled = true;
      return action;
    };
    let store, history, isCalled = false;

    beforeEach(() => {
      history = createHistory();
      store = createStore(reducer, compose(history)(routes)(applyMiddleware(called)));
    });

    it('calls the middleware on dispatch', () => {
      store.dispatch({ type: 'FOOBAR' });
      expect(isCalled).toBe(true);
    });
  });
});
