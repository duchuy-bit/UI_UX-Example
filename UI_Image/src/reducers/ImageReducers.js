import * as types from '../configs/types';
import appState from './AppState';

const imagesReducer = (state = appState.app, action) => {
    switch (action.type) {
        case types.SET_ADD_IMAGES:
            return {
                ...state,
                listImages: state.listImages.push(action.dataAdd)
            };
    
        
        //=================DEFAULT =======================
        default:
            return state;
    }
};
export default imagesReducer;
