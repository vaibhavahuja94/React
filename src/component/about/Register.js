import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Link, Redirect, withRouter } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import { registerApi } from '../../Services/apiFunction';
import 'react-toastify/dist/ReactToastify.css';
import {Typography} from '@material-ui/core'

class Register extends React.Component {
    state = {
        data: '',
        isSign: false
    }
    render() {
        if (this.state.isSign === true) {
            return <Redirect to="/login" />
        }
        return (
            <>
                <ToastContainer />
                <br />
                <div className="row">
                <div className="col-sm-3">
                </div>
                <div className="col-sm-8" id="body" style={{ marginLeft: "15%" }}>
                    <Formik
                        initialValues={{
                            fname: '',
                            lname: '',
                            email: '',
                            password: '',
                        }}
                        validationSchema={Yup.object().shape({
                            fname: Yup.string()
                                .required('First Name is required'),
                            lname: Yup.string()
                                .required('Last Name is required'),
                            email: Yup.string()
                                .email('Email is invalid')
                                .required('Email is required'),
                            password: Yup.string()
                                .required('Password is required')
                                .matches(
                                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                                ),
                        })}
                        onSubmit={async (fields) => {
                            const response = await registerApi(fields)
                            if (response.data.success == "1") {
                                toast.success('Registration Successfully')
                                this.props.history.push('/login')
                            } else {
                                toast.error('Registration Unsuccessfully')
                            }
                        }}
                        render={({ errors, touched, setFieldValue }) => (
                            <div className="card card-Width">
                                <div className="card-body">
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="First Name">First Name</label>
                                            <Field name="fname" type="text" className={'form-control' + (errors.fname && touched.fname ? ' is-invalid' : '')} />
                                            <ErrorMessage name="fname" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Last Name">Last Name</label>
                                            <Field name="lname" type="text" className={'form-control' + (errors.lname && touched.lname ? ' is-invalid' : '')} />
                                            <ErrorMessage name="lname" component="div" className="invalid-feedback" />
                                        </div>
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
                                            <button type="submit" className="btn btn-info mr-2">Register</button>
                                            &nbsp;
                                            <button type="reset" className="btn btn-secondary"
                                                onClick={this.ResetFunction}>Reset</button>
                                        </div>
                                        <Typography variant="body1">
                                            Already Have an Account?{' '}
                                            <Link to="/login">
                                                Login
                                            </Link>
                                        </Typography>
                                    </Form>
                                </div>
                            </div>
                        )}
                    />
                </div>
                </div>
            </>
        )
    }
}

export default withRouter(Register);
