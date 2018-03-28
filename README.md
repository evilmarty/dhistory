# dhistory ![](https://api.travis-ci.org/evilmarty/dhistory.svg?branch=master) ![](https://img.shields.io/npm/v/dhistory.svg)

Dispatches actions on history state changes (ie. push state or navigate).

## Getting started

Install dhistory using `npm`:

```shell
npm install -s dhistory

```

Or via `jest`:

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
const store = createStore(reducers, applyMiddleware(createBrowserHistory(routes)));
```

Inside your reducer:

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'VIEW_POST':
      return { ...state, post_id: action.id, view: 'POST' };
    case 'VIEW_POSTS':
      return { ...state, view: 'POSTS' };
    case 'VIEW_HOME':
      return { ...state, view: 'HOME' };
    ...
  }
}
```

To navigate simply dispatch the action, along with any parameters, as you normally would in your Redux app:

```javascript
dispatch({ type: 'VIEW_POST', id: 1 });
```

Which will update the location to `/posts/1` and dispatch the action. If the path changes outside your application then dhistory will dispatch the same action.

## Motivation

There are many routers and history management libraries but none of them seem to truly fitted with Redux. Navigations don't match with actions or follow the same flow and are treated separate from everything else.

Example with React Router:

```javascript
import { Router, Route } from 'react-router';

<Router>
  <Route to="/post/new" component={NewPostView}/>
</Router>

function createPost(data) {
  // some logic to create post
  history.push(`/posts/${post.id}`);
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

Example with dhistory:

```javascript
import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'dhistory';

function createPost(data) {
  // some logic to create post
  return { type: 'VIEW_POST', id: post.id };
}

const routes = {
  '/posts/:id': 'VIEW_POST',
}

const store = createStore(reducers, applyMiddleware(createBrowserHistory(routes)));

function reducer(state, action) {
  switch (action.type) {
    // This is called when the action is dispatched or when the URL is changed
    case 'VIEW_POST':
      return { ...state, view: 'POST' };
  }
}

function NewPostView({ store }) {
  return (
    <PostForm onSubmit={data => store.dispatch(createPost(data))}>
      ...
    </PostForm>
  );
}

function Main({ view }) {
  switch (view) {
    case 'POST':
      return <NewPostView/>;
    ...
  }
}
```

## API

### `createBrowserHistory(routes, options)` and `createMemoryHistory(routes, options)` and `createHashHistory(routes, options)`

Returns a router object.

#### Parameters
- routes - A routes object. Keys are patterns and values are either the action name or an action object.
- options - Options for browser history. Read ReactTraining's [history](https://github.com/ReactTraining/history#usage) package for more info.

Returns a function to be added to your store's middleware.

```javascript
const routes = {
  '/posts/:id': { type: 'VIEW_POST', extra: 'data' },
  '/posts': 'VIEW_POSTS',
}
```

## Attribution

Much of this work wouldn't be made possible without the efforts put to [react-router](https://github.com/ReactTraining/react-router).
