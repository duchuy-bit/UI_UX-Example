import * as types from '../configs/types';
import appState from './AppState';

const imagesReducer = (state = appState.app, action) => {
    switch (action.type) {
        case types.SET_ADD_IMAGES:
            console.log("dataAdd:  - ", action.dataAdd)
            //  Thêm Ảnh  - hàm concat: nối 2 mảng với nhau.
            return {
                ...state,
                listImages: state.listImages.concat([action.dataAdd])
            };
    
        case types.SET_DELETE_IMAGES:
            console.log("index Delete:  - ", action.indexDelete)
            //  Thêm Ảnh  - hàm filter: lọc mảng: 
                // - khi so sánh bằng true thì sẽ loại bỏ item đó
                // - khi so sánh bằng false thì sẽ giữ lại item đó
            return {
                ...state,
                listImages: state.listImages.filter(item => item.indexImage !== action.indexDelete.indexDelete)
            };
        //=================DEFAULT =======================
        default:
            return state;
    }
};
export default imagesReducer;
