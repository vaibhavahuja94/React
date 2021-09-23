import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { uploadImage } from '../../Services/apiFunction';


class ModalPage extends Component {
    state = {
        file: this.props.editData ? this.props.editData.image : " ",
        modal: this.props.createModal,
        loader:false,
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onAddSubmit = (e , fields, user, resetForm, initialValues) => {
        this.setState({ loader: true })
        if (file) {
            const response = await uploadImage(file)
            fields.image = response.data.secure_url
        }
        fields.username = user.username
        fields.category = "new category"
        fields.tags = "new tags"
        fields.type = type == USER ? "USER" : "DEFAULT"
        const resp = await addTemplate(fields)
        if (resp) {
            resetForm(initialValues)
            this.props.toast.success("Template Created Successfully")
            let obj = {}
            obj.title = "Home Page"
            obj.publish_name = "New Template"
            obj.template_id = resp.TEMPLATE_ID
            obj.code = "new title"
            obj.is_homepage = "TRUE"
            await addPage(obj)
            const tempData1 = await getTemplate(user.username)
            if (tempData1.STATUS == "SUCCESS") {
                this.setState({ showModal: false })
                this.setState({ loader: false })
                this.props.createBlog(tempData1.USER_TEMPLATE)
            }
        }
        else {
            this.setState({ loader: false })
            this.props.toast.success(resp.data.message)
        }
    }
    render() {
        const { file } = this.state
        const { type } = this.props
        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>{this.props.title}</MDBModalHeader>
                    <MDBModalBody>
                        <Formik
                            initialValues={{
                                title: this.props.editData ? this.props.editData.title : "",
                            }}
                            validationSchema={Yup.object().shape({
                                title: Yup.string()
                                    .required('Template Title is required'),
                            })}
                            onSubmit={async (e,fields, { resetForm, initialValues }) => {
                                this.props.onSubmitAdd == "true" ? this.onAddSubmit(e, fields, this.props.user, resetForm, initialValues): this.onEditSubmit(e ,fields, this.props.user, resetForm, initialValues)
                            }}
                            render={({ errors, touched, setFieldValue }) => (
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="title">Title</label>
                                        <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="f
                                    
                                    
                                    orm-group">
                                        <label htmlFor="title">Images</label>
                                        <input name="image" onChange={(e) => { this.setState({ file: e.target.files[0] }) }} type="file" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">Create Template</button>
                                        &nbsp;
                                        <button type="reset" onClick={() => this.setState({ file: '' })} className="btn btn-secondary">Reset</button>
                                    </div>
                                </Form>
                            )}
                        />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                        <MDBBtn color="primary" >Save changes</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>
        );
    }
}

export default ModalPage;
