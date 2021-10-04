import React, { Component } from 'react';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import { connect } from 'react-redux'
import { toast } from 'react-toastify';
import { loginUserSuccess } from '../../redux/actions/LoginActions'
import {Card, CardContent} from '@material-ui/core';
import '../../asset/Template.css'
import StripeApp from '../payment/StripeApp';
import { addSlots, patchApi } from '../../services/apiFunction';
import moment from 'moment';

class SlotModal extends Component {

    state = {
        file: '',
        loader: '',
        payModalError: '',
        radioValue: '',
        stripeModal: false,
        slotNumber: 1,
        planValue: '',
        slotsNumber: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }

    toggle = () => {
        this.setState({
            stripeModal: !this.state.stripeModal
        });
    }

    AddPay = async (e) => {
        e.preventDefault()
        if (this.props.user.approved == '' && this.state.radioValue!='') {
            let planValue = this.state.radioValue
            this.setState({ planValue: planValue })
            if (planValue == 2399) {
                this.setState({ slotNumber: 3 })
            }
            this.setState({ stripeModal: true })
            this.props.toggle()
            this.setState({ payModalError: "" })
        }else if(this.state.slotNumber && this.props.user.approved != ""){
            let planValue = ((this.state.slotNumber) * 699)
            this.setState({ planValue: planValue })
            this.setState({ stripeModal: true })
            this.props.toggle()
            this.setState({ payModalError: "" })
        }
        else {
            toast.error("Please Select Some Plan To Buy")
            this.setState({ payModalError: "Please Select Some Plan" })
        }
    }

    AddTrialSlot = async (e) => {
        
        e.preventDefault()
        this.props.loader()
        let obj = {}
        obj.username = this.props.user.username
        obj.publish_name = this.props.user.lname + Math.floor(100000 + Math.random() * 900000)
        obj.published = "FALSE"
        obj.publish_date = ""
        obj.purchase_date = moment().format("YYYY-MM-DD")
        obj.expiry_date = moment(moment(obj.purchase_date).add(7,'d')).format('YYYY-MM-DD')
        const response = await addSlots(obj)
        if (response.STATUS == "SUCCESS") {
            let objUser = {}
            objUser.id = this.props.user.username
            objUser.email = this.props.user.email
            objUser.trial_used = "TRUE"
            await patchApi(objUser, objUser.id)
            .then((val)=>{
                let obj = {}
                obj = this.props.user
                obj.trial_used = "TRUE"
                this.props.loginUsersSuccess(obj)
            })
            toast.success("Slot Created Successfully")
            this.props.toggle()
        }
        else {
            toast.error("Error in Slot")
        }
    }

    render() {
        console.log(this.props.slotDetails)
        return (
            <>
                <MDBContainer>
                    <MDBModal centered isOpen={this.props.modal} toggle={this.props.toggle}>
                        <MDBModalHeader toggle={this.props.toggle}>{this.props.user.approved == ""? "Purchase Slot":"Buy More Slots"}</MDBModalHeader>
                        <MDBModalBody>
                            {((this.props.user.approved == "")) && 
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
                                this.props.user.approved == "PAID" &&
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
                        </MDBModalBody>
                        <MDBModalFooter>
                            <span style={{ float: "right" }}>
                                {this.props.user.trial_used == "" && this.props.user.approved == "" &&
                                    <button className="btn btn-info" onClick={(e) => { this.AddTrialSlot(e) }}>7 Days Free Trial</button>
                                }
                                &nbsp;
                                <button className="btn btn-info" onClick={(e) => { this.AddPay(e) }}>Buy Now</button>
                            </span>
                        </MDBModalFooter>
                    </MDBModal>

                    <MDBModal centered isOpen={this.state.stripeModal} toggle={this.toggle}>
                        <MDBModalHeader toggle={this.toggle}>Pay Order</MDBModalHeader>
                        <MDBModalBody>
                            <StripeApp planValue={this.state.planValue} slotNumber={this.state.slotNumber} username={this.props.user.username} toast={toast} />
                        </MDBModalBody>
                    </MDBModal>

                </MDBContainer>
            </>
        );
    }
}

const mapStateToProps = (state) => {

    return {
        user: state.login.data,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loginUsersSuccess: (data) => dispatch(loginUserSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlotModal)