import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaPlusCircle } from "react-icons/fa";
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
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router';
import AdminLayout from '../AdminLayout';



class ShowBlogById extends Component {

    state = {
        user: this.props.user,
        showModal: false,
        id: '',
        img: '',
        name: '',
        template: false,
        string: "",
        blog:[]
    }
    componentDidMount() {
        if(this.props.location){
            console.log(this.props.location.state)
        }
        //this.props.fetchIdBlog()
    }

    handleView() {
        window.open('http://localhost:8080', 'blank')
    }

    render() {

        if (this.state.template) {
            window.open('http://localhost:8080')
        }
        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }
        const { blogStatus, comment, isWebPage } = this.props
        const { user } = this.state
        console.log(isWebPage)
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
                <AdminLayout />
                <div style={{ marginLeft: "17%", marginTop:"4%" }} className="justify-content-center">
                    {this.state.blog.length > 0 &&
                        this.props.blog.map(value =>
                            <div className="row">
                                <div className="col-sm-offset-2 col-sm-2 col-xs-offset-2 col-xs-2">
                                    <Card className={classes.root} variant="outlined">
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                Title:{value.blogTitle}
                                            </Typography>
                                            <br />
                                            <Typography variant="h5" component="h2">
                                                Description:{value.desc}
                                            </Typography>
                                            <br />
                                        </CardContent>
                                    </Card>
                                    <br />
                                </div>
                            </div>
                        )}
                    {this.state.blog.length == 0 &&
                        <div className="row">
                            <div className="col-sm-offset-2 col-sm-3 col-xs-offset-3 col-xs-3">
                                <Card className={classes.root} variant="outlined">
                                    <CardContent>
                                        <br />
                                        <span style={{display: "flex", justifyContent: "center"}}><FaPlusCircle size={70}/></span>
                                        <br />
                                    </CardContent>
                                    <br />
                                </Card>
                            </div>
                        </div>
                    }
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
        fetchIdPage: () => dispatch(actions.fetchIdTemplate()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowBlogById);
