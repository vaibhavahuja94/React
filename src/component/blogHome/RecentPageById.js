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
import { updateHidePage, getTemplate } from '../../Services/apiFunction';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import {CircularProgress} from '@material-ui/core'

class ShowBlogById extends Component {

    state = {
        showModal: false,
        id: '',
        editDetails:{},
        img: '',
        name: '',
        template: false,
        string: ""
    }

    handleView(event, value) {
        window.open(`https://w3bizz.com/test/editor?${value.page_id}`)
    }

    handleHide = async(value) => {
        let obj = {}
        obj.id = value.page_id
        obj.is_hidden = (value.is_hidden === "FALSE"?"TRUE":"FALSE")
        const response = await updateHidePage(obj)
        if(response.STATUS == "SUCCESS"){
         let blog = this.props.blogData
         var list = []
         blog.forEach((el)=>{
             if(el.id == value.id){
                 el.is_hidden = obj.is_hidden
                 list.push(el)
             }
             else{
                 list.push(el)
             }
         })
         this.setState({blogdata:list})
        }
    }

    handleEdit = (e, value) => {
        this.setState({showModal:true})
        this.setState({editDetails:value})
        e.preventDefault()
    }

    preView = async(e, link) => {
        if(link != ''){
            window.open(link, "_blank")
        }
        else{
            toast.error("No Preview is Present")
        }
    }

    render() {
        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }
        const { blogStatus, comment, isWebPage, user } = this.props
        const customStyles = {
            content: {
                top: '50%',
                left: '30%',
                right: '26%',
                bottom: 'auto',
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
                    {this.props.blogData.length > 0 && this.props.blogData.map(value =>
                        <div className="row">
                            <div className="col-sm-offset-2 col-sm-9 col-xs-offset-2 col-xs-9">
                                <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                    <CardContent>
                                        <span >
                                            <h4 style={{ display: "inline" }}>{value.page_title}</h4>
                                            <span style={{ display: "inline" , float: "right" }}>
                                            <Tooltip title="Preview of Page"><SlideshowIcon style={{color:"#1DABB8"}} onClick={(e)=>{this.preView(e, value.preview_link)}}/></Tooltip>
                                                <Tooltip title="Edit Page"><EditIcon style={{color:"#1DABB8"}} onClick={(event) => this.handleView(event, value)} /></Tooltip>
                                                <span
                                                style={{color:"#1DABB8"}}
                                                    onClick={() => {
                                                        this.handleHide(value);
                                                    }}>
                                                    {' '}
                                                        {value.is_hidden == "FALSE" ? <Tooltip title="Hide"><VisibilityOffIcon /></Tooltip> : <Tooltip title="Show"><VisibilityIcon /></Tooltip>}
                                                </span>
                                                <Tooltip title="Edit Page Details"><EditAttributesIcon style={{color:"#1DABB8"}} onClick={(event) => this.handleEdit(event, value)} /></Tooltip>
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
                                    if(resp.STATUS == "SUCCESS"){
                                    const template = await getTemplate(user.username)
                                    if (template.STATUS == "SUCCESS") {
                                        toast.success("Page Updated Successfully")
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
        createPage: (data) => dispatch(actions.getBlogIdSuccess(data)),
        fetchIdBlog: (data) => dispatch(actions.fetchIdTemplate(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
