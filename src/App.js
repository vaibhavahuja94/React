import React,{Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from './component/about/Login';
import Register from './component/about/Register';
import UserTemplate from './component/template/UserTemplate';
import Home from './component/home/Home';
import ProtectedRoute from './services/ProtectedRoute';
import PageDisplay from './component/pages/PageDisplay';
import ProfileUpdate from './component/profile/ProfileUpdate';
import AdminTemplate from './component/template/AdminTemplate';
import ForgotPassword from './component/about/ForgotPassword';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import DefaultPages from './component/pages/DefaultPages';

export default class App extends Component{  
    render(){
    return (
      <Router>
        <ToastContainer />
        <div>
            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/login">
              <Home />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
           
            <ProtectedRoute exact path="/savedPages" component={DefaultPages}/>
            <Route exact path="/forgotpass" component={ForgotPassword}/>
            <ProtectedRoute exact path="/savedWebTemplate" component={AdminTemplate}/>
            <ProtectedRoute exact path="/recentWebTemplate" component={UserTemplate}/>
            <ProtectedRoute exact path="/webTemplate" component={PageDisplay}/>
            <ProtectedRoute exact path="/updateProfile" component={ProfileUpdate}/>
          </Switch>
        </div>
      </Router>
    );
}
  }
  