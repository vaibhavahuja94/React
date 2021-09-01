import React, { Component } from 'react';
import BlogNavBar from '../BlogNavBar';
import Modal from 'react-modal'
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {createTemplate} from '../../redux/actions/GetBlogByIdActions'
import ShowBlogById from './ShowBlogById';
import moment from "moment"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../AdminLayout'

class BlogHome extends Component {
    state={
        showModal:false,
        string:window.location.pathname.split("/")[1],
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
          const string = window.location.pathname.split("/")[1]
          const isWebPage = string.includes("Web")
        return (
            <>
                <AdminLayout isWebPage={isWebPage}/>
                <div id="bloghome">
                <button className="btn btn-primary" onClick={()=>this.setState({showModal:true})}>Create Web Template</button>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="myblogbody">
                    <ShowBlogById isWebPage={isWebPage}/>
                </div>

                <ToastContainer />
            <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                    <div className="panel-heading"><h3>Create Web Template
                    <button className="close" onClick={()=>this.setState({showModal:false})}>&times;</button>
                    </h3>
                    </div>
                    <div className="panel panel-body">
            <Formik
                initialValues={{
                    title: '',
                    publish_name: '',
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                        .required('Title is required'),
                })}
                onSubmit={(fields,{resetForm,initialValues}) => {
                    fields.username = user.username
                    fields.id = Math.floor(Math.random()*1000000)
                    fields.category = "new category"
                    fields.tags = "new tags" 
                    this.props.createBlog(fields)
                    resetForm(initialValues)
                    this.setState({showModal:false})
                    setTimeout(() => {
                        window.location.reload()
                    }, 500);
                }}
                render={({ errors, touched ,setFieldValue }) => (
                    
                    <Form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <Field name="category" type="text" className={'form-control' + (errors.category && touched.category ? ' is-invalid' : '')} />
                            <ErrorMessage name="category" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tags">Category</label>
                            <Field name="tags" type="text" className={'form-control' + (errors.tags && touched.tags ? ' is-invalid' : '')} />
                            <ErrorMessage name="tags" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" 
                            className="btn btn-primary"
                            >Create Web Template</button>
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
    createBlog:(data)=>dispatch(createTemplate(data))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BlogHome);
