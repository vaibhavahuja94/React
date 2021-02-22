import React, { Component } from 'react';
import Navigation from '../Header';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from "react-google-recaptcha"
import {Link} from 'react-router-dom'
import {loginUsers} from '../../redux/actions/LoginActions'
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends Component {
    state = {
        token:JSON.parse(localStorage.getItem('login'))
    }
    loginUnsuccessFul = () =>{
        if(this.props.error.length>0){
            setTimeout(() => {
                window.location.reload()
            }, 50000);
            console.log("Vaibhav")
          return  <p style={{color:"red"}}>{this.props.error}</p>
        }
        else{
            console.log("Vaibhav",this.props.error)
                window.location.reload()
        }
    }
    render() {
        
        return (
            <>
            <Navigation />
            
            <div className="col-sm-offset-3 col-sm-5" id="body">
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    recap:"",
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .email('Email is invalid')
                        .required('Email is required'),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters')
                        .required('Password is required'),
                    recap:Yup.string().required('I am Not Robot').nullable()
                })}
                onSubmit={fields => {
                    delete fields.recap;
                    this.props.loginUser(fields)
                    this.captcha.reset();
                    setTimeout(() => {
                        this.loginUnsuccessFul()
                    }, 1000);
                    
                }}
                render={({ errors, status, touched ,setFieldValue}) => (
                    <div className="panel panel-default">
                        <div className = "panel-body">
                    <Form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                        <ReCAPTCHA name="recap"
                        sitekey="6LdGeyoaAAAAAE21Zje8qUxj5-dr7vqA0R0Fsc2T"
                        onChange={(value)=>setFieldValue('recap',value)}
                        ref={e => (this.captcha = e)}
                        className={(errors.recap && touched.recap ? ' is-invalid' : '')}
                        />
                        <ErrorMessage name="recap" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Login</button>
                            &nbsp;
                            <button type="reset" className="btn btn-secondary"
                            onClick={()=>this.captcha.reset()}
                            >Reset</button>
                        </div>
                        <div className="form-group">
                        <Link to="/register" className="btn btn-success">Sign-Up</Link>
                        </div>
                    </Form>
                    <br />
                   
                    </div>
                    </div>
                )}
            />
            <ToastContainer />
            </div>
            
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      user: state.login.user,
      error:state.login.error,
      login:state.login.login
    }
  }

const mapDispatchToProps = dispatch => {
  return{ 
        loginUser:(data)=>dispatch(loginUsers(data))
}
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);