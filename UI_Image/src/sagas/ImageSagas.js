import { put, call, takeLatest } from 'redux-saga/effects';
import { setAddImage, setDeleteImage } from '../actions/ImageActions';
import * as types from "../configs/types"
import { callAPI, callError, callNomal } from './CallEffects';

export function* _addImage(action) {
    try {
        //--------------------------------------

        console.log(" action?.params _addImage ",action?.params)
        yield put(setAddImage(action?.params))

        if (action.onSuccess)
            yield action.onSuccess(true);
    } catch (error) {
        // yield callError(error, action);
        console.log(" error AddImage: ",error)
    }
}

export function* _deleteImage(action) {
    try {
        //--------------------------------------

        console.log(" action?.params _deleteImage ",action?.params)
        yield put(setDeleteImage(action?.params))

        if (action.onSuccess)
            yield action.onSuccess(true);
    } catch (error) {
        // yield callError(error, action);
        console.log(" error _deleteImage: ",error)
    }
}


export function* watchImageSagas() {
    yield takeLatest(types.POST_ADD_IMAGES, _addImage);
    yield takeLatest(types.POST_DELETE_IMAGES, _deleteImage);
}