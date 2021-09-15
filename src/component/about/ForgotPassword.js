import React, { Component } from 'react';
import Navigation from '../Header';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from "react-google-recaptcha"
import { Link, Redirect, withRouter } from 'react-router-dom'
import { loginUserError, loginUserSuccess } from '../../redux/actions/LoginActions'
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postLogin, sendEmailOTP, sendVerifyOTP, patchApi } from '../../Services/apiFunction'
import { CircularProgress, Typography } from '@material-ui/core'
import '../App.css'

class ForgotPassword extends Component {
    state = {
        otpDisplay: false,
        loader: false,
        passwordDisplay:false,
        otpError:false,
        passwordError:false,
        email:'',
    }

    onOTPSubmit = async (fields) => {
      const obj = {}
        obj.email = fields.email
        obj.otp = fields.otp
        const response = await sendVerifyOTP(obj)
        if(response.STATUS == "SUCCESS"){
          this.setState({email:fields.email})
          this.setState({passwordDisplay:true})
        }else{
          this.setState({otpError:true})
        }
    }

    onEmailSubmit = async (fields) => {
      const obj = {}
      obj.email = fields.email
      const response = await sendEmailOTP(obj)
      if(response.STATUS == "SUCCESS"){
        this.setState({email:fields.email})
        this.setState({otpDisplay:true})
      }else{
        this.setState({passwordError:true})
      }
  }

  onPasswordSubmit = async (fields) => {
    const obj = {}
    obj.email = fields.email
    obj.password = fields.password
    const response = await patchApi(obj)
    if(response.STATUS == "SUCCESS"){
      this.props.history.push('/login')
      this.setState({email:fields.email})
    }
}
    render() {
        return (
            <>
                <div className="row container">
                    <div className="col-sm-7" style={{ marginTop: "7%" }}></div>
                    <div className="col-sm-5 col-xs-12" style={{ marginTop: "7%" }}>
                    {!this.state.otpDisplay && !this.state.passwordDisplay &&
                      <Formik
                            initialValues={{
                                email: ''
                            }}
                            validationSchema={Yup.object().shape({
                                email: Yup.string()
                                    .email('Email is invalid')
                                    .required('Email is required')
                            })}
                            onSubmit={this.onEmailSubmit}
                            render={({ errors, status, touched, setFieldValue }) => (
                                <div className="card" style={{ width: "90%" }}>
                                    <div className="card-body container" >
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                {this.state.loader ?
                                                    <CircularProgress /> :
                                                    <button style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }} type="submit" className="btn mr-2 text-white">Submit</button>
                                                }
                                            </div>
                                        </Form>
                                        <br />
                                    </div>
                                </div>
                            )}
                        />}
                        {this.state.otpDisplay && !this.state.passwordDisplay &&
                        <Formik
                            initialValues={{
                                email: this.state.email,
                                otp:''
                            }}
                            validationSchema={Yup.object().shape({
                                otp: Yup.string().required('Please Enter OTP')
                            })}
                            onSubmit={this.onOTPSubmit}
                            render={({ errors, status, touched, setFieldValue }) => (
                                <div className="card" style={{ width: "90%" }}>
                                    <div className="card-body container" >
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="otp">Enter OTP</label>
                                                <Field name="otp" type="text" className={'form-control' + (errors.otp && touched.otp ? ' is-invalid' : '')} />
                                                <ErrorMessage name="otp" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                {this.state.loader ?
                                                    <CircularProgress /> :
                                                    <button style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }} type="submit" className="btn mr-2 text-white">Submit</button>
                                                }
                                            </div>
                                        </Form>
                                        {this.state.otpError &&<div style={{color:"darkred"}}>Please Enter Correct OTP</div>}
                                        <br />
                                    </div>
                                </div>
                            )}
                        />
                        }
                        {this.state.passwordDisplay && this.state.otpDisplay &&
                          <Formik
                            initialValues={{
                                email: this.state.email,
                                password: '',
                            }}
                            validationSchema={Yup.object().shape({
                                password: Yup.string()
                                    .min(6, 'Password must be at least 6 characters')
                                    .required('Password is required')
                            })}
                            onSubmit={this.onPasswordSubmit}
                            render={({ errors, status, touched, setFieldValue }) => (
                                <div className="card" style={{ width: "90%" }}>
                                    <div className="card-body container" >
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="password">Password</label>
                                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                {this.state.loader ?
                                                    <CircularProgress /> :
                                                    <button style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }} type="submit" className="btn mr-2 text-white">Submit</button>
                                                }
                                            </div>
                                        </Form>
                                        <br />
                                        {this.state.passwordError &&<div style={{color:"darkred"}}>Please Enter Correct Password</div>}
                                    </div>
                                </div>
                            )}
                        />
                        }
                        <ToastContainer />
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        error: state.login && state.login.error,
        data: state.login && state.login.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUsersSuccess: (data) => dispatch(loginUserSuccess(data)),
        loginUsersError: (data) => dispatch(loginUserError(data))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword));