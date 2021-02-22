import React, { Component } from 'react';
import BlogNavBar from '../BlogNavBar';
import ContactView from '../contact/ContactView';



export default class PrivateContact extends Component {
   
    render() {
        return (
            <>
                <BlogNavBar />
                <div id="blogbody">
                <ContactView />
                </div>
                
            </>
        );
    }
}
