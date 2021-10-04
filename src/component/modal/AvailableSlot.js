import React, { Component } from "react";
import {
  MDBContainer,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";
import { connect } from "react-redux";
import * as actions from "../../redux/actions/SetTemplateActions";
import { toast } from "react-toastify";
import "../../asset/Template.css";
import { updateSlots, publishTemplate } from "../../services/apiFunction";
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
    console.log(this.state.slotDetails);
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
    if (this.state.slot) {
      this.setState({ loader: true });
      let obj = {};
      obj.username = this.props.user.username;
      obj.template_id = this.props.templateID;
      obj.slot_id = this.state.slot;
      const response = await publishTemplate(obj);
      if (response.STATUS == "SUCCESS") {
        toast.success("Template Published Successfully");
        let slotUpdate = this.state.slotDetails.find(
          (val) => val.slot_id == this.state.slot
        );
        if (slotUpdate.published == "FALSE") {
          slotUpdate.publish_date = moment().format("YYYY-MM-DD");
          slotUpdate.expiry_date = moment(
            moment(slotUpdate.publish_date).add(1, "y")
          ).format("YYYY-MM-DD");
          slotUpdate.published = "TRUE";
          const responseUpdate = await updateSlots(slotUpdate);
          console.log(responseUpdate);
        }
        window.location.reload();
      } else {
        toast.error("Template Not Published");
        this.setState({ loader: false });
      }
    } else {
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
      if (response.STATUS) {
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
    } else {
      toast.error("Please Enter Some Value");
    }
  };

  render() {
    if (this.state.slotDetails.length !== this.props.slotDetails.length) {
      this.setState({ slotDetails: this.props.slotDetails });
    }
    return (
      <>
        <MDBContainer>
          <MDBModal
            centered
            isOpen={this.props.modal}
            toggle={this.props.toggle}
          >
            <MDBModalHeader toggle={this.props.toggle}>
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
                              onChange={(e) => {
                                this.setState({ slot: e.target.value });
                              }}
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
                {this.props.user.trial_used == "" &&
                  this.props.user.approved == "" && (
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

export default connect(mapStateToProps, null)(withRouter(AvailableSlot));
