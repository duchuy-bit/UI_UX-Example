import {combineReducers} from 'redux';
import imagesReducer from './ImageReducers';

const reducers = combineReducers({
    app: imagesReducer,
})

export default reducers;