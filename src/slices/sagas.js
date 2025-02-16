import { all, fork } from "redux-saga/effects";
//layout

//calendar
import calendarSaga from "./calendar/saga";

export default function* rootSaga() {
  yield all([
    //public
    
    fork(calendarSaga),
  ]);
}
