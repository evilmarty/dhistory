import expect from 'expect';
import createHistory from 'history/createMemoryHistory';
import { createStore, applyMiddleware } from 'redux';
import middleware from '../middleware';

describe('enhancer', () => {
  describe('passing routes', () => {
    let history;

    beforeEach(() => {
      history = createHistory();
    });

    it('accepts routes with strings for action types', () => {
      const routes = {
        '/foo': 'FOO',
        '/foo/:bar': 'FOOBAR',
      };
      expect(middleware(history)(routes)).toBeInstanceOf(Function);
    });

    it('accepts routes with objects as objects', () => {
      const routes = {
        '/foo': { type: 'FOO' },
        '/foo/:bar': { type: 'FOOBAR' },
      };
      expect(middleware(history)(routes)).toBeInstanceOf(Function);
    });

    it('throws a type error when routes contains an object without a "type" property', () => {
      const routes = {
        '/foo': { foo: 'bar' },
      };
      expect(() => {
        middleware(history)(routes);
      }).toThrowError(TypeError);
    });

    it('throws an error when routes is not an object', () => {
      const routes = 'ooops';
      expect(() => {
        middleware(history)(routes);
      }).toThrow();
    });
  });

  describe('store middleware', () => {
    const reducer = (state = [], action) => [action, ...state];
    const routes = {
      '/posts/:id': 'VIEW_POST',
      '/posts': 'VIEW_POSTS',
      '/': 'VIEW_HOME',
    };
    let store, history;

    beforeEach(() => {
      history = createHistory();
      store = createStore(reducer, applyMiddleware(middleware(history)(routes)));
    });

    it('dispatches action when history state changes', () => {
      history.push('/posts');
      const [ lastAction ] = store.getState();
      expect(lastAction).toEqual({ type: 'VIEW_POSTS' });
    });

    it('dispatches action with parameters when history state changes', () => {
      history.push('/posts/1');
      const [ lastAction ] = store.getState();
      expect(lastAction).toEqual({ type: 'VIEW_POST', id: '1' });
    });

    it('updates the history location when an action is dispatched associated to a route', () => {
      store.dispatch({ type: 'VIEW_POST', id: 3 });
      expect(history.location.pathname).toEqual('/posts/3');
    });

    it('does not dispatch more than one action when history is updated', () => {
      const action = { type: 'VIEW_POST', id: 3 };
      const previousState = store.getState();
      const expectedState = [action, ...previousState];
      store.dispatch(action);
      const currentState = store.getState();
      expect(currentState).toEqual(expectedState);
    });

    it('skips updating history when route is not found', () => {
      const lastPathname = history.location.pathname;
      store.dispatch({ type: 'SOMETHING' });
      expect(history.location.pathname).toEqual(lastPathname);
    });

    it('does not dispatch action for unknown history location', () => {
      const previousState = store.getState();
      history.push('/unknown');
      const currentState = store.getState();
      expect(currentState).toEqual(previousState);
    });
  });
});
