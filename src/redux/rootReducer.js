import { combineReducers } from 'redux'
import getAllBlogReducer from './reducer/GetAllBlogReducer'
import getBlogByIdReducer from './reducer/GetBlogByIdReducers'
import newUserReducer from './reducer/GetUserReducer'
import LoginReducer from './reducer/LoginReducers'
import registerReducer from './reducer/RegisterReducers'

export default combineReducers({
  getData:newUserReducer,
  register:registerReducer,
  login:LoginReducer,
  getAllBlog:getAllBlogReducer,
  getBlogById:getBlogByIdReducer,
})