import { initialize } from "reducers"
import { fork, takeEvery } from "redux-saga/effects"
import test from 'sagas/testSaga'

export default function* watchers() {
    yield fork(test)
}