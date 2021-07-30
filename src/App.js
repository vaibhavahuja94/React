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
import ProtectedRoute from './component/privateRoute/ProtectedRoute';


  export default class App extends Component{
    componentDidMount(){
      return <Redirect to="/home"/>
    }  
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
            <Route path="/register">
              <Register />
            </Route>
           
            <ProtectedRoute exact path="/bloghome" component={BlogHome} />
          </Switch>
        </div>
      </Router>
    );
}
  }
  