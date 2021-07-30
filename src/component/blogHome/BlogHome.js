import React, { Component } from 'react';
import BlogNavBar from '../BlogNavBar';
import Modal from 'react-modal'
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {createBlog} from '../../redux/actions/GetBlogByIdActions'
import ShowBlogById from './ShowBlogById';
import moment from "moment"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../AdminLayout'

class BlogHome extends Component {
    state={
        showModal:false,
        user:JSON.parse(localStorage.getItem('user'))
    }
   
    render() {
        const customStyles = {
            content : {
              top                   : '40%',
              left                  : '50%',
              right                 : '50%',
              bottom                : 'auto',
              marginRight           : '-50%',
              transform             : 'translate(-50%, -50%)'
            }
          };
           Modal.setAppElement('*')
          const {user} = this.props;
          
        return (
            <>
                <AdminLayout />
                <div id="bloghome">
                <button className="btn btn-primary" onClick={()=>this.setState({showModal:true})}>Create Template</button>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="myblogbody">
                    <ShowBlogById />
                </div>

                <ToastContainer />
            <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                    <div className="panel-heading"><h3>CREATE BLOG
                    <button className="close" onClick={()=>this.setState({showModal:false})}>&times;</button>
                    </h3>
                    </div>
                    <div className="panel panel-body">
            <Formik
                initialValues={{
                    blogTitle: '',
                    desc: '',
                    blogImgSrc:''
                }}
                validationSchema={Yup.object().shape({
                    blogTitle: Yup.string()
                        .required('Blog Title is required'),
                    desc: Yup.string()
                        .required('Description is required'),
                    blogImgSrc:Yup.string().required('Please Select Image')
                })}
                onSubmit={(fields,{resetForm,initialValues}) => {
                    let date = (moment().format('DD-MM-YYYY'))
                    fields.user_id = user.id
                    fields.date = date
                    fields.created_by = user.name 
                   
                    this.props.createBlog(fields)
                    resetForm(initialValues)
                    this.fileInput.value=""
                    this.setState({showModal:false})
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }}
                render={({ errors, touched ,setFieldValue }) => (
                    
                    <Form>
                        <div className="form-group">
                            <label htmlFor="blogTitle">BlogTitle</label>
                            <Field name="blogTitle" type="text" className={'form-control' + (errors.blogTitle && touched.blogTitle ? ' is-invalid' : '')} />
                            <ErrorMessage name="blogTitle" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="desc">Description</label>
                            <Field name="desc" as="textarea" className={'form-control' + (errors.desc && touched.desc ? ' is-invalid' : '')} />
                            <ErrorMessage name="desc" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Blog Profile-Image</label>
                            <input name="blogImgSrc" type="file" accept="image/*" 
                            onChange={(event)=>{ 
                                if (event.target.files && event.target.files[0]) {
                                    let reader = new FileReader(event.target.files[0]);
                                    reader.onloadend = () => {
                                        setFieldValue('blogImgSrc',reader.result)
                                      }
                                    reader.readAsDataURL(event.target.files[0]);

                              }
                              else{setFieldValue('blogImgSrc','')}
                            }
                        }
                            ref={ref=> this.fileInput = ref}
                            className={'form-control' + (errors.blogImgSrc && touched.blogImgSrc ? ' is-invalid' : '')} />
                            <ErrorMessage name="blogImgSrc" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" 
                            className="btn btn-primary"
                            >Create Blog</button>
                            &nbsp;
                            <button type="reset" onClick={()=>this.fileInput.value=""} className="btn btn-secondary">Reset</button>
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
    user:state.login && state.login.data
    }
  }

const mapDispatchToProps = dispatch => {
  return{
    createBlog:(data)=>dispatch(createBlog(data))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BlogHome);
