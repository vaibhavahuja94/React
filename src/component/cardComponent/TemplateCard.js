import React, { useState, useEffect } from 'react'
import { Tooltip, Card, CardContent, makeStyles } from '@material-ui/core';
import { addSlots, getSlots, mergeTemplate, publishTemplate, updateHide, updateSlots } from '../../services/apiFunction';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import LottieIcon from '../lottieIcons/LottieIco';
import animationDataCopy from '../lottieIcons/copy.json'
import editAnimationData from '../lottieIcons/edit.json'
import MenuIcon from '../lottieIcons/menuV2.json'
import loadingAnimationData from '../lottieIcons/LottieIco'
import '../../asset/Template.css'
import { VisibilityOff as VisibilityOffIcon, Visibility as VisibilityIcon } from '@material-ui/icons';
import { useHistory } from 'react-router';
import AvailableSlot from '../modal/AvailableSlot';
import ModalPage from '../modal/Template'
import moment from 'moment';

const TemplateCard = (props) => {
    const history = useHistory()
    const [slot, setSlot] = useState('')
    const [loader, setLoader] = useState(false)
    const [slotDetails, setSlotDetails] = useState([])
    const [expiredSlots, setExpiredSlots] = useState([])
    const [templateID, setTemplateID] = useState('')
    const [editDetails, setEditDetails] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editShowModal, setEditShowModal] = useState(false)
    const [fileSrc, setFileSrc] = useState('')
    const [isPaused, setIsPaused] = useState(true)
    const [isStopped, setIsStopped] = useState(true)

    const handleView = (event, value) => {
        let type = value.type == "DEFAULT" ? "DEFAULT" : "USER"
        history.push({ pathname: 'webTemplate', state: { template: value, type: type } })
    }

    const toggle = () => {
        setShowModal(!showModal);
    }

    const editToggle = () => {
        setEditShowModal(!editShowModal)
    }

    const toggleLoader = () => {
        setLoader(!loader)
    }

    const publishTemplateFunc = async (e, value) => {
        setTemplateID(value.id)
        const response = await getSlots(props.user.username)
        let date = moment().format('YYYY-MM-DD')
        if (response.STATUS) {
            let list = []
            let expiredList = []
            response.DATA.map((val) => {
                if ((date <= val.expiry_date) || val.published == "FALSE") {
                    val.isInput = false
                    val.isExpired = false
                    list.push(val)
                } else {
                    expiredList.push(val)
                }
            })
            list = list.length > 0 ? list : response.DATA
            setSlotDetails(list)
            setExpiredSlots(expiredList)
        }
        setShowModal(true)
    }


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

    const handleHide = async (value) => {
        let obj = {}
        obj.username = value.username
        obj.id = value.id
        obj.is_hidden = (value.is_hidden === "FALSE" ? "TRUE" : "FALSE")
        const response = await updateHide(obj)
        if (response.STATUS == "SUCCESS") {
            var list = []
            props.userTemplate.forEach((el) => {
                if (el.id == value.id) {
                    el.is_hidden = obj.is_hidden
                    list.push(el)
                }
                else {
                    list.push(el)
                }
            })
            if (props.user.type == "ADMIN") {
                props.adminTemplate(list)
            } else {
                props.template(list)
            }
        }
    }

    const handleEdit = (e, value) => {
        setEditDetails(value)
        setFileSrc(value.image)
        setEditShowModal(true)
        e.preventDefault()
    }

    const handleMergeTemplate = async (event, value) => {
        let obj = {}
        obj.username = props.user.username
        obj.id = value.id
        const response = await mergeTemplate(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success(response.MESSAGE)
        } else {
            toast.error(response.MESSAGE)
        }
        event.preventDefault()
    }

    return loader ?
        (<>
            <LottieIcon animationData={loadingAnimationData} type="Running" pause={isPaused} height={50} width={50} />
        </>)
        :
        (
            <>
                <div className="container-fluid">
                    <div className="row">
                        {props.userTemplate.length > 0 &&
                            props.userTemplate.map(value =>
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
                                                    {props.Publish == true &&
                                                        <Tooltip title="Publish Web Template">
                                                            <span style={{ float: "right" }}>
                                                                <button className="btn btn-info" onClick={(e) => { publishTemplateFunc(e, value) }}>Publish Now</button>
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                    {props.UseNow == true &&
                                                        <Tooltip title="Use Now">
                                                            <span onClick={(e) => { handleMergeTemplate(e, value) }}>
                                                                <button className="btn btn-info">Use Now</button>
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                    {props.ShowHide == true &&
                                                        <span onClick={() => { handleHide(value) }}>
                                                            {value.is_hidden == "TRUE" ? <Tooltip title="Show"><VisibilityOffIcon /></Tooltip> : <Tooltip title="Hide"><VisibilityIcon /></Tooltip>}
                                                        </span>
                                                    }
                                                    {props.ViewPages == true &&
                                                        <Tooltip title="View Pages">
                                                            <span onClick={(event) => handleView(event, value)}>
                                                                <LottieIcon animationData={MenuIcon} pause={isPaused} stop={isStopped} />
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                    {props.EditTemplate == true &&
                                                        <Tooltip title="Edit Template Details">
                                                            <span onClick={(event) => handleEdit(event, value)}>
                                                                <LottieIcon animationData={editAnimationData} pause={isPaused} stop={isStopped} />
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                    {props.CopyTemplate == true &&
                                                        <Tooltip title="Copy Template">
                                                            <span style={{ color: "#1DABB8" }} onClick={(e) => { handleMergeTemplate(e, value) }}>
                                                                <LottieIcon animationData={animationDataCopy} pause={isPaused} stop={isStopped} />
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                </div>
                                            </span>
                                        </CardContent>
                                    </Card>
                                    <br />
                                </div>
                            )}
                    </div>
                </div>
                {slotDetails.length > 0 &&
                    <AvailableSlot modal={showModal} title={"Available Slots"} toggle={toggle} slotDetails={slotDetails} templateID={templateID} expiredSlots={expiredSlots} />
                }
                {editShowModal &&
                    <ModalPage modal={editShowModal} loader={toggleLoader} toggle={editToggle} title={editDetails.length > 0 ? "Edit Template" : "Create Template"} add={editDetails.length > 0 ? false : true} data={editDetails} />
                }
            </>
        )
}

const mapStateToProps = (state) => {
    return {
        user: state.login.data,
        published: state.getBlogById.published
    }
}

const mapDispatchToProps = dispatch => {
    return {
        adminTemplate: (data) => dispatch(actions.getAdminBlogIdSuccess(data)),
        template: (data) => dispatch(actions.getBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCard)