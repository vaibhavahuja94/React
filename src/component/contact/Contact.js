import React, { Component } from 'react';
import Navigation from '../Header';
import ContactView from './ContactView';

export default class Contact extends Component {
   
    render() {
        return (
            <>
                <Navigation />
                <div id="body">
                <ContactView />
                </div>
            </>
        );
    }
}

