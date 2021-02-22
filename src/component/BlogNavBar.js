import React, { Component } from 'react';
import {NavLink, Link} from 'react-router-dom'
import {connect} from "react-redux"
import './main.css'
import { Formik, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import Modal from 'react-modal'
import { updateUserImage } from '../redux/actions/RegisterActions';

class BlogNavBar extends Component {
    
    
    state={
        user:JSON.parse(localStorage.getItem('user')),
        showModal:false
    }
    logOut = () =>{
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.setItem('login', JSON.stringify(false))
    }
   
    render() {
        
        const customStyles = {
            content : {
              top                   : '43%',
              left                  : '75%',
              right                 : '0%',
              bottom                : 'auto',
              transform             : 'translate(-0%, -50%)'
            }
          };
          
           Modal.setAppElement('*')
        const {user} = this.state
        return (
            <>
                <div className="container-fluid">
                <ul className="nav flex-sm-column">
                    <li><h3 className="text-primary">BLOGNAME</h3></li>
                    <li><img src={user.imgSrc} className="img-circle" alt="profile" width="70" height="70" />
                    <span className="text-primary">{user.name}</span></li>
                    <li ><NavLink to="/bloghome" activeClassName='active'>
                    <span className="text-primary">HomeBlog</span></NavLink></li>
                    <li ><NavLink to="/profile" activeClassName='active'>
                    <span className="text-primary">Profile-Update</span></NavLink></li>
                    <li ><NavLink to="/blogview" activeClassName='active'>
                    <span className="text-primary">ALLBlogView</span></NavLink></li>
                    <li ><NavLink to="/blogviewtable" activeClassName='active'>
                    <span className="text-primary">ALLBlogTable</span></NavLink></li>
                </ul>
                </div>
            
            <nav className="navbar navbar-default navbar-fixed-top" id="sidebar">
                <div className="container-fluid">
                <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>                        
                </button>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                <ul className="nav navbar-nav">
                    <li ><NavLink to="/bloghome" activeClassName='active'>
                    <span className="text-primary">Home</span></NavLink></li>
                    <li ><NavLink to="/blogcontact" activeClassName='active'>
                    <span className="text-primary">Contact</span></NavLink></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                    <img src={user.imgSrc} className="img-circle" alt="profile" width="45" height="45" onClick={()=>this.setState({showModal:true})} />&nbsp;
                    <Link to="/home" onClick={()=>this.logOut()}
                    className="btn btn-danger navbar-btn">Logout</Link>
                </ul>
                
                </div>
                </div>
            </nav>
            <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default ">
                    <div className="panel-heading">Change Profile
                    <button className="close" onClick={()=>this.setState({showModal:false})}>&times;</button>
                    
                    </div>
                    <div className="panel panel-body">
            <Formik
                initialValues={{
                    imgSrc:user.imgSrc
                }}
                validationSchema={Yup.object().shape({
                   imgSrc:Yup.string().required('Please Select Image')
                })}
                onSubmit={(fields,{resetForm,initialValues}) => {
                    fields.id = user.id
                    this.props.updateImage(fields)
                    resetForm(initialValues)
                    this.setState({showModal:false})
                    setTimeout(() => {
                        window.location.reload()
                    }, 2500);
                }}
                render={({ errors, touched,fields,initialValues,setFieldValue}) => (
                    
                    <Form>
                        <div className="form-group">
                            <img src={initialValues.imgSrc} alt="profile" width="350" height="400"/>
                            
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Blog Profile-Image</label>
                            <input name="imgSrc" type="file" accept="image/*" 
                            onChange={(event)=>{ 
                                if (event.target.files && event.target.files[0]) {
                                    let reader = new FileReader(event.target.files[0]);
                                    reader.onloadend = () => {
                                        setFieldValue('imgSrc',reader.result)
                                      }
                                    reader.readAsDataURL(event.target.files[0]);

                              }
                              else{setFieldValue('imgSrc','')}
                            }
                        }
                            ref={ref=> this.fileInput = ref}
                            className={'form-control' + (errors.imgSrc && touched.imgSrc ? ' is-invalid' : '')} />
                            <ErrorMessage name="imgSrc" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" 
                            className="btn btn-primary"
                            >Update Image</button>
                        </div>
                    </Form>
                )}
            />
            </div>
            </div>
            </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    
    return {
     data:state.getData.data
    
    }
  } 

  const mapDispatchToProps = dispatch => {
    return{
    updateImage:(data)=>(dispatch(updateUserImage(data)))
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(BlogNavBar);