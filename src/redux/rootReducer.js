import { combineReducers } from 'redux'
import getBlogByIdReducer from './reducer/GetBlogByIdReducers'
import LoginReducer from './reducer/LoginReducers'

export default combineReducers({
  login:LoginReducer,
  getBlogById:getBlogByIdReducer,
})