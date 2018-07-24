# dhistory [![](https://api.travis-ci.org/evilmarty/dhistory.svg?branch=master)](https://travis-ci.org/evilmarty/dhistory) ![](https://img.shields.io/npm/v/dhistory.svg)

Dispatches actions on history state changes (ie. push state or navigate).

## Getting started

Install dhistory using `npm`:

```shell
npm install -s dhistory

```

Or via `yarn`:

```shell
yarn add dhistory

```

Define routes and connect to your store:

```javascript
import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'dhistory';

const routes = {
  '/posts/:id': 'VIEW_POST',
  '/posts': 'VIEW_POSTS',
  '/': 'VIEW_HOME',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'VIEW_POST':
      return { ...state, post_id: action.id, view: 'POST' };
    case 'VIEW_POSTS':
      return { ...state, view: 'POSTS' };
    case 'VIEW_HOME':
      return { ...state, view: 'HOME' };
    ...
  }
};

const store = createStore(reducers, applyMiddleware(createBrowserHistory(routes)));
```

Your store will now receive actions defined in `routes` when the browser's history changes. For example, when the URL changes to `/posts/123` the action `VIEW_POST` will be dispatched with the param `id: 123`.

To navigate simply dispatch the action, along with any parameters, as you normally would in your Redux app:

```javascript
dispatch({ type: 'VIEW_POST', id: 1 });
```

Which will update the location to `/posts/1` and dispatch the action.

## Motivation

There are many routers and history management libraries but none of them seem to truly fitted with Redux. Navigations don't match with actions or follow the same flow and are treated separate from everything else.

Example:

```javascript
import { Router, Route } from 'react-router';

<Router>
  <Route to="/post/new" component={NewPostView}/>
  <Route to="/post/:id" component={PostView}/>
</Router>

function createPost(data) {
  // dhistory will update the history for us, otherwise we'd have to manually update it:
  // ie. history.push(`/posts/${post.id}`);
  return { type: 'POST_CREATED', post };
}

function NewPostView({ store }) {
  return (
    <PostForm onSubmit={data => store.dispatch(createPost(data))}>
      ...
    </PostForm>
  );
}
```

## API

### `createBrowserHistory(routes, options)` and `createMemoryHistory(routes, options)` and `createHashHistory(routes, options)`

Returns a router object.

#### Parameters
- routes - A routes object. Keys are patterns and values are either the action name or an action object.
- options - Options for browser history. Read ReactTraining's [history](https://github.com/ReactTraining/history#usage) package for more info.

Returns a function to be passed to `applyMiddleware`.

## Attribution

Much of this work wouldn't be made possible without the efforts put to [react-router](https://github.com/ReactTraining/react-router).
