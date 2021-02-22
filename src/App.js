import React,{Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import Login from './component/about/Login';
import Register from './component/about/Register';
import AllBlog from './component/allBlog/AllBlog';
import AllBlogTable from './component/allBlog/AllBlogTable';
import BlogHome from './component/blogHome/BlogHome';
import Contact from './component/contact/Contact';
import Home from './component/home/Home';
import PrivateContact from './component/private/PrivateContact';
import ProtectedRoute from './component/privateRoute/ProtectedRoute';
import ProfileUpdate from './component/profile/ProfileUpdate';


  export default class App extends Component{
      render(){
    return (
      <Router>
        <div>
            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/contact-us">
              <Contact />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
           
            <ProtectedRoute exact path="/bloghome" component={BlogHome} />
            <ProtectedRoute exact path="/profile" component={ProfileUpdate} />
            <ProtectedRoute exact path="/blogviewtable" component={AllBlogTable} />
            <ProtectedRoute exact path="/blogview" component={AllBlog} />
            <ProtectedRoute exact path="/blogcontact" component={PrivateContact} />
          </Switch>
        </div>
      </Router>
    );
}
  }
  