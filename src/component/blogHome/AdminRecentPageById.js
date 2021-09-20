import React, { Component } from 'react';
import Lottie from 'react-lottie';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import Modal from 'react-modal'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { Link, withRouter } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { getTemplate, updateHidePage, uploadImage } from '../../Services/apiFunction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { CircularProgress } from '@material-ui/core'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { loadDefaultOptions } from './LottieIcon';


class ShowBlogById extends Component {

    state = {
        showModal: false,
        showPageMergeModal: false,
        id: '',
        pageData: '',
        img: '',
        name: '',
        template: false,
        string: "",
        file: '',
        favicon: '',
        editDetails: '',
        blogdata: this.props.blogData
    }

    handleView(event, value) {
        window.open(`https://w3bizz.com/test/editor?${value.page_id}`)
    }

    handleHide = async (value) => {
        let obj = {}
        obj.id = value.page_id
        obj.is_hidden = (value.is_hidden === "FALSE" ? "TRUE" : "FALSE")
        const response = await updateHidePage(obj)
        if (response.STATUS == "SUCCESS") {
            let blog = this.props.blogData
            var list = []
            blog.forEach((el) => {
                if (el.id == value.id) {
                    el.is_hidden = obj.is_hidden
                    list.push(el)
                }
                else {
                    list.push(el)
                }
            })
            this.setState({ blogdata: list })
        }
    }

    preView = async (e, link) => {
        if (link != '') {
            window.open(link, "_blank")
        }
        else {
            toast.error("No Preview is Present")
        }
    }

    mergePage = (e, value) => {
        this.setState({ showPageMergeModal: true })
        this.setState({ pageData: value })
    }

    handleEdit = (e, value) => {
        if (value.is_homepage == "FALSE") {
            value.is_homepage = false
        } else {
            value.is_homepage = true
        }
        this.setState({ showModal: true })
        this.setState({ editDetails: value })
        e.preventDefault()
    }



    render() {
        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }

        const { file, favicon } = this.state
        const { blogStatus, comment, isWebPage, user } = this.props
        const { blogdata } = this.state
        const customStyles = {
            content: {
                top: '55%',
                left: '40%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)'
            }
        };
        console.log(this.state.blogdata)
        const classes = makeStyles({
            root: {
                minWidth: 275,
            },
            bullet: {
                display: 'inline-block',
                margin: '0 2px',
                transform: 'scale(0.8)',
            },
            title: {
                fontSize: 14,
            },
            pos: {
                marginBottom: 12,
            },
        });
        Modal.setAppElement('*')
        return (
            <>
                <ToastContainer />
                <div className="container-fluid">
                    <div className="row">
                        {blogdata.length > 0 && blogdata.map(value =>
                            <div className="col-sm-4 col-xs-9">
                                <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                    {value.image ?
                                    <img src={value.image} style={{ height: "15em", width: "100%", background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(36,189,252,1) 100%)" }} />
                                    :
                                    <img style={{ height: "15em", width: "100%", background: "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(36,189,252,1) 100%)" }} />
                                    }
                                    <br />
                                    <CardContent>
                                        <span >
                                            <h4 style={{ display: "inline" }}>{value.page_title}</h4>
                                            <br />
                                            <br />
                                            <span style={{ display: "inline" }}>
                                                <Tooltip title="Preview of Page"><SlideshowIcon  onClick={(e) => { this.preView(e, value.preview_link) }} /></Tooltip>
                                                {user.type == "ADMIN" &&
                                                    <>
                                                        <Tooltip title="Edit Page"><EditIcon  onClick={(event) => this.handleView(event, value)} /></Tooltip>
                                                        <Tooltip title="Edit Page Details"><SettingsApplicationsIcon  onClick={(event) => this.handleEdit(event, value)} /></Tooltip>
                                                    </>
                                                }
                                                <span
                                                    
                                                    onClick={() => {
                                                        this.handleHide(value);
                                                    }}>
                                                    {' '}
                                                    {value.is_hidden == "FALSE" ? <Tooltip title="Hide"><VisibilityOffIcon /></Tooltip> : <Tooltip title="Show"><VisibilityIcon /></Tooltip>}
                                                </span>
                                            </span>
                                        </span>
                                    </CardContent>
                                </Card>
                                <br />
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                        {this.state.loader ? <CircularProgress /> :
                            <div className="panel-heading"><h3>Edit Page
                                <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                            </h3>
                            </div>
                        }
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    title: this.state.editDetails.page_title,
                                    publish_name: this.state.editDetails.publish_name,
                                    homepage: this.state.editDetails.is_homepage,
                                    image: this.state.editDetails.image,
                                    favicon: this.state.editDetails.favicon,
                                    description: this.state.editDetails.description
                                }}
                                validationSchema={Yup.object().shape({
                                    title: Yup.string()
                                        .required('Template Title is required'),
                                    publish_name: Yup.string()
                                        .required('Publish Name is required'),
                                })}
                                onSubmit={async (fields, { resetForm, initialValues }) => {
                                    this.setState({ loader: true })
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
                                    fields.id = this.state.editDetails.page_id
                                    const resp = await updateHidePage(fields)
                                    if (resp.STATUS == "SUCCESS") {
                                        const template = await getTemplate(user.username)
                                        if (template.STATUS == "SUCCESS") {
                                            toast.success("Page Updated Successfully")
                                            resetForm(initialValues)
                                            this.setState({ showModal: false })
                                            this.props.createAdminPage(template.DEFAULT_TEMPLATE)
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
                                                    <img src={this.state.editDetails.image} style={{ width: "10em", height: "6em" }} />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="title">Favicon</label>
                                                    <input name="favicon" onChange={(e) => { this.setState({ favicon: e.target.files[0] }) }} type="file" className="form-control" />
                                                    <img src={this.state.editDetails.favicon} style={{ width: "10em", height: "6em" }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <Field name="description" type="textarea" className="form-control" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="homepage">
                                                <Field name="homepage" type="checkbox" className={(errors.homepage && touched.homepage ? ' is-invalid' : '')} />Is Home Page
                                            </label>
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
                <Modal isOpen={this.state.showPageMergeModal} style={customStyles}>
                    <div className="panel panel-default">
                        {this.state.loader ?
                            <Lottie options={loadDefaultOptions}
                                height={200}
                                width={200}
                                style={{ margin: "0 0 0 0" }}
                                isStopped={this.state.isStopped}
                                isPaused={this.state.isPaused} /> :
                            <div className="panel-heading"><h3>Edit Page
                                <button className="close" onClick={() => this.setState({ showPageMergeModal: false })}>&times;</button>
                            </h3>
                            </div>
                        }
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    title: this.state.editDetails.page_title,
                                    publish_name: this.state.editDetails.publish_name
                                }}
                                validationSchema={Yup.object().shape({
                                    title: Yup.string()
                                        .required('Template Title is required'),
                                    publish_name: Yup.string()
                                        .required('Publish Name is required'),
                                })}
                                onSubmit={async (fields, { resetForm, initialValues }) => {
                                    this.setState({ loader: true })
                                    fields.id = this.state.editDetails.page_id
                                    const resp = await updateHidePage(fields)
                                    if (resp.STATUS == "SUCCESS") {
                                        const template = await getTemplate(user.username)
                                        if (template.STATUS == "SUCCESS") {
                                            toast.success("Page Updated Successfully")
                                            resetForm(initialValues)
                                            this.setState({ showPageMergeModal: false })
                                            this.props.createAdminPage(template.DEFAULT_TEMPLATE)
                                        }
                                    }
                                    else {
                                        this.setState({ showPageMergeModal: false })
                                    }
                                }}
                                render={({ errors, touched, setFieldValue }) => (

                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="title">Template</label>
                                            <Field name="title" type="select" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
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
        )
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.login.data,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.fetchIdTemplate(data)),
        createAdminPage: (data) => dispatch(actions.getAdminBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
