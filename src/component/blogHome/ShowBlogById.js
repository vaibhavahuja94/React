import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import Modal from 'react-modal'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol } from 'mdbreact';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { Link, withRouter } from 'react-router-dom'
import { Redirect } from 'react-router';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Tooltip from '@material-ui/core/Tooltip';
import { updateHide, updateHidePage, updateTemplate } from '../../Services/apiFunction';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import {CircularProgress} from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ShowBlogById extends Component {

    state = {
        user: this.props.user,
        showModal: false,
        id: '',
        img: '',
        name: '',
        template: false,
        string: "",
        editDetails: {},
    }
    handleView(event, value) {
        this.props.history.push({ pathname: 'webTemplate', state: { template: value, type: "USER" } })
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
            
            this.props.createBlog(list)
        }
    }


    handleEdit(e, value) {
        this.setState({ editDetails: value })
        this.setState({ showModal: true })
        e.preventDefault()
    }
    render() {
        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }
        const { blogStatus, comment, isWebPage } = this.props
        const { user } = this.state
        const customStyles = {
            content: {
                top: '40%',
                left: '40%',
                right: '56%',
                bottom: 'auto',
                marginRight:'-50%',
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
                <div className="justify-content-center">
                    {this.props.blog.length > 0 && this.props.blog.map(value =>
                        <div className="row">
                            <div className="col-sm-offset-2 col-sm-9 col-xs-offset-2 col-xs-9">
                                <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                    <CardContent>
                                        <span >
                                            <h4 style={{ display: "inline" }}>{value.title}</h4>
                                            <span style={{ display: "inline", float: "right" }}>
                                                <span style={{ color: "#1DABB8" }} onClick={(event) => this.handleView(event, value)}>{''}{<Tooltip title="View Pages"><ArrowForwardIosIcon /></Tooltip>}</span>
                                                <span
                                                    style={{ color: "#1DABB8" }}
                                                    onClick={() => {
                                                        this.handleHide(value);
                                                    }}>
                                                    {' '}
                                                    {value.is_hidden == "FALSE" ? <Tooltip title="Hide"><VisibilityOffIcon /></Tooltip> : <Tooltip title="Show"><VisibilityIcon /></Tooltip>}
                                                </span>
                                                <span style={{ color: "#1DABB8" }} onClick={(e)=>{this.handleEdit(e,value)}}>{''}{<Tooltip title="Edit Template"><EditAttributesIcon /></Tooltip>}</span>
                                            </span>
                                        </span>
                                    </CardContent>
                                </Card>
                                <br />
                            </div>
                        </div>
                    )}
                </div>

                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><h3>Create Template
                            {this.state.loader ?
                                <CircularProgress /> :
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
                                    fields.username = user.username
                                    fields.id = this.state.editDetails.id
                                    const resp = await updateTemplate(fields)
                                    if (resp) {
                                        resetForm(initialValues)
                                        toast.success("Template Updated Successfully")
                                        this.setState({ showModal: false })
                                        this.setState({ loader: false })
                                        let blog = this.props.blog
                                        var list = []
                                        blog.forEach((el) => {
                                            if (el.id == fields.id) {
                                                el.title = fields.title
                                                list.push(el)
                                            }
                                            else {
                                                list.push(el)
                                            }
                                        })
                                        this.setState({file:''})
                                    this.props.createBlog(list)
                                }
                                    else{
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
                                        <button type="submit" className="btn btn-info">Edit Template</button>
                                        &nbsp;
                                        <button type="reset" className="btn btn-secondary">Reset</button>
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
        blog: state.getBlogById.allBlog,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.fetchIdTemplate(data)),
        createBlog: (data) => dispatch(actions.getBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
