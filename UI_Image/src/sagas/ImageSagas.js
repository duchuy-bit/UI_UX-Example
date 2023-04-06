import { put, call, takeLatest } from 'redux-saga/effects';
import { setAddImage } from '../actions/ImageActions';
import * as types from "../configs/types"


export function* _addImage(action) {
    try {
        //--------------------------------------
        yield put(setAddImage(action?.params))

        if (action.onSuccess)
            yield action.onSuccess(res);
    } catch (error) {
        yield callError(error, action);
    }
}

export function* watchImageSagas() {
    yield takeLatest(types.POST_ADD_IMAGES, _addImage);
}