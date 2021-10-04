import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { addPage, addTemplate, getTemplate, updateTemplate, uploadImage } from '../../services/apiFunction';
import { connect } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import * as actions from '../../redux/actions/SetTemplateActions'
import { withRouter } from 'react-router-dom'

class TemplateModal extends Component {
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
        fields.is_hidden = "FALSE"
        fields.type = this.props.type == "DEFAULT" ? "DEFAULT" : "USER"
        const resp = await addTemplate(fields)
        if (resp.STATUS == "SUCCESS") {
            toast.success("Template Created Successfully")
            let obj = {}
            obj.title = "Home Page"
            obj.publish_name = "New Template"
            obj.template_id = resp.TEMPLATE_ID
            obj.is_homepage = "TRUE"
            obj.is_hidden = "FALSE"
            obj.type = "USER"
            obj.code = ""
            await addPage(obj)
            const tempData1 = await getTemplate(this.props.user.username)
            if (tempData1.STATUS == "SUCCESS") {
                this.setState({ file: '', fileSrc: '' })
                this.props.toggle()
                this.props.loader()
                if (this.props.type == "DEFAULT") {
                    this.props.createAdminTemplate(tempData1.DEFAULT_TEMPLATE)
                }
                else {
                    this.props.createUserTemplate(tempData1.USER_TEMPLATE)
                }
            }
        }
        else {
            this.props.loader()
            toast.error(resp.data.message)
        }
    }

    onEdit = async (fields) => {
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
            let template = this.props.user.type == "ADMIN" ? this.props.adminTemplate : this.props.userTemplate
            var list = []
            template.forEach((el) => {
                if (el.id == fields.id) {
                    el.title = fields.title
                    list.push(el)
                }
                else {
                    list.push(el)
                }
            })
            this.props.toggle()
            this.setState({ file: '', fileSrc: '' })
            if (this.props.user.type == "ADMIN") {
                this.props.createAdminTemplate(list)
            }
            else {
                this.props.createUserTemplate(list)
            }
        }
        else {
            toast.error(resp.data.message)
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
                                        <button type="reset" onClick={() => this.setState({file:""})} className="btn btn-secondary">Reset</button>
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
        userTemplate: state.template.userTemplate,
        adminTemplate: state.template.adminTemplate,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createUserTemplate: (data) => dispatch(actions.setUserTemplate(data)),
        createAdminTemplate: (data) => dispatch(actions.setAdminTemplate(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TemplateModal));
