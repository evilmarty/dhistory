import generatePath from './generatePath';
import matchPath from './matchPath';

const DEFAULT_MATCH_PATH_OPTIONS = { strict: false, exact: true, sensitive: false };
const NULL_PATTERN_MATCH = { path: null };

function normaliseAction(action) {
  switch (typeof(action)) {
    case 'string':
      return { type: action };
    case 'object':
      if (!('type' in action)) {
        throw new TypeError('Object must have a "type" property.');
      }
      return action;
    default:
      throw new TypeError('Invalid action. Must be a string or object.');
  }
}

function newAction(action, params = {}) {
  return Object.assign({}, action, params);
}

function findPattern(patterns, path, { strict, exact, sensitive }) {
  const matches = patterns.map(pattern => matchPath(path, { path: pattern, strict, exact, sensitive })).filter(i => i);
  return matches[0];
}

const actionFor = (patterns, lookup) => (path, options = DEFAULT_MATCH_PATH_OPTIONS) => {
  const match = findPattern(patterns, path, options) || NULL_PATTERN_MATCH;
  const action = lookup[match.path];

  return action ? newAction(action, match.params) : null;
};

const pathFor = lookup => action => {
  const pattern = lookup[action.type];
  const keys = Object.keys(action).filter(key => key !== 'type');
  const params = keys.reduce((memo, key) => Object.assign(memo, { [key]: action[key] }), {});

  return pattern ? generatePath(pattern, params) : null;
};

export default history => routes => {
  if (typeof(routes) !== 'object') {
    throw new TypeError('routes is not an Object');
  }

  const patterns = Object.keys(routes);
  const actionsByPatterns = patterns.reduce((memo, pattern) => Object.assign(memo, { [pattern]: normaliseAction(routes[pattern]) }), {});
  const patternsByActionTypes = patterns.reduce((memo, pattern) => Object.assign(memo, { [actionsByPatterns[pattern].type]: pattern }), {});

  return store => {
    let bypassUpdate = false;

    store.pathFor = pathFor(patternsByActionTypes);
    store.actionFor = actionFor(patterns, actionsByPatterns);

    history.listen(location => {
      const action = store.actionFor(location.pathname);

      if (action) {
        bypassUpdate = true;
        store.dispatch(action);
        bypassUpdate = false;
      }
    });

    return next => action => {
      if (!bypassUpdate) {
        const path = store.pathFor(action);

        if (path !== null) {
          history[action.replace ? 'replace' : 'push'](path);
        }
      }

      next(action);
    };
  };
};
