import React, { Component } from 'react';
import BlogNavBar from '../BlogNavBar';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import { patchApi } from '../../Services/apiFunction'
import 'react-toastify/dist/ReactToastify.css';
import { loginUserSuccess } from '../../redux/actions/LoginActions'
import AdminLayout from '../AdminLayout';


class ProfileUpdate extends Component {
    state = {
        country: '',
        region: '',
        data: this.props.user,
        showModal: false,
        submitCount: 0
    }
    componentDidMount() {
        this.setState({ country: this.state.data.Country })
        this.setState({ region: this.state.data.state })
    }

    onSubmit = async (fields) => {
        fields.id = this.state.data.username
        //console.log(fields, fields.id)
        await patchApi(fields.id, fields)
            .then((res) => {
                let obj = {}
                obj = this.props.user
                obj.fname = fields.fname
                obj.lname = fields.lname
                obj.country = fields.country
                obj.state =  fields.state
                obj.city = fields.city
                obj.company = fields.company
                obj.mobile = fields.mobile
                obj.email = fields.email
                obj.address = fields.address
                this.props.loginUsersSuccess(obj)
            })
    }

    render() {
        const customStyles = {
            content: {
                top: '31%',
                left: '75%',
                right: '0%',
                bottom: 'auto',
                transform: 'translate(-1%, -50%)'
            }
        };

        Modal.setAppElement('*')
        const { country, region, data } = this.state;
        return (
            <>
                <AdminLayout title="Update Profile">
                <ToastContainer />
                <div>
                    <div className="row">
                        <div className="col-sm-2"></div>
                    <div className="col-sm-8 card">
                        <div className="card-body">
                        <Formik
                            initialValues={{
                                fname: data.fname,
                                lname: data.lname,
                                country: data.country,
                                state: data.state,
                                city: data.city,
                                company: data.company,
                                mobile: data.mobile,
                                email: data.email,
                                address:data.address
                            }}
                            validationSchema={Yup.object().shape({
                                fname: Yup.string()
                                    .required('First Name is required'),
                                lname: Yup.string()
                                    .required('Last Name is required'),
                                mobile: Yup.string().required('Mobile Number is Required')
                                .matches(/^[0-9]+$/, "Must be only digits")
                                .min(10, "Must be exactly 10 digits")
                                .max(10, "Must be exactly 10 digits"),
                                country: Yup.string().required('Please Select Country'),
                                state: Yup.string().required('Please Select State'),
                                city: Yup.string().required('Please enter City'),
                                address: Yup.string(),
                                email: Yup.string()
                                    .email('Email is invalid')
                                    .required('Email is required'),
                            })}
                            onSubmit={this.onSubmit}
                            render={({ errors, touched, setFieldValue }) => (
                                <div className="panel panel-default">
                                    <div className="panel-body">
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="FName">First Name</label>
                                                <Field name="fname" type="text" className={'form-control' + (errors.fname && touched.fname ? ' is-invalid' : '')} />
                                                <ErrorMessage name="fname" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="LName">Last Name</label>
                                                <Field name="lname" type="text" className={'form-control' + (errors.lname && touched.lname ? ' is-invalid' : '')} />
                                                <ErrorMessage name="lname" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="mobile">Mobile</label>
                                                <Field name="mobile" type="text" className={'form-control' + (errors.mobile && touched.mobile ? ' is-invalid' : '')} />
                                                <ErrorMessage name="mobile" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="company">Company</label>
                                                <Field name="company" type="text" className={'form-control' + (errors.company && touched.company ? ' is-invalid' : '')} />
                                                <ErrorMessage name="company" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address">Address</label>
                                                <Field name="address" type="textarea" className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                                                <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="City">City</label>
                                                <Field name="city" type="text" className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')} />
                                                <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="state">State</label>
                                                <Field name="state" type="text" className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')} />
                                                <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="country">Country</label>
                                                <Field name="country" type="text" className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                            </div>
                                            
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-primary mr-2">Update</button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            )}
                        />
                        </div>
                    </div>
                </div>
                </div>
                </AdminLayout>

                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default ">
                        <div className="panel-heading"><h3>Change Password
                    <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                        </h3>
                        </div>
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    oldPassword: '',
                                    newPassword: '',
                                }}
                                validationSchema={Yup.object().shape({
                                    oldPassword: Yup.string()
                                        .required('Password is required'),
                                    newPassword: Yup.string()
                                        .required('New PassWord is required')
                                        .matches(
                                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                                        ),
                                })}
                                onSubmit={(fields, { resetForm, initialValues }) => {
                                    fields.id = this.state
                                    this.props.updatePassword(fields)
                                    resetForm(initialValues)
                                    this.setState({ showModal: false })

                                }}
                                render={({ errors, touched }) => (

                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="oldPassword">oldPassword</label>
                                            <Field name="oldPassword" type="password" className={'form-control' + (errors.oldPassword && touched.oldPassword ? ' is-invalid' : '')} />
                                            <ErrorMessage name="oldPassword" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="newPassword">NewPassword</label>
                                            <Field name="newPassword" type="password" className={'form-control' + (errors.newPassword && touched.newPassword ? ' is-invalid' : '')} />
                                            <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <button type="submit"
                                                className="btn btn-primary"
                                            >Update Password</button>
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
        data: state.register.data,
        user: state.login.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUsersSuccess: (data) => dispatch(loginUserSuccess(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdate);