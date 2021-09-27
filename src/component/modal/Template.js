import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { addPage, addTemplate, getTemplate, updateTemplate, uploadImage } from '../../services/apiFunction';
import { connect } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import * as actions from '../../redux/actions/GetBlogByIdActions'
import { withRouter } from 'react-router-dom'

class ModalPage extends Component {
    state = {
        modal: false,
        file: '',
        loader: '',
        fileSrc: this.props.data ? this.props.data.image : ''
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            file: '',
            fileSrc:''
        });
    }

    onAdd = async (fields) => {
        this.props.loader()
        if (this.state.file) {
            const response = await uploadImage(this.state.file)
            fields.image = response.data.secure_url
        }
        fields.username = this.props.user.username
        fields.category = "new category"
        fields.tags = "new tags"
        fields.type = this.props.type == "DEFAULT" ? "DEFAULT" : "USER"
        const resp = await addTemplate(fields)
        if (resp) {
            toast.success("Template Created Successfully")
            let obj = {}
            obj.title = "Home Page"
            obj.publish_name = "New Template"
            obj.template_id = resp.TEMPLATE_ID
            obj.is_homepage = "TRUE"
            obj.code = "new title"
            await addPage(obj)
            const tempData1 = await getTemplate(this.props.user.username)
            if (tempData1.STATUS == "SUCCESS") {
                this.setState({ file: '', fileSrc: '' })
                this.props.loader()
                this.props.toggle()
                if (this.props.type == "DEFAULT") {
                    this.props.createAdminTemplate(tempData1.DEFAULT_TEMPLATE)
                }
                else {
                    this.props.createBlog(tempData1.USER_TEMPLATE)
                }
            }
        }
        else {
            this.props.loader()
            toast.success(resp.data.message)
        }
    }

    onEdit = async (fields) => {
        this.props.loader()
        if (this.state.file) {
            const response = await uploadImage(this.state.file)
            fields.image = response.data.secure_url
        }
        fields.username = this.props.user.username
        fields.id = this.props.data.id
        const resp = await updateTemplate(fields)
        if (resp) {
            toast.success("Template Updated Successfully")
            this.setState({ loader: false })
            let blog = this.props.type == "DEFAULT" ? this.props.adminBlog : this.props.blog
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
            this.props.toggle()
            this.props.loader()
            this.setState({ file: '', fileSrc: '' })
            if (this.props.type == "DEFAULT") {
                this.props.createAdminTemplate(list)

            }
            else {
                this.props.createBlog(list)
            }
        }
        else {
            this.props.loader()
            toast.success(resp.data.message)
        }
    }

    handleFile = (e) => {
        this.setState({
            fileSrc: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }

    render() {
        console.log(this.props.data)
        return (
            <MDBContainer>
                <MDBModal centered isOpen={this.props.modal} toggle={this.props.toggle}>
                    <MDBModalHeader toggle={this.props.toggle}>{this.props.title}</MDBModalHeader>
                    <MDBModalBody>
                        <Formik
                            initialValues={{
                                title: this.props.data.title ? this.props.data.title : '',
                            }}
                            validationSchema={Yup.object().shape({
                                title: Yup.string()
                                    .required('Template Title is required'),
                            })}
                            onSubmit={async (fields, { resetForm, initialValues }) => {
                                resetForm(initialValues)
                                if (this.props.Add == true) {
                                    this.onAdd(fields)
                                } else {
                                    this.onEdit(fields)
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
                                        <input name="image" onChange={(e) => this.handleFile(e)} type="file" className="form-control" />
                                        <br />
                                        {(this.state.fileSrc || this.props.data.image) &&
                                            <img src={this.props.data.image ? this.props.data.image : this.state.fileSrc} style={{ width: "10em", height: "6em", marginTop: "10px" }} />
                                        }
                                    </div>
                                    <br />
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">{this.props.title}</button>
                                        &nbsp;
                                        <button type="reset" onClick={() => this.fileInput.value = ""} className="btn btn-secondary">Reset</button>
                                    </div>
                                </Form>
                            )}
                        />
                    </MDBModalBody>
                </MDBModal>
            </MDBContainer>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.login.data,
        blog: state.getBlogById.allBlog,
        adminBlog: state.getBlogById.allAdminBlog,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.fetchIdTemplate(data)),
        createBlog: (data) => dispatch(actions.getBlogIdSuccess(data)),
        createAdminTemplate: (data) => dispatch(actions.getAdminBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ModalPage));
