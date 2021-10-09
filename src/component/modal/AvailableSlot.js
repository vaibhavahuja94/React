import React, { Component } from "react";
import {
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";
import { connect } from "react-redux";
import * as actions from "../../redux/actions/LoginActions";
import { toast } from "react-toastify";
import "../../asset/Template.css";
import { updateSlots, publishTemplate, addSlots, patchApi } from "../../services/apiFunction";
import moment from "moment";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from "@material-ui/icons";
import SlotModal from "../modal/SlotModal";
import { withRouter } from "react-router-dom";

class AvailableSlot extends Component {
  state = {
    slotDetails: [],
    slot: "",
    loader: false,
    publish_name: "",
    showModalPayDetails: false,
  };

  onCancel = (e, value, index) => {
    e.preventDefault();
    let slotDetails = [...this.state.slotDetails];
    let slotDetail = { ...slotDetails[index] };
    slotDetail.isInput = false;
    slotDetails[index] = slotDetail;
    this.setState({ slotDetails });
    this.setState({ publish_name: " " });
  };

  AddSlotsModal = async (e, value) => {
    e.preventDefault();
    this.props.toggle();
    this.setState({ showModalPayDetails: true });
  };

  toggleLoader = () => {
    this.setState({ loader: !this.state.loader });
  };

  togglePay = () => {
    this.setState({
      showModalPayDetails: !this.state.showModalPayDetails,
    });
  };

  editText(e, value, index) {
    e.preventDefault();
    let slotDetails = [...this.state.slotDetails];
    let slotDetail = { ...slotDetails[index] };
    slotDetail.isInput = true;
    slotDetails[index] = slotDetail;
    this.setState({ slotDetails });
    this.setState({ publish_name: value.publish_name });
  }

  publishTemplate = async () => {
    let slotUpdate = this.state.slotDetails.find((val) => val.slot_id == this.state.slot);
    if (this.state.slot && slotUpdate.isInput == false && slotUpdate.isExpired == false) {
      this.setState({ loader: true });
      let obj = {};
      obj.username = this.props.user.username;
      obj.template_id = this.props.templateID;
      obj.slot_id = this.state.slot;
      const response = await publishTemplate(obj);
      if (response.STATUS == "SUCCESS") {
        toast.success("Template Published Successfully");
        if (slotUpdate.published == "FALSE") {
          let obj1 = {}
          if(slotUpdate.expiry_date != "0000-00-00"){
          obj1.publish_date = moment().format("YYYY-MM-DD");
          let expiredate = moment(obj1.publish_date).add(1,'y')
          obj1.expiry_date = moment(expiredate).format("YYYY-MM-DD");
          }
          obj1.published = "TRUE";
          obj1.slot_id = slotUpdate.slot_id
          obj1.username = slotUpdate.username
          
          const responseUpdate = await updateSlots(obj1);
        }
        this.props.toggle()
      } else {
        toast.error("Template Not Published");
        this.setState({ loader: false });
      }
    }
    else if(slotUpdate.isInput == true){
      toast.error("Please Update Slot Name First")
    }
    else if(slotUpdate.isExpired == true){
      toast.error("Slot is Expired, please select other slot")
    } 
    else {
      toast.error("Please Select Slot");
    }
  };

  onUpdate = async (e, value) => {
    e.preventDefault();
    if (this.state.publish_name != "") {
      let obj = {};
      obj.username = this.props.user.username;
      obj.slot_id = value.slot_id;
      obj.publish_name = this.state.publish_name;
      const response = await updateSlots(obj);
      if (response.STATUS == "SUCCESS") {
        var list = [];
        this.props.slotDetails.forEach((val) => {
          if (val.slot_id == value.slot_id) {
            val.publish_name = this.state.publish_name;
            val.isInput = false;
            list.push(val);
          } else {
            list.push(val);
          }
        });
        toast.success("Publish Name Updated Successfully");
        this.setState({ slotDetails: list });
        this.setState({ publish_name: "" });
      }
      else{
        toast.error(response.MESSAGE)
      }
    } else {
      toast.error("Please Enter Some Value");
    }
  };

  AddTrialSlot = async (e) => {   
    e.preventDefault()
    this.setState({ loader: true });
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

toggleModal = (e) => {
  e.preventDefault()
  this.setState({slotDetails:[]})
  this.props.toggle()
}

  render() {
    if (this.state.slotDetails.length !== this.props.slotDetails.length) {
      this.setState({ slotDetails: this.props.slotDetails });
    }
    return (
      <>
        <MDBContainer>
          <MDBModal centered isOpen={this.props.modal}>
            <MDBModalHeader toggle={(e)=>this.toggleModal(e)}>
              {this.props.title}
            </MDBModalHeader>
            <MDBModalBody>
              {this.state.slotDetails.length > 0 ? (
                <>
                  <table>
                    {this.state.slotDetails.map((value, index) => (
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="radio"
                              name="slotDetails"
                              value={value.slot_id}
                              checked={value.isChecked}
                              onChange={(e) => {this.setState({ slot: e.target.value })}}
                            />
                          </td>
                          <td>
                            {!value.isInput && value.isExpired == false && (
                              <>
                                <span>
                                  {value.publish_name}
                                  <span style={{ fontWeight: "bold" }}>
                                    .w3bizz.com
                                  </span>
                                </span>
                                &nbsp;&nbsp;
                                <EditIcon
                                  fontSize="small"
                                  onClick={(e) => {
                                    this.editText(e, value, index);
                                  }}
                                />
                              </>
                            )}
                            {value.isInput && value.isExpired == false && (
                              <>
                                <input
                                  type="text"
                                  value={this.state.publish_name}
                                  onChange={(e) =>
                                    this.setState({
                                      publish_name: e.target.value,
                                    })
                                  }
                                />
                                <span style={{ fontWeight: "bold" }}>
                                  .w3bizz.com
                                </span>
                                &nbsp;&nbsp;
                                <CheckIcon
                                  onClick={(e) => {
                                    this.onUpdate(e, value);
                                  }}
                                />
                                <ClearIcon
                                  onClick={(e) =>
                                    this.onCancel(e, value, index)
                                  }
                                />
                              </>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </>
              ) : (
                <>
                  {this.props.user.trial_used == "" && (
                    <div>7 Days Free Trial Only. Please Book A Slot</div>
                  )}
                  {this.props.user.trial_used == "TRUE" && (
                    <div>
                      7 Days Free Trial Already Used. Please Book A Slot
                    </div>
                  )}
                  {this.props.expiredSlots.length > 0 && (
                    <div>
                      <button
                        className="btn btn-info"
                        onClick={() =>
                          this.props.history.push("/profileUpdate")
                        }
                      >
                        Renew Slots
                      </button>
                    </div>
                  )}
                </>
              )}
            </MDBModalBody>
            <MDBModalFooter>
              <div className="w-100">
                {this.state.slotDetails.length > 0 && (
                  <button
                    className="btn btn-info w-100"
                    onClick={(e) => this.publishTemplate(e)}
                  >
                    Publish Now
                  </button>
                )}
                <br />
                <br />
                <button
                  className="btn btn-info w-100"
                  onClick={(e) => this.AddSlotsModal(e)}
                >
                  {this.state.slotDetails.length > 0
                    ? "Add More Slots"
                    : "Buy Slots"}
                </button>
                <br />
                <br />
                {(this.props.user.trial_used !== "TRUE" && this.props.user.approved != "PAID") && (
                    <button
                      className="btn btn-info w-100"
                      onClick={(e) => {
                        this.AddTrialSlot(e);
                      }}
                    >
                      7 Days Free Trial
                    </button>
                  )}
              </div>
            </MDBModalFooter>
          </MDBModal>
        </MDBContainer>
        <SlotModal
          modal={this.state.showModalPayDetails}
          toggle={this.togglePay}
          loader={this.toggleLoader}
          slotDetails={this.state.slotDetails}
          title={"Buy More Slots"}
          expiredSlots={this.props.expiredSlots}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.login.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      loginUsersSuccess: (data) => dispatch(actions.loginUserSuccess(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AvailableSlot));
