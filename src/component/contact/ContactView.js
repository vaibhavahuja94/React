import React, { Component } from 'react';
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import GoogleMapReact from 'google-map-react';
import { registerContact } from '../../redux/actions/RegisterActions';
import {connect} from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AnyReactComponent = ({ text }) => <div>{text}</div>;

class ContactView extends Component {
   
    static defaultProps = {
        center: {
          lat: 21.204464,
          lng: 72.8530943
        },
        zoom: 20
      };

    render() {
        return (
            <>
                
            <div className="col-sm-12" >
            <div className="panel panel-default">
            <div className = "panel-body">
            <div className="col-sm-3">
                <h2><strong>Enquiry</strong></h2>        
            <Formik
                initialValues={{
                    name: '',
                    message: '',
                    email: '',
                    phone:''
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string()
                        .required('First Name is required'),
                    phone: Yup.string()
                        .required('Contact Number is required').min(10,'Please Enter Proper Contact Number').max(10,'Please Enter Proper Contact Number'),
                    email: Yup.string()
                        .email('Email is invalid')
                        .required('Email is required'),
                    message: Yup.string().required('Please Enter Message')
                })}
                onSubmit={fields => {
                    this.props.registerContact(fields);
                }}
                render={({ errors, touched}) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="Name">Name:</label>
                            <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <Field name="message" as="textarea" className={'form-control' + (errors.message && touched.message ? ' is-invalid' : '')} />
                            <ErrorMessage name="message" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Contact No:</label>
                            <Field name="phone" type="number" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                        </div>
                        
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Register</button>
                            &nbsp;
                            <button type="reset" className="btn btn-secondary" >Reset</button>
                        </div>
                    </Form>
                    
                )}
            />
            </div>
                <div className="col-sm-offset-1 col-sm-3">
                    <h2><strong>About-Us</strong></h2>
                    <br />
                    <h4><strong>Name:</strong>BlueSoft-Infotech</h4>
                    <br />
                    <h4><strong>Address:</strong>241, 2nd Floor Royal Palza,BRTS Rd. Opp. Patel park, Simada, Surat, Gujarat</h4>
                    <br />
                    <h4><strong>Contact:</strong>+91-9898536214</h4>
                </div>
                
                <div className="col-sm-offset-1 col-sm-3">
                    <h2><strong>Our Location</strong></h2>
                <div style={{height:'38vh',width:'100%'}}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key:"AIzaSyCe2Y8Hec5WdWnurbObiE-I_63kN4SUE4U" }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                <AnyReactComponent
                    lat= {21.204464}
                    lng= {72.8530943}
                    text="My Marker"
                />
                </GoogleMapReact>
                </div>
                </div>

            </div>
            </div>
            </div>
            <ToastContainer />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
     

    }
  }

const mapDispatchToProps = dispatch => {
  return{registerContact:(data)=>dispatch(registerContact(data))}
}

export default connect(mapStateToProps,mapDispatchToProps)(ContactView);