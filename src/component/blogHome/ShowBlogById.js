import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import Modal from 'react-modal'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { Link, withRouter } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import { addSlots, getSlots, mergeTemplate, publishTemplate, updateHide, updateHidePage, updateSlots, updateTemplate, uploadImage } from '../../Services/apiFunction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadDefaultOptions } from './LottieIcon'
import Lottie from 'react-lottie';
import LottieIcon from './LottieIco';
import animationDataCopy from './copy.json'
import editAnimationData from './edit.json'
import Visiblity from './visibility-V3.json'
import MenuIcon from './menuV2.json'
import loadingAnimationData from './loadingV2.json'
import EdiText from 'react-editext'
import EditIcon from '@material-ui/icons/Edit';
import './BlogHome.css'
import StripeApp from '../payment/StripeApp';

class ShowBlogById extends Component {

    state = {
        user: this.props.user,
        showModal: false,
        id: '',
        img: '',
        name: '',
        stripe:'',
        file: '',
        template: false,
        string: "",
        showModalPayDetails: false,
        showModalSlotsDetail: false,
        editDetails: {},
        slotDetails: [],
        templateID: '',
    }

    AddSlotsModal = async (e, value) => {
        e.preventDefault()
        debugger
        this.setState({ showModalPayDetails: true })
        this.setState({ showModalSlotsDetail: false })
    }

    handleView(event, value) {
        this.props.history.push({ pathname: 'webTemplate', state: { template: value, type: "USER" } })
    }

    publishTemplate = async () => {
        let obj = {}
        obj.username = this.state.user.username
        obj.template_id = this.state.templateID
        const response = await publishTemplate(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success("Template Published Successfully")
        }
        else {
            toast.error("Template Not Published")
        }
    }

    AddPay = async (e) => {
        e.preventDefault()
        this.setState({stripe:true})
        this.setState({showModalPayDetails:false})
    }
    
    publishTemplateFunc = async (e, value) => {
        this.setState({ templateID: value.id })
        let response = await getSlots(this.props.user.username)
        if (response.STATUS) {
            this.setState({ slotDetails: response.DATA })
        }
        this.setState({ showModalSlotsDetail: true })
    }
    
    onSave = async (val) => {
        if (val != '') {
            let obj = {}
            obj.username = this.state.user.username
            obj.publish_name = val
            const response = await addSlots(obj)
            if (response.STATUS) {

            }
        }
    }

    onUpdate = async (val) => {
        debugger
        if (val != '') {
            let obj = {}
            obj.username = this.state.user.username
            obj.publish_name = val
            const response = await updateSlots(obj)
            if (response.STATUS) {
                this.setState({ slotDetails: [...this.state.slotDetails, obj] })
            }
        }
    }

    handleHide = async (value) => {
        let obj = {}
        obj.username = value.username
        obj.id = value.id
        obj.is_hidden = (value.is_hidden === "FALSE" ? "TRUE" : "FALSE")
        const response = await updateHide(obj)
        if (response.STATUS == "SUCCESS") {
            let blog = this.props.blog
            var list = []
            blog.forEach((el) => {
                if (el.id == value.id) {
                    el.is_hidden = obj.is_hidden
                    list.push(el)
                }
                else {
                    list.push(el)
                }
            })

            this.props.createBlog(list)
        }
    }

    handleFileCopy = async (event, value) => {
        let obj = {}
        obj.username = this.state.user.username
        obj.id = value.id
        const response = await mergeTemplate(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success(response.MESSAGE)
        } else {
            toast.error(response.MESSAGE)
        }
        event.preventDefault()
    }


    handleEdit(e, value) {
        this.setState({ editDetails: value })
        this.setState({ showModal: true })
        e.preventDefault()
    }
    render() {
        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }
        const { blogStatus, comment, isWebPage } = this.props
        const { user, file } = this.state
        const customStyles = {
            content: {
                top: '40%',
                left: '40%',
                right: '56%',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };

        const customStylesSlot = {
            content: {
                top: '40%',
                left: '40%',
                right: '80%',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
            }
        };

        const customStylesPay = {
            content: {
                top: '45%',
                left: '50%',
                right: '50%',
                bottom: '20%',
                marginRight: '-50%',
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
                <div className="container-fluid">
                    <div className="row">
                        {this.props.blog.length > 0 && this.props.blog.map(value =>
                            <div className="col-sm-4 col-xs-4">
                                <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                    <img src={value.image ? value.image : "/template.jpg"} style={{ height: "15em", width: "100%" }} />
                                    <br />
                                    <CardContent>
                                        <span>
                                            <h4 style={{ display: "inline" }}>{value.title}</h4>
                                            <br />
                                            <br />
                                            <div style={{ display: "flex" }}>
                                                <Tooltip title="Publish Web Template">
                                                    <span style={{ float: "right" }}>
                                                        <button className="btn btn-info" onClick={(e) => { this.publishTemplateFunc(e, value) }}>Publish Now</button>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="View Pages">
                                                    <span onClick={(event) => this.handleView(event, value)}>
                                                        <LottieIcon animationData={MenuIcon} pause={this.state.isPaused} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Edit Template Details">
                                                    <span onClick={(event) => this.handleEdit(event, value)}>
                                                        <LottieIcon animationData={editAnimationData} pause={this.state.isPaused} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Copy Template">
                                                    <span style={{ color: "#1DABB8" }} onClick={(e) => { this.handleFileCopy(e, value) }}>
                                                        <LottieIcon animationData={animationDataCopy} pause={this.state.isPaused} />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </span>
                                    </CardContent>
                                </Card>
                                <br />
                            </div>
                        )}
                    </div>
                </div>

                <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><h3>Create Template
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ margin: "0 0 0 0" }}
                                    isStopped={this.state.isStopped}
                                    isPaused={this.state.isPaused} />
                                :
                                <button className="close" onClick={() => this.setState({ showModal: false })}>&times;</button>
                            }
                        </h3>
                        </div>
                        <div className="panel panel-body">
                            <Formik
                                initialValues={{
                                    title: this.state.editDetails.title,
                                }}
                                validationSchema={Yup.object().shape({
                                    title: Yup.string()
                                        .required('Template Title is required'),
                                })}
                                onSubmit={async (fields, { resetForm, initialValues }) => {
                                    this.setState({ loader: true })
                                    if (file) {
                                        const response = await uploadImage(file)
                                        fields.image = response.data.secure_url
                                    }
                                    fields.username = user.username
                                    fields.id = this.state.editDetails.id
                                    const resp = await updateTemplate(fields)
                                    if (resp) {
                                        resetForm(initialValues)
                                        toast.success("Template Updated Successfully")
                                        this.setState({ showModal: false })
                                        this.setState({ loader: false })
                                        let blog = this.props.blog
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
                                        this.setState({ file: '' })
                                        this.props.createBlog(list)
                                    }
                                    else {
                                        this.setState({ loader: false })
                                        toast.success(resp.data.message)
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
                                            <input name="image" onChange={(e) => { this.setState({ file: e.target.files[0] }) }} type="file" className="form-control" />
                                            <img src={this.state.editDetails.image} style={{ width: "10em", height: "6em" }} />
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-info">Edit Template</button>
                                            &nbsp;
                                            <button type="reset" className="btn btn-secondary">Reset</button>
                                        </div>
                                    </Form>
                                )}
                            />
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={this.state.showModalSlotsDetail} style={customStylesSlot}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><h3>Avaliable Publish_Slots
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ margin: "0 0 0 0" }}
                                    isStopped={this.state.isStopped}
                                    isPaused={this.state.isPaused} />
                                :
                                <button className="close" onClick={() => this.setState({ showModalSlotsDetail: false })}>&times;</button>
                            }
                        </h3>
                            <hr />
                        </div>
                        <div className="panel panel-body">
                            <>
                                {this.state.slotDetails.length > 0 ?
                                    <>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Publish_Name</th>
                                                </tr>
                                            </thead>
                                            {this.state.slotDetails.map((value, index) => (
                                                <tbody>
                                                    <tr>
                                                        <td><input type="radio" name="slotDetails" onChange={(e) => { this.setState({ slot: e.target.checked }) }} /></td>
                                                        <td>
                                                            <EdiText
                                                                type='text'
                                                                value={value.publish_name}
                                                                onSave={this.onUpdate}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            ))}
                                        </table>
                                    </>
                                    :
                                    (
                                        <>
                                            <div>7 Days Free Trial Only</div>
                                            <EdiText
                                                type='text'
                                                value={this.state.publish_name}
                                                onSave={this.onSave}
                                            />
                                        </>
                                    )
                                }
                                <hr />
                                <div className="text-center">
                                    <button className="btn btn-info w-100" onClick={(e) => this.publishTemplate(e)}>Publish Now</button>
                                    <br />
                                    <br />
                                    <button className="btn btn-info w-100" onClick={(e) => this.AddSlotsModal(e)}>Add Slots</button>
                                </div>
                            </>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={this.state.showModalPayDetails} style={customStyles}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><h3>Purchase Slots
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ margin: "0 0 0 0" }}
                                    isStopped={this.state.isStopped}
                                    isPaused={this.state.isPaused} />
                                :
                                <button className="close" onClick={() => this.setState({ showModalPayDetails: false })}>&times;</button>
                            }
                        </h3>
                        </div>
                        <hr />
                        <div className="panel panel-body">
                            <>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <label>
                                            <input type="radio" value="999" name="page" className="card-input-element" onChange={(e) => { this.setState({ radioValue: e.target.value }) }} />
                                            <Card className="card-input">
                                                <CardContent>
                                                    <h3>Basic Plan</h3>
                                                    <h2>Rs. 999</h2>
                                                    <div>
                                                        Books 1 Slot For Publishing Website
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </label>
                                    </div>
                                    <div className="col-sm-6">
                                        <label>
                                            <input type="radio" value="999" name="page" className="card-input-element" onChange={(e) => { this.setState({ radioValue: e.target.value }) }} />
                                            <Card className="card-input">
                                                <CardContent>
                                                    <h3>Pro Plan</h3>
                                                    <h2>Rs. 2399</h2>
                                                    <div>
                                                        Books 3 Slot For Publishing Website
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </label>
                                    </div>
                                </div>
                            </>
                        </div>
                        <hr />
                        <div className="panel panel-footer">
                        <span style={{float:"right"}}>
                        <button className="btn btn-info" onClick={(e)=>{this.AddPay(e)}}>Pay</button>
                        </span>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.stripe} style={customStylesPay}>
                <div className="panel panel-default">
                        <div className="panel-heading"><h3>Pay For Slots
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={200}
                                    width={200}
                                    style={{ margin: "0 0 0 0" }}
                                    isStopped={this.state.isStopped}
                                    isPaused={this.state.isPaused} />
                                :
                                <button className="close" onClick={() => this.setState({ stripe: false })}>&times;</button>
                            }
                        </h3>
                        </div>
                        <hr />
                </div>
                <div className="panel panel-body">
                <StripeApp />
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
        fetchIdBlog: (data) => dispatch(actions.fetchIdTemplate(data)),
        createBlog: (data) => dispatch(actions.getBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
