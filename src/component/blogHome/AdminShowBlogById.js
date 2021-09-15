import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import Modal from 'react-modal'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Button, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom'
import { getTemplate, mergeTemplate, publishTemplate, updateHide, updateTemplate, uploadImage } from '../../Services/apiFunction';
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Tooltip from '@material-ui/core/Tooltip';
import { CircularProgress } from '@material-ui/core';
import Lottie from 'react-lottie';
import { visiblityOptions, copyDefaultOptions, editDefaultOptions, menuDefaultOptions, loadDefaultOptions } from './LottieIcon'


class ShowBlogById extends Component {
    _lottieHeartRef;
    state = {
        lottieRef:React.createRef(null),
        user: this.props.user,
        template: false,
        editDetails: {},
        file: "",
        showModal: "",
        isStopped: true,
        isPaused: true
    }
    
    handleClickToPause = () => {
        this.state.lottieRef?.current?.handleClickToPause?.();
    }
    handleView(event, value) {
        this.props.history.push({ pathname: 'webTemplate', state: { template: value, type: "DEFAULT" } })
    }

    publishTemplateFunc = async (e, value) => {
        let obj = {}
        obj.username = value.username
        obj.template_id = value.id
        const response = await publishTemplate(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success("Template Published Successfully")
        }
        else {
            toast.error("Template Not Published")
        }
    }

    handleMergeTemplate = async (event, value) => {
        let obj = {}
        obj.username = this.state.user.username
        obj.id = value.id
        const response = await mergeTemplate(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success(response.MESSAGE)
        } else {
            toast.error(response.MESSAGE)
        }
    }

    handleHide = async (value) => {
        let obj = {}
        obj.username = value.username
        obj.id = value.id
        obj.is_hidden = (value.is_hidden === "FALSE" ? "TRUE" : "FALSE")
        const response = await updateHide(obj)
        if (response.STATUS == "SUCCESS") {
            let blog = this.props.blog
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
            this.props.fetchIdBlog(list)
        }
    }

    handleEdit(e, value) {
        this.setState({ showModal: true })
        this.setState({ editDetails: value })
        e.preventDefault()
    }

    render() {

        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }
        const { blogStatus, comment, isWebPage } = this.props
        const { user, file, lottieRef } = this.state
        const customStyles = {
            content: {
                top: '40%',
                left: '40%',
                right: '56%',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };

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
                        {this.props.blog.length > 0 && this.props.blog.map(value =>
                            <>
                                <div className="col-sm-4 col-xs-4">
                                    <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                        <img src={value.image ? value.image : "/template.jpg"} style={{ height: "15em", width: "100%" }} />
                                        <CardContent>
                                            <h4 style={{ display: "inline" }}>{value.title}</h4>
                                            <br />
                                            <div style={{ display: "flex" }}>
                                                <Tooltip title="Use Now">
                                                    <span onClick={(e) => { this.handleMergeTemplate(e, value) }}
                                                    onMouseEnter={this.handleClickToPause}
                                                    onMouseLeave={this.handleClickToPause}
                                                    >
                                                        <Lottie options={copyDefaultOptions}
                                                            height={30}
                                                            width={30}
                                                            style={{ margin: "0 0 0 0" }}
                                                            isClickToPauseDisabled
                                                            ref={lottieRef}
                                                            isStopped={this.state.isStopped}
                                                            isPaused={this.state.isPaused} />
                                                    </span>
                                                </Tooltip>
                                                <div style={{ float: "right", display: "flex" }}>
                                                    <span 
                                                    onMouseEnter={this.handleClickToPause}
                                                    onMouseLeave={this.handleClickToPause}
                                                    style={{ color: "#1DABB8" }} onClick={(event) => this.handleView(event, value)}>
                                                        <Tooltip title="View Pages">
                                                            <span>
                                                                <Lottie options={menuDefaultOptions}
                                                                    height={30}
                                                                    width={30}
                                                                    isClickToPauseDisabled
                                                                    ref={lottieRef}
                                                                    style={{ margin: "0 0 0 0" }}
                                                                    isStopped={this.state.isStopped}
                                                                    isPaused={this.state.isPaused} />
                                                            </span>
                                                        </Tooltip>
                                                    </span>
                                                    {user.type == "ADMIN" &&
                                                        <>
                                                            <span
                                                                onClick={() => {
                                                                    this.handleHide(value);
                                                                }}>
                                                                {' '}
                                                                {value.is_hidden == "FALSE" ? <Tooltip title="Hide"><VisibilityOffIcon /></Tooltip> : <Tooltip title="Show"><VisibilityIcon /></Tooltip>}
                                                            </span>
                                                            <span onClick={(e) => { this.handleEdit(e, value) }} style={{ color: "#1DABB8" }}>
                                                                <Tooltip title="Edit Template">
                                                                    <span
                                                                    onMouseEnter={this.handleClickToPause}
                                                                    onMouseLeave={this.handleClickToPause}                
                                                                    >
                                                                        <Lottie options={editDefaultOptions}
                                                                            height={30}
                                                                            width={30}
                                                                            isClickToPauseDisabled
                                                                            ref={lottieRef}
                                                                            isStopped={this.state.isStopped}
                                                                            isPaused={this.state.isPaused} />
                                                                    </span>
                                                                </Tooltip>
                                                            </span>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <br />
                                </div>
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
                                                    title: this.state.editDetails.title,
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
                                                    fields.id = this.state.editDetails.id
                                                    const resp = await updateTemplate(fields)
                                                    if (resp) {
                                                        toast.success("Template Updated Successfully")
                                                        this.setState({ showModal: false })
                                                        this.setState({ loader: false })
                                                        let blog = this.props.blog
                                                        var list = []
                                                        blog.forEach((el) => {
                                                            if (el.id == fields.id) {
                                                                el.title = fields.title
                                                                el.image = fields.image
                                                                list.push(el)
                                                            }
                                                            else {
                                                                list.push(el)
                                                            }
                                                        })
                                                        resetForm(initialValues)
                                                        this.setState({ file: '' })
                                                        this.props.fetchIdBlog(list)
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
                                                            <img src={this.state.editDetails.image} style={{ width: "10em", height: "6em" }} />
                                                        </div>
                                                        <div className="form-group">
                                                            <button type="submit" className="btn btn-primary">Edit Page Template</button>
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
                        )}
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login.data,
        blog: state.getBlogById.allAdminBlog,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.getAdminBlogIdSuccess(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
