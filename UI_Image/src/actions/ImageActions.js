import * as types from "../configs/types"

export const setAddImage = data => ({
    type: types.SET_ADD_IMAGES,
    dataAdd: data,
});


export const setDeleteImage = data => ({
    type: types.SET_DELETE_IMAGES,
    indexDelete: data,
});