import React, { Component } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import '../../asset/Template.css'
import {Card, CardContent, Tooltip} from '@material-ui/core';
import '../../asset/Template.css'
import { getTemplate, mergePage } from '../../services/apiFunction';

class DefaultPageModal extends Component {

    state = {
        loader: false,
        radioValue: '',
        valueError: '',
    }


    handleSubmit = async (event) => {
        let value = this.state.radioValue
        const type = this.props.user.type
        if (value != "") {
            let obj = {}
            obj.template_id = this.props.templateData.id
            obj.page_id = value
            const response = await mergePage(obj)
            toast.success(response.MESSAGE)
            this.setState({ showPageModal: false })
            const template = await getTemplate(this.props.user.username)
            if (template.STATUS == "SUCCESS") {
                if (type != "DEFAULT") {
                    this.props.createPage(template.USER_TEMPLATE)
                    window.location.reload()
                }
                else {
                    this.props.createAdminPage(template.DEFAULT_TEMPLATE)
                    window.location.reload()
                }
            }
        }
        else {
            toast.error("No Page is Selected")
        }
    }

    render() {
        const { defaultPages } = this.props
        return (
            <>
                <MDBContainer>
                    <MDBModal size="lg" centered isOpen={this.props.modal} toggle={this.props.toggle}>
                        <MDBModalHeader toggle={this.props.toggle}>{this.props.title}</MDBModalHeader>
                        <MDBModalBody>
                            <div>
                            <div className="row">
                            {defaultPages.length > 0 && defaultPages.map(value =>
                                <>
                                    <div className="col-sm-4">
                                        <div>
                                            <label>
                                                <input type="radio" value={value.page_id} name="page" className="card-input-element" onChange={(e) => { this.setState({ radioValue: e.target.value }) }} />
                                                <Card className="card-input">
                                                    <img src={value.image ? value.image : "https://res.cloudinary.com/w3bizz-com/image/upload/c_scale,w_425/v1632246930/2_hjs08o.png"} style={{ height: "15em", width: "100%" }} />
                                                    <CardContent>
                                                        <span>
                                                            <h4 style={{ display: "inline" }}>{value.page_title}</h4>
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </label>
                                        </div>
                                        <br />
                                    </div>
                                </>
                            )}
                            </div>
                            </div>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <button className="btn btn-info" style={{ float: "right" }} onClick={(event) => { this.handleSubmit(event) }}>Submit</button>
                        </MDBModalFooter>
                    </MDBModal>

                </MDBContainer>
            </>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.login.data,
        defaultPages: state.getBlogById && state.getBlogById.defaultPages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createPage: (data) => dispatch(actions.getBlogIdSuccess(data)),
        createAdminPage: (data) => dispatch(actions.getAdminBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPageModal)