import React, { Component } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal'
import { connect } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import { getSlots, patchApi, updateSlots } from '../../services/apiFunction'
import { loginUserSuccess } from '../../redux/actions/LoginActions'
import AdminLayout from '../AdminLayout';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SlotModal from '../modal/SlotModal';
import LottieIcon from '../lottieIcons/LottieIco';
import loadingAnimationData from '../lottieIcons/loadingV2.json'
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import { MDBContainer, MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact';
import StripeApp from '../payment/StripeApp';

class ProfileUpdate extends Component {
    state = {
        country: '',
        region: '',
        data: this.props.user,
        showModal: false,
        submitCount: 0,
        slotDetails: [],
        showModalPayDetails: false,
        loader: false,
        slotDetailsExpired: '',
        renewSlots: [],
        stripeModal: false,
        planValue: '',
        slotNumber: 0,
    }

    AddSlotsModal = async (e, value) => {
        e.preventDefault()
        this.togglePay()
    }

    toggleLoader = () => {
        this.setState({ loader: !this.state.loader })
    }

    togglePay = () => {
        this.setState({
            showModalPayDetails: !this.state.showModalPayDetails
        })
    }

    toggle = () => {
        this.setState({
            stripeModal: !this.state.stripeModal
        })
    }

    goToTemplate = (event, value) => {
        
        if (this.props.published && this.props.published.length > 0) {
            let slotPublished = this.props.published.find(val => val.slot_id == value.slot_id)
            if (slotPublished) {
                let tempValue = this.props.userTemplate.find(val => val.id == slotPublished.template_id)
                this.props.history.push({ pathname: 'webTemplate', state: { template: tempValue, type: "USER" } })
            }
            else {
                toast.error("No Template is published at this Slot")
            }
        }
        else {
            toast.error("No Slot is Purchased By You")
        }
    }

    RenewSlots = (e) => {
        if (this.state.renewSlots.length > 0) {
            this.setState({ planValue: 699 })
            this.toggle()
        } else {
            toast.error("Please select some slot to be renewed")
        }
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

    getSlotDetails = async () => {
        let response = await getSlots(this.props.user.username)
        if (response.STATUS) {
            let list = []
            let date = moment().format('YYYY-MM-DD')
            let expiredList = []
            response.DATA.map((val) => {
                if ((date <= val.expiry_date) || val.published == "FALSE") {
                    val.isInput = false
                    list.push(val)
                }
                else {
                    expiredList.push(val)
                }
            })

            this.setState({ slotDetails: list, slotDetailsExpired: expiredList })
        }
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

    onUpdate = async (e, value) => {
        e.preventDefault()
        if (this.state.publish_name != '') {
            let obj = {}
            obj.username = this.props.user.username
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

    componentDidMount() {
        this.getSlotDetails()
    }

    onChangeElement = (e, value) => {
        if (e.target.checked == true) {
            this.setState({ renewSlots: [...this.state.renewSlots, value] })
            this.setState({ slotNumber: this.state.slotNumber + 1 })
        }
        else {
            let filterArr = this.state.renewSlots.filter(val => val.slot_id != value.slot_id)
            this.setState({ renewSlots: filterArr })
            this.setState({ slotNumber: this.state.slotNumber - 1 })
        }
    }

    onSubmit = async (fields) => {
        fields.id = this.state.data.username
        await patchApi(fields.id, fields)
            .then((res) => {
                let obj = {}
                obj = this.props.user
                obj.fname = fields.fname
                obj.lname = fields.lname
                obj.country = fields.country
                obj.state = fields.state
                obj.city = fields.city
                obj.company = fields.company
                obj.mobile = fields.mobile
                obj.email = fields.email
                obj.address = fields.address
                obj.pincode = fields.pincode
                this.props.loginUsersSuccess(obj)
            })
    }

    render() {
        const customStyles = {
            content: {
                top: '31%',
                left: '75%',
                right: '0%',
                bottom: 'auto',
                transform: 'translate(-1%, -50%)'
            }
        };

        Modal.setAppElement('*')
        const { country, region, data } = this.state;
        return this.state.loader ?
            (<>
                <LottieIcon Play={true} animationData={loadingAnimationData} height={50} width={50} pause={this.state.copyState} />
            </>) :
            (
                <>
                    <AdminLayout title="Update Profile">
                        <ToastContainer />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Profile Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ width: "90%" }} className="mx-auto">
                                    <div className="card">
                                        <div className="card-body">
                                            <Formik
                                                initialValues={{
                                                    fname: data.fname,
                                                    lname: data.lname,
                                                    country: data.country,
                                                    state: data.state,
                                                    city: data.city,
                                                    company: data.company,
                                                    mobile: data.mobile,
                                                    email: data.email,
                                                    address: data.address,
                                                    pincode: data.pincode,
                                                }}
                                                validationSchema={Yup.object().shape({
                                                    fname: Yup.string()
                                                        .required('First Name is required'),
                                                    lname: Yup.string()
                                                        .required('Last Name is required'),
                                                    mobile: Yup.string().required('Mobile Number is Required')
                                                        .matches(/^[0-9]+$/, "Must be only digits")
                                                        .min(10, "Must be exactly 10 digits")
                                                        .max(10, "Must be exactly 10 digits"),
                                                    country: Yup.string().required('Please Select Country'),
                                                    state: Yup.string().required('Please Select State'),
                                                    city: Yup.string().required('Please enter City'),
                                                    address: Yup.string(),
                                                    email: Yup.string()
                                                        .email('Email is invalid')
                                                        .required('Email is required'),
                                                })}
                                                onSubmit={this.onSubmit}
                                                render={({ errors, touched, setFieldValue }) => (
                                                    <div className="panel panel-default">
                                                        <div className="panel-body">
                                                            <Form>
                                                                <div className="form-group">
                                                                    <label htmlFor="FName">First Name</label>
                                                                    <Field name="fname" type="text" className={'form-control' + (errors.fname && touched.fname ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="fname" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="LName">Last Name</label>
                                                                    <Field name="lname" type="text" className={'form-control' + (errors.lname && touched.lname ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="lname" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="mobile">Mobile</label>
                                                                    <Field name="mobile" type="text" className={'form-control' + (errors.mobile && touched.mobile ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="mobile" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="email">Email</label>
                                                                    <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="company">Company</label>
                                                                    <Field name="company" type="text" className={'form-control' + (errors.company && touched.company ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="company" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="address">Address</label>
                                                                    <Field name="address" type="textarea" className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="City">City</label>
                                                                    <Field name="city" type="text" className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="state">State</label>
                                                                    <Field name="state" type="text" className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="country">Country</label>
                                                                    <Field name="country" type="text" className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="pincode">PinCode</label>
                                                                    <Field name="pincode" type="text" className={'form-control' + (errors.pincode && touched.pincode ? ' is-invalid' : '')} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <button type="submit" className="btn btn-primary mr-2">Update</button>
                                                                </div>
                                                            </Form>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Prefrencences</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <label>
                                    <input type="checkbox" defaultChecked={(localStorage.getItem("freeEditor") == "true" ? true : false)} name="Prefrence" onChange={(e) => { localStorage.setItem("freeEditor", e.target.checked) }} /> &nbsp;Free Form Editor
                                </label>
                            </AccordionDetails>
                        </Accordion>
                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Available Slots</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <>
                                    <div className="col-md-10">
                                        {this.state.slotDetails.length > 0 ?
                                            <>
                                                {this.state.slotDetails.map((value, index) => (
                                                    <div className="cardBox">
                                                        {!value.isInput &&
                                                            <>
                                                                <span style={{paddingRight:"15px"}}>{value.publish_name}<span style={{fontWeight:"bold"}}>.w3bizz.com</span></span>
                                                                
                                                                <EditIcon fontSize="small" onClick={(e) => { this.editText(e, value, index) }} />
                                                            </>
                                                        }
                                                        {value.isInput &&
                                                            <>
                                                                <span style={{paddingRight:"15px"}}>
                                                                <input type="text" value={this.state.publish_name} onChange={(e) => this.setState({ publish_name: e.target.value })} /><span style={{fontWeight:"bold"}}>.w3bizz.com</span>
                                                                </span>
                                                                <CheckIcon onClick={(e) => { this.onUpdate(e, value) }} />
                                                                <ClearIcon onClick={(e) => this.onCancel(e, value, index)} />
                                                            </>
                                                        }
                                                        <button className="btn btn-info left-space" onClick={(e) => this.goToTemplate(e, value)}>Go to Template</button>
                                                        <button className="btn btn-primary left-space" onClick={(e) => window.open(('http://' + value.publish_name + '.w3bizz.com'), '_blank')}>Preview Website</button>
                                                    </div>

                                                ))}

                                            </>
                                            :
                                            (
                                                <>
                                                    <div>7 Days Free Trial Only. Please Book A Slot</div>
                                                </>
                                            )
                                        }
                                        <br />
                                        <br />
                                        <div>
                                            <button className="btn btn-success" onClick={(e) => this.AddSlotsModal(e)}>Add More Slots</button>
                                        </div>
                                    </div>

                                </>
                            </AccordionDetails>
                        </Accordion>
                        <br />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Expired Slots</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <>
                                    <div className="col-md-10"> 
                                        {this.state.slotDetailsExpired.length == 0 &&
                                            <h5>No Slots To Be Renewed</h5>
                                        }
                                        {this.state.slotDetailsExpired.length > 0 &&
                                            <>
                                                <h5>Renew Slot at Rs.699</h5>
                                                <br />
                                                {this.state.slotDetailsExpired.map((value, index) => (
                                                    <div className="cardBox">
                                                        <input type="checkbox" name={value.slot_id + "name"} value={value.slot_id} onChange={(e) => this.onChangeElement(e, value)} />
                                                        &nbsp;&nbsp;
                                                        <span style={{fontWeight:"bold"}}>{value.publish_name}<span>.w3bizz.com</span></span>
                                                    </div>
                                                ))}
                                            </>
                                        }
                                        <br />
                                        {this.state.slotNumber > 0 &&
                                            <h6>Total Amount to Be Paid is {(this.state.slotNumber) * (699)}</h6>
                                        }
                                        <br />
                                        {this.state.slotDetailsExpired.length > 0 &&
                                            <div>
                                                <button className="btn btn-success" onClick={(e) => this.RenewSlots(e)}>Renew Slots</button>
                                            </div>
                                        }
                                    </div>
                                </>
                            </AccordionDetails>
                        </Accordion>
                    </AdminLayout>
                    <MDBContainer>
                        <MDBModal centered isOpen={this.state.stripeModal} toggle={this.toggle}>
                            <MDBModalHeader toggle={this.toggle}>Renew Slots</MDBModalHeader>
                            <MDBModalBody>
                                <StripeApp planValue={this.state.planValue} slotNumber={this.state.slotNumber} username={this.props.user.username} updateData={this.state.slotDetailsExpired} toast={toast} />
                            </MDBModalBody>
                        </MDBModal>
                    </MDBContainer>
                    <SlotModal modal={this.state.showModalPayDetails} toggle={this.togglePay} loader={this.toggleLoader} slotDetails={this.state.slotDetails} expiredSlots={[]}/>
                </>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login.data,
        userTemplate: state.template.userTemplate,
        published: state.template && state.template.published
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUsersSuccess: (data) => dispatch(loginUserSuccess(data))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProfileUpdate));