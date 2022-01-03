import { combineReducers } from 'redux'
import timer from './timer'
import tasks from './tasks'
import app from './app'

export default combineReducers({
  timer,
  tasks,
  app
})
