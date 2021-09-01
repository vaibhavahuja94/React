import React, { Component } from 'react';
import Modal from 'react-modal'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { getBlogIdSuccess } from '../../redux/actions/GetBlogByIdActions'
import ShowBlogById from './ShowBlogById';
import moment from "moment"
import BlogNavBar from '../BlogNavBar'
import Header from '../Header/Header'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../AdminLayout';
import { addTemplate, getTemplate } from '../../Services/apiFunction';

class BlogHome extends Component {
    state = {
        showModal: false,
        string: window.location.pathname.split("/")[1],
        user: JSON.parse(localStorage.getItem('user'))
    }

    render() {
        const customStyles = {
            content: {
                top: '40%',
                left: '50%',
                right: '50%',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };
        Modal.setAppElement('*')
        const { user } = this.props;
        const string = window.location.pathname.split("/")[1]
        const isWebPage = string.includes("Web")
        return (
            <>
                <AdminLayout title="All Templates">
                    <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                        <button style={{ float: "right", borderRadius: "6px", backgroundColor: "#1DABB8" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Template</button>
                    </div>
                    <br />
                    <ShowBlogById />
                </AdminLayout>
                <ToastContainer />
                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><h3>Create Template
                            <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                        </h3>
                        </div>
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    title: '',
                                }}
                                validationSchema={Yup.object().shape({
                                    title: Yup.string()
                                        .required('Template Title is required'),
                                })}
                                onSubmit={async(fields, { resetForm, initialValues }) => {
                                    fields.username = user.username
                                    fields.id = Math.floor(Math.random() * 1000000)
                                    fields.category = "new category"
                                    fields.tags = "new tags"
                                    await addTemplate(fields)
                                    const tempData = await getTemplate(user.username)
                                    if(tempData){
                                    this.props.createBlog(tempData)
                                    }
                                    resetForm(initialValues)
                                    this.setState({ showModal: false })
                                }}
                                render={({ errors, touched, setFieldValue }) => (

                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="title">Title</label>
                                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary">Create Page Template</button>
                                            &nbsp;
                                            <button type="reset" onClick={() => this.fileInput.value = ""} className="btn btn-secondary">Reset</button>
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
        user: state.login && state.login.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createBlog: (data) => dispatch(getBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogHome);
