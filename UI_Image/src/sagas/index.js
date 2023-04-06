import { all, call, put } from 'redux-saga/effects';
import { watchImageSagas } from './ImageSagas';

function* rootSaga() {
    yield all([
        // All sagas here
        watchImageSagas()
    ]);
}

export default rootSaga;