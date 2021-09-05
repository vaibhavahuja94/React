import React, { Component } from 'react';
import Modal from 'react-modal'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { getBlogIdSuccess, getAdminBlogIdSuccess } from '../../redux/actions/GetBlogByIdActions'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../AdminLayout';
import RecentPageById from './RecentPageById';
import { addPage, getTemplate } from '../../Services/apiFunction';
import { CircularProgress } from '@material-ui/core'
import AdminRecentPageById from './AdminRecentPageById';

class BlogHome extends Component {
    state = {
        showModal: false,
        loader: false,
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
        const { user, blog, adminBlog } = this.props
        const { template, type } = this.props.location.state;
        let blogData
        if (type == "USER") {
            blogData = blog.find(x => x.s_no == template.s_no)
        } else {
            blogData = adminBlog.find(x => x.s_no == template.s_no)
        }
        const string = window.location.pathname.split("/")[1]
        const isWebPage = string.includes("Web")
        return (
            <>
                <AdminLayout title={blogData.title}>
                    <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                        <button style={{ float: "right", borderRadius: "6px", backgroundColor: "#1DABB8" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Page</button>
                    </div>
                    <br />
                    {type == "DEFAULT" ?
                        <AdminRecentPageById blogData={blogData.pageData} /> :
                        <RecentPageById blogData={blogData.pageData} type={type} />
                    }
                </AdminLayout>
                <ToastContainer />
                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                        {this.state.loader ? <CircularProgress /> :
                            <div className="panel-heading"><h3>Create Page
                                <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                            </h3>
                            </div>
                        }
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    title: '',
                                    publish_name: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    title: Yup.string()
                                        .required('Template Title is required'),
                                    publish_name: Yup.string()
                                        .required('Publish Name is required'),
                                })}
                                onSubmit={async (fields, { resetForm, initialValues }) => {
                                    this.setState({ loader: true })
                                    fields.template_id = blogData.id
                                    fields.id = Math.floor(Math.random() * 1000000)
                                    fields.code = "new title"
                                    await addPage(fields)
                                    const template = await getTemplate(user.username)
                                    if (template.STATUS) {
                                        toast.success("Page Created Successfully")
                                        resetForm(initialValues)
                                        this.setState({ showModal: false })
                                        if (type == "USER") {
                                            this.props.createPage(template.USER_TEMPLATE)
                                        }
                                        else {
                                            this.props.createAdminPage(template.DEFAULT_TEMPLATE)
                                        }
                                    }
                                    else {
                                        this.setState({ showModal: false })
                                    }
                                }}
                                render={({ errors, touched, setFieldValue }) => (

                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="title">Title</label>
                                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="publish_name">Publish Name</label>
                                            <Field name="publish_name" type="text" className={'form-control' + (errors.publish_name && touched.publish_name ? ' is-invalid' : '')} />
                                            <ErrorMessage name="publish_name" component="div" className="invalid-feedback" />
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
        user: state.login && state.login.data,
        blog: state.getBlogById && state.getBlogById.allBlog,
        adminBlog: state.getBlogById && state.getBlogById.allAdminBlog
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createPage: (data) => dispatch(getBlogIdSuccess(data)),
        createAdminPage: (data) => dispatch(getAdminBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogHome);
