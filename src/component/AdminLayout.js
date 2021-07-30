import React from 'react';
import './App.css';
import { NavigationBar } from './components/NavigationBar';
import BlogNavBar from './BlogNavBar'
import Header from './Header/Header'

function AdminLayout() {
  return (
    <React.Fragment>
      <BlogNavBar />
        <br />
        <Header />  
    </React.Fragment>
  );
}

export default AdminLayout;
