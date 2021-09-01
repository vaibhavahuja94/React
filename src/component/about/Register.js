import React from 'react';
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import {Link,Redirect} from 'react-router-dom'
import { connect } from 'react-redux';
import {registerUsers} from '../../redux/actions/RegisterActions'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Register extends React.Component {
    state= {
        data:'',
        isSign:false
    }
    render() {
        if(this.state.isSign===true){
            return <Redirect to="/login"/>    
        }
        return (
            <>
            <ToastContainer />
             <nav className="navbar navbar-expand-lg navbar-default bg-light fixed-top">
                <div className="container-fluid float-right" style={{marginLeft:"82.5%"}}>
                <ul className="nav navbar-nav" >
                <Link to="/login" className="btn btn-info navbar-btn">Back To Login</Link>
                </ul>
                </div>
            </nav>
            <br />
            <div className="col-sm-offset-2 col-sm-8" id="body" style={{marginLeft:"15%"}}>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={Yup.object().shape({
                    fame: Yup.string()
                        .required('First Name is required'),
                    lname:Yup.string()
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
                    // confirmPassword: Yup.string()
                    //     .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    //     .required('Confirm Password is required'),
                })}
                onSubmit={fields => {
                    this.props.registerUser(fields)
                    setInterval(() => {
                        this.setState({isSign:true})  
                    }, 500);
                    if(this.props.error.length>0)
                    {
                      this.setState({isSign:false})
                        
                    }
                    else{
                    this.setState({isSign:true})
                    }
                }}
                render={({ errors, touched ,setFieldValue }) => (
                    <div className="card" style={{width:"50%"}}>
                        <div className = "card-body">
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
                    </Form>
                    </div>
                    </div>
                )}
            />
            </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        error:state.register.error

    }
  }

const mapDispatchToProps = dispatch => {
  return{registerUser:(data)=>dispatch(registerUsers(data))}
}

export default connect(mapStateToProps,mapDispatchToProps)(Register);
