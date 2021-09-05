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
import { updateHidePage } from '../../Services/apiFunction';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ShowBlogById extends Component {

    state = {
        showModal: false,
        id: '',
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
                                            <Tooltip title="Preview of Page"><SlideshowIcon onClick={(e)=>{this.preView(e, value.preview_link)}}/></Tooltip>
                                                <Tooltip title="Edit Page"><EditIcon onClick={(event) => this.handleView(event, value)} /></Tooltip>
                                                <span
                                                style={{color:"#1DABB8"}}
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
                        </div>
                    )}
                </div>
                {/* {this.state.id!==''&&
            <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default ">
                    <div className="panel-heading">Change Profile
                    <button className="close" onClick={()=>this.setState({showModal:false})}>&times;</button>
                    
                    </div>
                    <div className="panel panel-body">
                    <div className="col-sm-4">
                    <img src={this.state.img} alt="profile" className="img-responsive photo2" />
                    </div>
                    <div className="col-sm-8 container">
                        <div className="panel panel-default ">
                            <div className="panel-heading">
                                {this.state.name}
                            </div>
                            <div className="panel-body">
                                {comment.filter(val=>(val.blog_id===this.state.id)).map(values=>
                                <div className="div1">
                                    <div style={{fontWeight:'bold'}}>{values.user_name}</div>
                                    <div>{values.comment}</div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="panel panel-footer">
            <Formik
                initialValues={{
                    
                    comment:''
                }}
                validationSchema={Yup.object().shape({
                   comment:Yup.string().required('Please Enter Comment ')
                })}
                onSubmit={(fields,{resetForm,initialValues}) => {
                    fields.blog_id = this.state.id
                    fields.user_name = user.name
                    this.props.createComment(fields)
                    resetForm(initialValues)
                    this.componentDidMount()
                    this.setState({showModal:false})
                }}
                render={({ errors, touched}) => (
                    
                    <Form>
                        <div className="form-group">
                            <Field as="textarea" name="comment"
                            className={'form-control' + (errors.comment && touched.comment ? ' is-invalid' : '')} />
                            <ErrorMessage name="comment" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" 
                            className="btn btn-primary"
                            >Comment</button>
                        </div>
                    </Form>
                )}
            />
            </div>
            </div>
            </Modal>
            } */}
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
