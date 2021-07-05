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
        contry:'',
        region:'',
        data:'',
        isSign:false
    }
    ResetFunction = e => {
        this.fileInput.value="";
        this.setState({contry:''})
        this.setState({region:''})
    }
    render() {
        if(this.state.isSign===true){
            return <Redirect to="/login"/>    
        }
        const { contry, region } = this.state;
        return (
            <>
            <ToastContainer />
             <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                <ul className="nav navbar-nav navbar-right">
                <Link to="/login" className="btn btn-info navbar-btn">Back To Login</Link>
                </ul>
                </div>
            </nav>
            <div className="col-sm-offset-2 col-sm-8" id="body">
            <Formik
                initialValues={{
                    name: '',
                    age: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    country:'',
                    state:'',
                    city:'',
                    gender:'',
                    hobby:[],
                    imgSrc:''
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string()
                        .required('First Name is required'),
                    age: Yup.string()
                        .required('Age is required').min(0,'Please Enter Greater Age').max(150,'Please Enter Smaller Age'),
                    email: Yup.string()
                        .email('Email is invalid')
                        .required('Email is required'),
                    password: Yup.string()
                        .required('Password is required')
                        .matches(
                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                          ),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Confirm Password is required'),
                    country: Yup.string().required('Please Select Country'),
                    state:Yup.string().required('Please Select State'),
                    city:Yup.string().required('Please enter City'),
                    gender:Yup.string().oneOf(["male","female"]).required('Please Select Gender'),
                    hobby:Yup.array().required('Please Select Hobby').min(1,'Please Select Hobby'),
                    imgSrc:Yup.string().required('Please Select Image')
                })}
                onSubmit={fields => {
                    delete fields.confirmPassword
                    this.props.registerUser(fields)
                    setInterval(() => {
                        
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
                    <div className="panel panel-default">
                        <div className = "panel-body">
                    <Form>
                        <div className="form-group">
                            <label htmlFor="Name">Name</label>
                            <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <Field name="age" type="number" className={'form-control' + (errors.age && touched.age ? ' is-invalid' : '')} />
                            <ErrorMessage name="age" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <CountryDropdown name="country" 
                            value={contry}
                            onChange={(val) => {this.setState({contry:val})
                            setFieldValue('country',val)
                            if(this.state.region!==''){
                            setFieldValue('state','')
                            }
                            }}
                            className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                            <ErrorMessage name="country" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="State">State</label>
                            <RegionDropdown name="state" 
                            country={contry}
                            value={region}
                            onChange={(val) => {this.setState({region:val})
                            setFieldValue('state',val)}}
                            className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')} />
                            <ErrorMessage name="state" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="City">City</label>
                            <Field name="city" type="text" className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')} />
                            <ErrorMessage name="city" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <br />
                            &nbsp;
                            Male:
                            <Field name="gender" type="radio" value="male" className={(errors.gender && touched.gender ? ' is-invalid' : '')} />
                            &nbsp;&nbsp;
                            Female:
                            <Field name="gender" type="radio" value="female" className={(errors.gender && touched.gender ? ' is-invalid' : '')} />
                            <ErrorMessage name="gender" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hobby">Hobby</label>
                            <br />
                            &nbsp;
                            Reading:
                            <Field name="hobby" type="checkbox" value="Reading" className={(errors.hobby && touched.hobby ? ' is-invalid' : '')} />
                            &nbsp;&nbsp;
                            Sports:
                            <Field name="hobby" type="checkbox" value="Sports" className={(errors.hobby && touched.hobby ? ' is-invalid' : '')} />
                            &nbsp;&nbsp;
                            Driving:
                            <Field name="hobby" type="checkbox" value="Driving" className={(errors.hobby && touched.hobby ? ' is-invalid' : '')} />
                            <ErrorMessage name="hobby" component="div" className="invalid-feedback" />
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
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Profile-Image</label>
                            <input name="imgSrc" type="file" accept="image/*" 
                            onChange={(event)=>{ 
                                if (event.target.files && event.target.files[0]) {
                                    let reader = new FileReader(event.target.files[0]);
                                    reader.onloadend = () => {
                                        setFieldValue('imgSrc',reader.result)
                                      }
                                    var url = reader.readAsDataURL(event.target.files[0]);
                                    setFieldValue('url',url);
                              }
                              else{setFieldValue('imgSrc','')}
                            }
                        }
                            ref={ref=> this.fileInput = ref}
                            className={'form-control' + (errors.imgSrc && touched.imgSrc ? ' is-invalid' : '')} />
                            <ErrorMessage name="imgSrc" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Register</button>
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
