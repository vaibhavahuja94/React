import React, { Component } from "react";
import {
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";
import {
  addPage,
  getTemplate,
  updateHidePage,
  uploadImage,
} from "../../services/apiFunction";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import * as actions from "../../redux/actions/SetTemplateActions";
import { withRouter } from "react-router-dom";

class PageModal extends Component {
  state = {
    modal: false,
    file: "",
    loader: "",
    favicon: "",
    fileSrc: this.props.editData ? this.props.editData.image : "",
    faviconSrc: this.props.editData ? this.props.editData.favicon : "",
  };

  toggle = () => {
    this.setState({
      file: "",
      fileSrc: "",
      favicon: "",
      faviconSrc: "",
    });
    this.props.toggle();
  };

  onEdit = async (fields) => {
    fields.id = this.props.editData.page_id;
    if (fields.homepage == true) {
      fields.is_homepage = "TRUE";
    } else {
      fields.is_homepage = "FALSE";
    }
    if (this.state.file) {
      const response = await uploadImage(this.state.file);
      fields.image = response.data.secure_url;
    }
    if (this.state.favicon) {
      const response = await uploadImage(this.state.favicon);
      fields.fav_icon = response.data.secure_url;
    }

    const resp = await updateHidePage(fields);
    if (resp.STATUS == "SUCCESS") {
      const template = await getTemplate(this.props.user.username);
      if (template.STATUS == "SUCCESS") {
        this.props.toggle();
        this.props.loader();
        toast.success("Page Updated Successfully");
        if (this.props.type == "DEFAULT") {
          this.props.createDefaultPage(template.DEFAULT_PAGES);
        } else {
          if (this.props.user.type == "DEFAULT") {
            this.props.createUserPage(template.USER_TEMPLATE);
          } else {
            this.props.createAdminPage(template.DEFAULT_TEMPLATE);
          }
        }
      }
    } else {
      toast.error("Something Went Wrong");
      this.props.loader();
    }
  };

  onAdd = async (fields) => {
    fields.template_id =
      this.props.type == "DEFAULT" ? "" : this.props.template_id;
    fields.code = "";
    fields.type = this.props.type == "DEFAULT" ? "DEFAULT" : "USER";
    if (fields.homepage == true) {
      fields.is_homepage = "TRUE";
    } else {
      fields.is_homepage = "FALSE";
    }
    fields.is_hidden = "FALSE"
    if (this.state.file) {
      const response = await uploadImage(this.state.file);
      fields.image = response.data.secure_url;
    }
    if (this.state.favicon) {
      const response = await uploadImage(this.state.favicon);
      fields.fav_icon = response.data.secure_url;
    }
    const resp = await addPage(fields);
    if (resp.STATUS == "SUCCESS") {
      const template = await getTemplate(this.props.user.username);
      if (template.STATUS == "SUCCESS") {
        toast.success("Page Created Successfully");
        if (this.props.type == "DEFAULT") {
          this.props.createDefaultPage(template.DEFAULT_PAGES);
        } else {
          if (this.props.user.type == "DEFAULT") {
            this.props.createUserPage(template.USER_TEMPLATE);
          } else {
            this.props.createAdminPage(template.DEFAULT_TEMPLATE);
          }
        }
        this.props.toggle();
        this.props.loader();
      }
    } else {
      toast.error("Something Went Wrong");
      this.props.loader();
    }
  };

  handleFile = (e) => {
    this.setState({
      fileSrc: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  };

  handleFavicon = (e) => {
    this.setState({
      faviconSrc: URL.createObjectURL(e.target.files[0]),
      favicon: e.target.files[0],
    });
  };

  render() {
    return (
      <MDBContainer>
        <MDBModal centered isOpen={this.props.modal} toggle={this.toggle}>
          <MDBModalHeader toggle={this.toggle}>
            {this.props.title}
          </MDBModalHeader>
          <MDBModalBody>
            <Formik
              initialValues={{
                title: this.props.editData.page_title
                  ? this.props.editData.page_title
                  : "",
                publish_name: this.props.editData.publish_name
                  ? this.props.editData.publish_name
                  : "",
                homepage: this.props.editData.is_homepage
                  ? this.props.editData.is_homepage == "TRUE"
                    ? true
                    : false
                  : "",
                image: this.props.editData.image
                  ? this.props.editData.image
                  : "",
                favicon: this.props.editData.favicon
                  ? this.props.editData.favicon
                  : "",
                description: this.props.editData.description
                  ? this.props.editData.description
                  : "",
              }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required("Template Title is required"),
                publish_name: Yup.string().required("Publish Name is required"),
                homepage: "",
              })}
              onSubmit={async (fields, { resetForm, initialValues }) => {
                this.props.loader();
                
                if(this.props.editData.is_homepage == "TRUE" && fields.homepage == false){
                  toast.error("Any of Page Should be selected as HomePage")
                  this.props.loader();
                }
                else{
                  if (this.props.Add == true) {
                    this.onAdd(fields);
                  } else {
                    this.onEdit(fields);
                  }
                }
              }}
              render={({ errors, touched, setFieldValue }) => (
                <Form>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <Field
                          name="title"
                          type="text"
                          className={
                            "form-control" +
                            (errors.title && touched.title ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="publish_name">Publish Name</label>
                        <Field
                          name="publish_name"
                          type="text"
                          className={
                            "form-control" +
                            (errors.publish_name && touched.publish_name
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="publish_name"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="title">Image Preview</label>
                        <input
                          name="image"
                          onChange={(e) => this.handleFile(e)}
                          type="file"
                          className="form-control"
                        />
                        <br />
                        {(this.props.editData.image || this.state.fileSrc) && (
                          <img
                            src={
                              this.props.editData.image
                                ? this.props.editData.image
                                : this.state.fileSrc
                            }
                            style={{ width: "10em", height: "6em" }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="form-group">
                        <label htmlFor="title">Favicon</label>
                        <input
                          name="favicon"
                          onChange={(e) => this.handleFavicon(e)}
                          type="file"
                          className="form-control"
                        />
                        <br />
                        {(this.state.faviconSrc ||
                          this.props.editData.favicon) && (
                          <img
                            src={
                              this.props.editData.favicon
                                ? this.props.editData.favicon
                                : this.state.faviconSrc
                            }
                            style={{ width: "10em", height: "6em" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <Field
                      name="description"
                      type="textarea"
                      cols="10"
                      className="form-control"
                    />
                  </div>
                  {this.props.type != "DEFAULT" && (
                    <div className="form-group">
                      <label htmlFor="homepage">
                        <Field name="homepage" type="checkbox" />
                        &nbsp; Default Home Page
                      </label>
                    </div>
                  )}
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary">
                      {this.props.title}
                    </button>
                    &nbsp;
                    <button
                      type="reset"
                      onClick={() => this.setState({ file: "" })}
                      className="btn btn-secondary"
                    >
                      Reset
                    </button>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createDefaultPage: (data) => dispatch(actions.setDefaultPages(data)),
    createUserPage: (data) => dispatch(actions.setUserTemplate(data)),
    createAdminPage: (data) => dispatch(actions.setAdminTemplate(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PageModal));
