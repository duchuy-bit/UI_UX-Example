import * as types from '../configs/types';
import appState from './AppState';

const imagesReducer = (state = appState.app, action) => {
    switch (action.type) {
        case types.SET_ADD_IMAGES:
            console.log("dataAdd:  - ", action.dataAdd)
            // console.log(" state.listImages: ",[state.listImages].concat([action.dataAdd]))
            return {
                ...state,
                listImages: state.listImages.concat([action.dataAdd])
                // listImages: state.listImages.push(action.dataAdd)
                // listImages: [action.dataAdd]
            };
    
        case types.SET_DELETE_IMAGES:
            console.log("index Delete:  - ", action.indexDelete)
            // let tam = state.listImages.filter(function(item){
            //     if(item.indexImage != action.indexDelete.indexDelete ){
            //         console.log(" index ", item.indexImage," ",action.indexDelete.indexDelete)
            //     }
                
            //     return item.indexImage != action.indexDelete.indexDelete;
            // })
            // console.log(" state.listImages: ",tam)
            return {
                ...state,
                listImages: state.listImages.filter(item => item.indexImage !== action.indexDelete.indexDelete)
                // listImages: state.listImages.push(action.dataAdd)
                // listImages: [action.dataAdd]
            };
        //=================DEFAULT =======================
        default:
            return state;
    }
};
export default imagesReducer;
