import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom'
import { connect } from "react-redux"
import './main.css'
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import Modal from 'react-modal'
import { loginUserSuccess } from '../redux/actions/LoginActions';
import { patchApi } from '../Services/apiFunction'

class BlogNavBar extends Component {
    state = {
        user: this.props.user,
        showModal: false
    }
    logOut = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.setItem('login', JSON.stringify(false))
    }

    onSubmit = async (fields) => {
        //e.prevetDefault()
        fields.id = this.props.user.id
        //resetForm(initialValues)
        await patchApi(fields.id, fields)
            .then((res) => {
                this.props.updateImage(res.data)
            })
        this.setState({ showModal: false })
    }
    render() {
        const customStyles = {
            content: {
                top: '43%',
                left: '75%',
                right: '0%',
                bottom: 'auto',
                transform: 'translate(-0%, -50%)'
            }
        };

        Modal.setAppElement('*')
        const { user } = this.props
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top justify-content-between">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <ul className="nav navbar-nav ml-auto" >
                            <li className="nav-item">
                            <img src={user.imgSrc} className="rounded-circle" alt="profile" width="45" height="45" onClick={() => this.setState({ showModal: true })} />&nbsp;
                            </li>
                            <li className="nav-item">
                            <Link to="/home" onClick={() => this.logOut()} className="btn btn-danger">Back To Login</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default ">
                        <div className="panel-heading">Change Profile
                            <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>

                        </div>
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    imgSrc: user.imgSrc
                                }}
                                validationSchema={Yup.object().shape({
                                    imgSrc: Yup.string().required('Please Select Image')
                                })}
                                onSubmit={this.onSubmit}
                                render={({ errors, touched, fields, initialValues, setFieldValue }) => (

                                    <Form>
                                        <div className="form-group">
                                            <img src={initialValues.imgSrc} alt="profile" width="350" height="400" />

                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="image">Blog Profile-Image</label>
                                            <input name="imgSrc" type="file" accept="image/*"
                                                onChange={(event) => {
                                                    if (event.target.files && event.target.files[0]) {
                                                        let reader = new FileReader(event.target.files[0]);
                                                        reader.onloadend = () => {
                                                            setFieldValue('imgSrc', reader.result)
                                                        }
                                                        reader.readAsDataURL(event.target.files[0]);

                                                    }
                                                    else { setFieldValue('imgSrc', '') }
                                                }
                                                }
                                                ref={ref => this.fileInput = ref}
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
        data: state.getData.data,
        user: state.login.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateImage: (data) => (dispatch(loginUserSuccess(data)))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BlogNavBar);