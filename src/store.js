import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { throttle } from 'lodash';
import rootReducer from './redux/rootReducer'
import { loadState, saveState } from './services/localStorage';


 
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState = {}, history) {
    const persistedState = loadState();
    const store = createStore(
        rootReducer,
        persistedState,
        composeEnhancer(applyMiddleware(thunk))
    )
    
    store.subscribe(
        throttle(() => {
            saveState(store.getState());
        }, 1000)
    );

    return store;
}