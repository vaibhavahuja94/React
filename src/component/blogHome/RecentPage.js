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
import { addPage, getTemplate, mergePage, updateHide, updateHidePage, uploadImage } from '../../Services/apiFunction';
import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AdminRecentPageById from './AdminRecentPageById';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import './BlogHome.css'
import Lottie from 'react-lottie';
import loadingAnimationData from './loadingV2.json'
import { loadDefaultOptions } from './LottieIcon';
import LottieIcon from './LottieIco';

class BlogHome extends Component {
    state = {
        showModal: false,
        showPageModal: false,
        loader: false,
        file: '',
        favicon: '',
        radioValue: '',
        valueError: '',
        pageData: [],
        isStopped: false,
        isPaused: false,
        string: window.location.pathname.split("/")[1],
    }

    handleSubmit = async (event) => {
        let value = this.state.radioValue
        const type = this.props.location.state.type
        if (value != "") {
            let obj = {}
            obj.template_id = this.state.pageData.id
            obj.page_id = value
            const response = await mergePage(obj)
            toast.success(response.MESSAGE)
            this.setState({ showPageModal: false })
            const template = await getTemplate(this.props.user.username)
            if (template.STATUS == "SUCCESS") {
                if (type == "USER") {
                    this.props.createPage(template.USER_TEMPLATE)
                    window.location.reload()
                }
                else {
                    this.props.createAdminPage(template.DEFAULT_TEMPLATE)
                    window.location.reload()
                }
            }
        }
        else {
            toast.error("No Page is Selected")
        }
        console.log(value)
    }

    openModal = (e, value) => {
        this.setState({ showPageModal: true })
        this.setState({ pageData: value })
        e.preventDefault()
    }

    render() {

        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: '50%',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };
        const customPageStyles = {
            content: {
                top: '15%',
                left: '10%',
                right: "10%",
                flex: 1,
                overflowY: 'auto',
                bottom: '5%'
            }
        };
        Modal.setAppElement('*')
        const { user, blog, adminBlog } = this.props
        const { file, favicon } = this.state
        const { template, type } = this.props.location.state;
        let blogData
        if (type == "USER") {
            blogData = blog.find(x => x.s_no == template.s_no)
        } else {
            blogData = adminBlog.find(x => x.s_no == template.s_no)
        }
        const string = window.location.pathname.split("/")[1]
        const isWebPage = string.includes("Web")
        return this.state.loader ? (
            <LottieIcon animationData={loadingAnimationData} pause={this.state.isPaused} height={50} width={50}/>
        ) :
            (
                <>
                    <AdminLayout title={blogData.title}>
                        <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                            <Tooltip title="Add Default Page">
                                <span style={{ float: "right", marginRight: "10px" }} onClick={(e) => { this.openModal(e, blogData) }}>
                                    <AddCircleOutlineIcon />
                                </span></Tooltip>
                            <button style={{ float: "right", borderRadius: "3px", marginRight: "10px", backgroundColor: "#1DABB8" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Page</button>
                        </div>
                        <br />
                        {blogData && type == "DEFAULT" ?
                            <AdminRecentPageById blogData={blogData.pageData} /> :
                            <RecentPageById blogData={blogData.pageData} type={type} />
                        }
                    </AdminLayout>
                    <ToastContainer />
                    <Modal isOpen={this.state.showModal} style={customStyles}>
                        <div className="panel panel-default">
                            <div className="panel-heading"><h3>Create Page
                                <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                            </h3>
                            </div>
                            <div className="panel panel-body">
                                <Formik
                                    initialValues={{
                                        title: '',
                                        publish_name: '',
                                        homepage: '',
                                        image: '',
                                        favicon: '',
                                        description: ''
                                    }}
                                    validationSchema={Yup.object().shape({
                                        title: Yup.string()
                                            .required('Template Title is required'),
                                        publish_name: Yup.string()
                                            .required('Publish Name is required'),
                                        homePage: '',
                                    })}
                                    onSubmit={async (fields, { resetForm, initialValues }) => {
                                        this.setState({ loader: true })
                                        fields.template_id = blogData.id
                                        fields.code = "new code"
                                        if (fields.homepage == true) {
                                            fields.is_homepage = "TRUE"
                                        } else {
                                            fields.is_homepage = "FALSE"
                                        }
                                        if (file) {
                                            const response = await uploadImage(file)
                                            fields.image = response.data.secure_url
                                        }
                                        if (favicon) {
                                            const response = await uploadImage(favicon)
                                            fields.favicon = response.data.secure_url
                                        }
                                        const resp = await addPage(fields)
                                        if (resp.STATUS == "SUCCESS") {
                                            const template = await getTemplate(user.username)
                                            if (template.STATUS == "SUCCESS") {
                                                toast.success("Page Created Successfully")
                                                resetForm(initialValues)
                                                this.setState({ showModal: false })
                                                this.props.createPage(template.USER_TEMPLATE)
                                            }
                                        }
                                        else {
                                            this.setState({ showModal: false })
                                        }
                                    }}
                                    render={({ errors, touched, setFieldValue }) => (
                                        <Form>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="title">Title</label>
                                                        <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="publish_name">Publish Name</label>
                                                        <Field name="publish_name" type="text" className={'form-control' + (errors.publish_name && touched.publish_name ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="publish_name" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="title">Image Preview</label>
                                                        <input name="image" onChange={(e) => { this.setState({ file: e.target.files[0] }) }} type="file" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group">
                                                        <label htmlFor="title">Favicon</label>
                                                        <input name="favicon" onChange={(e) => { this.setState({ favicon: e.target.files[0] }) }} type="file" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <Field name="description" type="text" className="form-control" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="homepage">
                                                    <Field name="homepage" type="checkbox" className={(errors.homepage && touched.homepage ? ' is-invalid' : '')} />Is Home Page
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-primary">Create Page Template</button>
                                                &nbsp;
                                                <button type="reset" onClick={() => this.setState({ file: "" })} className="btn btn-secondary">Reset</button>
                                            </div>
                                        </Form>
                                    )}
                                />
                            </div>
                        </div>
                    </Modal>
                    <Modal isOpen={this.state.showPageModal} style={customPageStyles}>
                        <div className="panel panel-default">
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ margin: "0 0 0 0" }}
                                    isStopped={this.state.isStopped}
                                    isPaused={this.state.isPaused} />
                                :
                                <div className="panel-heading"><h3>Merge Page
                                    <button className="close" onClick={() => this.setState({ showPageModal: false })}>&times;</button>
                                </h3>
                                    <hr />
                                </div>
                            }
                            <div className="panel panel-body" >
                                <div className="container-fluid">
                                    <div className="row">
                                        {this.props.defaultPages.length > 0 && this.props.defaultPages.map(value =>
                                            <>
                                                <div className="col-sm-4">
                                                    <div>
                                                        <label>
                                                            <input type="radio" value={value.page_id} name="page" className="card-input-element" onChange={(e) => { this.setState({ radioValue: e.target.value }) }} />
                                                            <Card className="card-input">
                                                                <img src={value.image ? value.image : "https://res.cloudinary.com/w3bizz-com/image/upload/c_scale,w_425/v1632246930/2_hjs08o.png"} style={{ height: "15em", width: "100%" }} />
                                                                <CardContent>
                                                                    <span>
                                                                        <h4 style={{ display: "inline" }}>{value.page_title}</h4>
                                                                    </span>
                                                                </CardContent>
                                                            </Card>
                                                        </label>
                                                    </div>
                                                    <br />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="panel panel-footer">
                                <button className="btn btn-info" style={{ float: "right" }} onClick={(event) => { this.handleSubmit(event) }}>Submit</button>
                                <br />
                            </div>
                            <br />
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
        adminBlog: state.getBlogById && state.getBlogById.allAdminBlog,
        defaultPages: state.getBlogById && state.getBlogById.defaultPages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createPage: (data) => dispatch(getBlogIdSuccess(data)),
        createAdminPage: (data) => dispatch(getAdminBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogHome);
