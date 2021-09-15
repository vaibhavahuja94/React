import React,{Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from "react-router-dom";
import Login from './component/about/Login';
import Register from './component/about/Register';
import BlogHome from './component/blogHome/BlogHome';
import Home from './component/home/Home';
import WebTemplate from './component/blogHome/WebTemplate';
import ProtectedRoute from './component/privateRoute/ProtectedRoute';
import WebHome from './component/blogHome/WebHome';
import RecentPage from './component/blogHome/RecentPage';
import ProfileUpdate from './component/profile/ProfileUpdate';
import AdminBlogHome from './component/blogHome/AdminBlogHome';
import ForgotPassword from './component/about/ForgotPassword';

  export default class App extends Component{  
    render(){
    return (
      <Router>
        <div>
            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
           
            <ProtectedRoute exact path="/savedPageTemplate" component={AdminBlogHome}/>
            <Route exact path="/forgotpass" component={ForgotPassword}/>
            <ProtectedRoute exact path="/savedWebTemplate" component={AdminBlogHome}/>
            <ProtectedRoute exact path="/recentWebTemplate" component={BlogHome}/>
            <ProtectedRoute exact path="/recentPageTemplate" component={BlogHome}/>
            <ProtectedRoute exact path="/webTemplate" component={RecentPage}/>
            <ProtectedRoute exact path="/updateProfile" component={ProfileUpdate}/>
          </Switch>
        </div>
      </Router>
    );
}
  }
  