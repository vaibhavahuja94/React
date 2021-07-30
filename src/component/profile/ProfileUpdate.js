import React, { Component } from 'react';
import BlogNavBar from '../BlogNavBar';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { updateUserPassword, updateUser } from '../../redux/actions/RegisterActions'
import { ToastContainer } from 'react-toastify';
import { patchApi } from '../../Services/apiFunction'
import 'react-toastify/dist/ReactToastify.css';
import { loginUserSuccess } from '../../redux/actions/LoginActions'


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
        fields.id = this.state.data.id
        //console.log(fields, fields.id)
        await patchApi(fields.id, fields)
            .then((res) => {
                this.props.loginUsersSuccess(res.data)
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
                <BlogNavBar />
                <ToastContainer />
                <div id="bloghome">
                    <button className="btn btn-danger" onClick={() => this.setState({ showModal: true })}>PassWord Update</button>
                </div>
                <div id="myblogbody">
                    <div className="col-sm-offset-1 col-sm-8">
                        <Formik
                            initialValues={{
                                name: data.name,
                                age: data.age,
                                Country: data.Country,
                                state: data.state,
                                city: data.city,
                                gender: data.gender,
                                hobby: data.hobby,
                                email: data.email,
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string()
                                    .required('First Name is required'),
                                age: Yup.string()
                                    .required('Age is required').min(0, 'Please Enter Greater Age').max(150, 'Please Enter Smaller Age'),
                                Country: Yup.string().required('Please Select Country'),
                                state: Yup.string().required('Please Select State'),
                                city: Yup.string().required('Please enter City'),
                                gender: Yup.string().oneOf(["male", "female"]).required('Please Select Gender'),
                                hobby: Yup.array().required('Please Select Hobby').min(1, 'Please Select Hobby'),
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
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Country">Country</label>
                                                <CountryDropdown name="Country"
                                                    value={country}
                                                    onChange={(val) => {
                                                        this.setState({ country: val })
                                                        setFieldValue('Country', val)
                                                        if (this.state.region !== '') {
                                                            setFieldValue('state', '')
                                                        }
                                                    }}
                                                    className={'form-control' + (errors.Country && touched.Country ? ' is-invalid' : '')} />
                                                <ErrorMessage name="Country" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="State">State</label>
                                                <RegionDropdown name="state"
                                                    country={country}
                                                    value={region}
                                                    onChange={(val) => {
                                                        this.setState({ region: val })
                                                        setFieldValue('state', val)
                                                    }}
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
                                                <button type="submit" className="btn btn-primary mr-2">Update</button>

                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>

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
        window: state.register.window,
        user: state.login.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUsersSuccess: (data) => dispatch(loginUserSuccess(data)),
        updatePassword: (data) => dispatch(updateUserPassword(data)),
        updateUser: (data) => dispatch(updateUser(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdate);