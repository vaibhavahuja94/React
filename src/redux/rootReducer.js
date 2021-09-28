import { combineReducers } from 'redux'
import SetTemplateReducers from './reducer/SetTemplateReducers'
import LoginReducer from './reducer/LoginReducers'

export default combineReducers({
  login:LoginReducer,
  template:SetTemplateReducers,
})