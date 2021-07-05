import React, {Component} from 'react'
import {NavLink, Redirect} from 'react-router-dom'
import './main.css'

export default class Navigation extends Component {
    state = {
        token:JSON.parse(localStorage.getItem('login'))
    }
    render(){
        if(this.state.token===true){
          
            return <Redirect to='/bloghome' />
        }
        return(
            <div>
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                <ul className="nav navbar-nav navbar-right">
                    <li ><NavLink to="/home" activeClassName='active'>
                    <span className="text-primary">Home</span></NavLink></li>
                    <li ><NavLink to="/contact-us" activeClassName='active'>
                    <span className="text-primary">Contact</span></NavLink></li>
                    <li ><NavLink to="/login" activeClassName='active'>
                        <span className="text-primary">Get-In_Touch</span></NavLink></li>
                </ul>
                </div>
            </nav>
            </div>
        )
    }
}