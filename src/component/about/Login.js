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
import { postLogin } from '../../Services/apiFunction'
import { CircularProgress, Typography } from '@material-ui/core'
import '../App.css'

class Login extends Component {
    state = {
        loginError: false,
        loader: false,
        loginMessage: "Username or Paasword is Incorrect",
        token: JSON.parse(localStorage.getItem('login'))
    }

    onSubmit = async (fields) => {
        delete fields.recap;
        this.captcha.reset();
        this.setState({ loader: true })
        await postLogin(fields)
            .then((res) => {
                if (res.data.success == 1) {
                    this.setState({ loginError: false })
                    let user1 = res.data.data
                    this.props.loginUsersSuccess(user1)
                    localStorage.setItem('login', JSON.stringify(true))
                    localStorage.setItem('token', (res.data.token))
                    this.props.history.push('/recentWebTemplate')
                }
                else {
                    this.setState({ loginError: true })
                    this.setState({ loader: false })
                }
            })
            .catch(err => { console.log(err) })
    }

    // loginUnsuccessFul() {
    //     console.log(this.props.data)
    //     if (this.props.data.length===0) {
    //         console.log("true")
    //         this.setState({ loginError: true })
    //         return "Error"
    //     }
    //     else {
    //         this.setState({ loginError: false })
    //         return "Success"
    //     }
    // }
    render() {
        return (
            <>
                <div className="row container">
                    <div className="col-sm-7" style={{ marginTop: "7%" }}></div>
                    <div className="col-sm-5 col-xs-12" style={{ marginTop: "7%" }}>
                        <Formik
                            initialValues={{
                                email: '',
                                password: '',
                                recap: "",
                            }}
                            validationSchema={Yup.object().shape({
                                email: Yup.string()
                                    .email('Email is invalid')
                                    .required('Email is required'),
                                password: Yup.string()
                                    .min(6, 'Password must be at least 6 characters')
                                    .required('Password is required'),
                                recap: Yup.string().required('I am Not Robot').nullable()
                            })}
                            onSubmit={this.onSubmit}
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
                                                <label htmlFor="password">Password</label>
                                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group"
                                            style = {{transform:"scale(0.77)",webkiTransform:"scale(0.77)",transformOrigin:"0 0",webkitTransformOrigin:"0 0"}}
                                            >
                                                <ReCAPTCHA name="recap"
                                                    siz="compact"
                                                    sitekey="6LdGeyoaAAAAAE21Zje8qUxj5-dr7vqA0R0Fsc2T"
                                                    onChange={(value) => setFieldValue('recap', value)}
                                                    ref={e => (this.captcha = e)}
                                                    className={(errors.recap && touched.recap ? ' is-invalid' : '')}
                                                />
                                                <ErrorMessage name="recap" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                {this.state.loader ?
                                                    <CircularProgress /> :
                                                    <button style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }} type="submit" className="btn mr-2 text-white">Login</button>
                                                }
                                                &nbsp;
                                                <button type="reset" className="btn text-white" style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }}
                                                    onClick={() => this.captcha.reset()}
                                                >Reset</button>
                                            </div>
                                            <div className="form-group">
                                                <Link to="/register" className="btn text-white" style={{ borderRadius: "6px", backgroundColor: "#1DABB8" }}>Sign-Up</Link>
                                            </div>
                                            <div>
                                                {this.state.loginError === true && <p style={{ "color": "red" }}>{this.state.loginMessage}</p>}
                                            </div>
                                            <Typography variant="body1">
                                                Don't have an account?{' '}
                                                <Link to="/register">
                                                    Sign up
                                                </Link>
                                            </Typography>
                                        </Form>
                                        <br />
                                    </div>
                                </div>
                            )}
                        />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));