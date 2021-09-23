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
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import './BlogHome.css'
import StripeApp from '../payment/StripeApp';
import moment from 'moment';

class ShowBlogById extends Component {

    state = {
        user: this.props.user,
        showModal: false,
        id: '',
        fileSrc: '',
        img: '',
        name: '',
        stripe: '',
        file: '',
        template: false,
        string: "",
        showModalPayDetails: false,
        showModalSlotsDetail: false,
        editDetails: {},
        slotDetails: [],
        templateID: '',
        editInput: '',
        payModalError: '',
        slotNumber: 1,
        planValue: '',
        slotsNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }

    AddSlotsModal = async (e, value) => {
        e.preventDefault()
        this.setState({ showModalPayDetails: true })
        this.setState({ showModalSlotsDetail: false })
    }

    handleView(event, value) {
        this.props.history.push({ pathname: 'webTemplate', state: { template: value, type: "USER" } })
    }

    publishTemplate = async () => {
        if (this.state.slot) {
            this.setState({ loader: true })
            let obj = {}
            obj.username = this.state.user.username
            obj.template_id = this.state.templateID
            obj.slot_id = this.state.slot
            const response = await publishTemplate(obj)
            if (response.STATUS == "SUCCESS") {
                toast.success("Template Published Successfully")
                let slotUpdate = this.state.slotDetails.find(val => val.slot_id == this.state.slot)
                if (slotUpdate.published == "FALSE") {
                    slotUpdate.publish_date = moment().format("YYYY-MM-DD")
                    slotUpdate.expiry_date = moment().format("YYYY-MM-DD")
                    slotUpdate.published = "TRUE"
                    const responseUpdate = await updateSlots(slotUpdate)
                    console.log(responseUpdate)
                }
                this.setState({ loader: false })
                this.setState({ showModalSlotsDetail: false })
            }
            else {
                toast.error("Template Not Published")
                this.setState({ loader: false })
            }
        }
        else {
            toast.error("Please Select Slot")
        }
    }

    AddPay = async (e) => {
        if (this.state.radioValue || this.state.slotNumber) {
            e.preventDefault()
            let planValue = this.state.radioValue ? this.state.radioValue : ((this.state.slotNumber) * 699)
            this.setState({ planValue: planValue })
            if (planValue == 2399) {
                this.setState({ slotsNumber: 3 })
            }
            this.setState({ stripe: true })
            this.setState({ showModalPayDetails: false })
            this.setState({ payModalError: "" })
        }
        else {
            this.setState({ payModalError: "Please Select Some Plan" })
        }
    }

    AddTrialSlot = async (e) => {
        e.preventDefault()
        this.setState({ loader: true })
        let obj = {}
        obj.username = this.props.user.username
        obj.publish_name = this.props.user.username + "New12"
        obj.published = "FALSE"
        obj.publish_date = ""
        obj.purchase_date = moment().format("YYYY-MM-DD")
        obj.expiry_date = ""
        const response = await addSlots(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success("Slot Created Successfully")
            this.setState({ showModalPayDetails: false })
        }
        else {
            toast.error("Error in Slot")
        }
    }

    publishTemplateFunc = async (e, value) => {
        this.setState({ templateID: value.id })
        let response = await getSlots(this.props.user.username)
        if (response.STATUS) {
            let list = []
            response.DATA.map((val) => {
                if (this.props.published.length > 0) {
                    val.isInput = false
                    list.push(val)
                }
            })
            list = list.length > 0 ? list : response.DATA
            this.setState({ slotDetails: list })
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
                this.setState({ slotDetails: [...this.state.slotDetails, obj] })
            }
        }
    }

    onUpdate = async (e, value) => {
        e.preventDefault()
        if (this.state.publish_name != '') {
            let obj = {}
            obj.username = this.state.user.username
            obj.slot_id = value.slot_id
            obj.publish_name = this.state.publish_name
            const response = await updateSlots(obj)
            if (response.STATUS) {
                var list = []
                this.state.slotDetails.forEach((val) => {
                    if (val.slot_id == value.slot_id) {
                        val.publish_name = this.state.publish_name
                        val.isInput = false
                        list.push(val)
                    }
                    else {
                        list.push(val)
                    }
                })
                toast.success("Publish Name Updated Successfully")
                this.setState({ slotDetails: list })
                this.setState({ publish_name: '' })
            }
        } else {
            toast.error("Please Enter Some Value")
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

    onCancel = (e, value, index) => {
        e.preventDefault()
        let slotDetails = [...this.state.slotDetails]
        let slotDetail = { ...slotDetails[index] }
        slotDetail.isInput = false
        slotDetails[index] = slotDetail
        this.setState({ slotDetails })
        this.setState({ publish_name: " " })
    }

    editText(e, value, index) {
        e.preventDefault()
        let slotDetails = [...this.state.slotDetails]
        let slotDetail = { ...slotDetails[index] }
        slotDetail.isInput = true
        slotDetails[index] = slotDetail
        this.setState({ slotDetails })
        this.setState({ publish_name: value.publish_name })
    }

    handleFile = (e) => {
        this.setState({
            fileSrc: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }

    handleEdit(e, value) {
        this.setState({ editDetails: value, fileSrc: value.image })
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
                                    <img src={value.image ? value.image : "https://res.cloudinary.com/w3bizz-com/image/upload/c_scale,w_425/v1632246929/1_qccloi.png"} style={{ height: "15em", width: "100%" }} />
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
                        <div className="panel-heading"><h3>Edit Template
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={50}
                                    width={50}
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
                                            <input name="image" onChange={(e) => this.handleFile(e)} type="file" className="form-control" />
                                            {this.state.fileSrc &&
                                                <img src={this.state.fileSrc} style={{ width: "10em", height: "6em", marginTop: "10px" }} />
                                            }
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
                        <div className="panel-heading"><h3>Avaliable PublishSlots
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={50}
                                    width={50}
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
                                            {this.state.slotDetails.map((value, index) => (
                                                <tbody>
                                                    <tr>
                                                        <td><input type="radio" name="slotDetails" value={value.slot_id} checked={value.isChecked} onChange={(e) => { this.setState({ slot: e.target.value }) }} /></td>
                                                        <td>
                                                            {!value.isInput &&
                                                                <>
                                                                    <span>{value.publish_name}.w3bizz.com</span>
                                                                    <EditIcon fontSize="small" onClick={(e) => { this.editText(e, value, index) }} />
                                                                </>
                                                            }
                                                            {value.isInput &&
                                                                <>
                                                                    <input type="text" value={this.state.publish_name} onChange={(e) => this.setState({ publish_name: e.target.value })} />.w3bizz.com
                                                                    <CheckIcon onClick={(e) => { this.onUpdate(e, value) }} />
                                                                    <ClearIcon onClick={(e) => this.onCancel(e, value, index)} />
                                                                </>
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            ))}
                                        </table>
                                    </>
                                    :
                                    (
                                        <>
                                            <div>7 Days Free Trial Only. Please Book A Slot</div>
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
                        <div className="panel-heading"><h3>{this.state.slotDetails ? "Buy More Slots" : "Subscribe Slots"}
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={50}
                                    width={50}
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
                                {!this.state.slotDetails &&
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
                                                <input type="radio" value="2399" name="page" className="card-input-element" onChange={(e) => { this.setState({ radioValue: e.target.value }) }} />
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
                                }
                                {
                                    this.state.slotDetails &&
                                    <>
                                        <br />
                                        <div style={{ display: "flex" }}>
                                            <h6>Buy &nbsp;</h6>
                                            <select name="slotnumber" value={this.state.slotNumber} onChange={(e) => { this.setState({ slotNumber: e.target.value }) }}>
                                                {this.state.slotsNumber.map((val) => (
                                                    <option value={val}>{val}</option>
                                                ))}
                                            </select>
                                            <h6> &nbsp;More Slots</h6>
                                        </div>
                                        <Card className="card-input">
                                            <CardContent>
                                                <h3>Extra Slots</h3>
                                                <h2>Rs. 699</h2>
                                                <div>
                                                    You Can Use for Publishing more Websites
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <br />
                                        <div><h6>Total Amount to Be Paid is {(this.state.slotNumber) * (699)}</h6></div>
                                    </>
                                }
                            </>
                        </div>
                        <br />
                        <div style={{ color: "red" }}><h4>{this.state.payModalError}</h4></div>
                        <hr />
                        <div className="panel panel-footer">
                            <span style={{ float: "right" }}>
                                {!this.state.slotDetails &&
                                    <button className="btn btn-info" onClick={(e) => { this.AddTrialSlot(e) }}>7 Days Free Trial</button>
                                }
                                &nbsp;
                                <button className="btn btn-info" onClick={(e) => { this.AddPay(e) }}>Buy Now</button>
                            </span>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.stripe} style={customStylesPay}>
                    <div className="panel panel-default">
                        <div className="panel-heading"><h3>Pay For Slots
                            {this.state.loader ?
                                <Lottie options={loadDefaultOptions}
                                    height={50}
                                    width={50}
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
                        <StripeApp planValue={this.state.planValue} slotNumber={this.state.slotNumber} username={this.props.user.username} toast={toast}/>
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
        published: state.getBlogById && state.getBlogById.published
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.fetchIdTemplate(data)),
        createBlog: (data) => dispatch(actions.getBlogIdSuccess(data)),
        publishTemplates: (data) => dispatch(actions.publishedTemplates(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
