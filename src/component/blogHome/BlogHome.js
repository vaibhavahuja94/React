import React, { Component } from 'react';
import Modal from 'react-modal'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { getBlogIdSuccess, defaultPagesSuccess } from '../../redux/actions/GetBlogByIdActions'
import ShowBlogById from './ShowBlogById';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../AdminLayout';
import { addPage, addTemplate, getTemplate, uploadImage } from '../../Services/apiFunction';
import { CircularProgress } from '@material-ui/core'
import Lottie from 'react-lottie';
import { loadDefaultOptions } from './LottieIcon';
import moment from 'moment'

class BlogHome extends Component {
    state = {
        showModal: false,
        loader: true,
        file: '',
        string: window.location.pathname.split("/")[1],
    }

    async componentDidMount() {
        const response = await getTemplate(this.props.user.username)
        if (response.STATUS == "SUCCESS") {
            this.props.createBlog(response.USER_TEMPLATE)
            this.props.defaultPages(response.DEFAULT_PAGES)
            this.setState({ loader: false })
        }

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
        const { loader, file } = this.state
        const string = window.location.pathname.split("/")[1]
        const isWebPage = string.includes("Web")
        return loader ?
            (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: "10%" }}>
                    <Lottie options={loadDefaultOptions}
                        height={200}
                        width={200}
                        style={{ margin: "0 0 0 0" }}
                        isStopped={this.state.isStopped}
                        isPaused={this.state.isPaused} />
                </div>
            ) :
            (
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
                                {this.state.loader ?
                                    <Lottie options={loadDefaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ margin: "0 0 0 0" }}
                                    isStopped={this.state.isStopped}
                                    isPaused={this.state.isPaused} /> 
                                    :
                                    <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                                }
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
                                    onSubmit={async (fields, { resetForm, initialValues }) => {
                                        this.setState({ loader: true })
                                        if (file) {
                                            const response = await uploadImage(file)
                                            fields.image = response.data.secure_url
                                        }
                                        fields.username = user.username
                                        fields.category = "new category"
                                        fields.tags = "new tags"
                                        fields.type = "USER"
                                        const resp = await addTemplate(fields)
                                        if (resp) {
                                            resetForm(initialValues)
                                            toast.success("Template Created Successfully")
                                            let obj = {}
                                            obj.title = "Home Page"
                                            obj.publish_name = "New Template"
                                            obj.template_id = fields.id
                                            obj.code = "new title"
                                            await addPage(obj)
                                            const tempData1 = await getTemplate(user.username)
                                            if (tempData1.STATUS == "SUCCESS") {
                                                this.setState({ showModal: false })
                                                this.setState({ loader: false })
                                                this.props.createBlog(tempData1.USER_TEMPLATE)
                                            }
                                        }
                                        else {
                                            this.setState({ loader: false })
                                            toast.success(resp.data.message)
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
                                                <label htmlFor="title">Images</label>
                                                <input name="image" onChange={(e) => { this.setState({ file: e.target.files[0] }) }} type="file" className="form-control" />
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
        createBlog: (data) => dispatch(getBlogIdSuccess(data)),
        defaultPages: (data) => dispatch(defaultPagesSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogHome);
