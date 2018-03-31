import expect from 'expect';
import createHistory from 'history/createMemoryHistory';
import { createStore } from 'redux';
import enhancer from '../enhancer';

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
      expect(enhancer(history)(routes)).toBeInstanceOf(Function);
    });

    it('accepts routes with objects as objects', () => {
      const routes = {
        '/foo': { type: 'FOO' },
        '/foo/:bar': { type: 'FOOBAR' },
      };
      expect(enhancer(history)(routes)).toBeInstanceOf(Function);
    });

    it('throws a type error when routes contains an object without a "type" property', () => {
      const routes = {
        '/foo': { foo: 'bar' },
      };
      expect(() => {
        enhancer(history)(routes);
      }).toThrowError(TypeError);
    });

    it('throws an error when routes is not an object', () => {
      const routes = 'ooops';
      expect(() => {
        enhancer(history)(routes);
      }).toThrow();
    });
  });

  describe('store enhancer', () => {
    const reducer = (state = {}, action) => {
      lastAction = action;
      return state;
    };
    const routes = {
      '/posts/:id': 'VIEW_POST',
      '/posts': 'VIEW_POSTS',
      '/': 'VIEW_HOME',
    };
    let store, history, lastAction;

    beforeEach(() => {
      lastAction = null;
      history = createHistory();
      store = createStore(reducer, enhancer(history)(routes));
    });

    it('adds "location" helper property', () => {
      expect(store).toHaveProperty('location', history.location);
    });

    it('dispatches action when store is created', () => {
      expect(lastAction).toEqual({ type: 'VIEW_HOME' });
    });

    it('dispatches action when history state changes', () => {
      history.push('/posts');
      expect(lastAction).toEqual({ type: 'VIEW_POSTS' });
    });

    it('dispatches action with parameters when history state changes', () => {
      history.push('/posts/1');
      expect(lastAction).toEqual({ type: 'VIEW_POST', id: '1' });
    });

    it('updates the history location when an action is dispatched associated to a route', () => {
      store.dispatch({ type: 'VIEW_POST', id: 3 });
      expect(history.location.pathname).toEqual('/posts/3');
    });

    it('skips updating history when route is not found', () => {
      const lastPathname = history.location.pathname;
      store.dispatch({ type: 'SOMETHING' });
      expect(history.location.pathname).toEqual(lastPathname);
    });

    it('does not dispatch action for unknown history location', () => {
      const previousAction = lastAction;
      history.push('/unknown');
      expect(lastAction).toEqual(previousAction);
    });
  });
});
