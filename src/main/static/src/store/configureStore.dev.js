import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducers'

const configureStore = preloadedState => {

  const isDev = process.env.NODE_ENV !== 'production';
  const isClient = typeof window !== 'undefined';
  const composeEnchancers = (isDev && isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnchancers(
      applyMiddleware(thunkMiddleware),
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    })
  }

  return store
};

export default configureStore
