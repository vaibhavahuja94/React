import React, { useState, useEffect } from 'react'
import { Tooltip, Card, CardContent, makeStyles } from '@material-ui/core';
import { getTemplate, updateHidePage } from '../../services/apiFunction';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/SetTemplateActions'
import '../../asset/Template.css'
import { useHistory } from 'react-router';
import PageModal from '../modal/Page'
import {
    Edit as EditIcon,
    Slideshow as SlideshowIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    SettingsApplications as SettingsApplicationsIcon,
} from '@material-ui/icons';
import '../../asset/PageCard.css'

const PageCard = (props) => {
    const history = useHistory()
    const [loader, setLoader] = useState(false)
    const [editDetails, setEditDetails] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    
    const handleView = (event, value) => {
        let editor
        let freeEdit = localStorage.getItem('freeEditor')
        if(freeEdit){
            editor = (freeEdit == "true") ? true  : false
        }
        else{
            editor=false
        }
        window.open(`https://w3bizz.com/editor?pageid=${value.page_id}&block=${editor}`)
    }

    const handleHide = async (value) => {
        let obj = {}
        obj.id = value.page_id
        obj.is_hidden = (value.is_hidden === "FALSE" ? "TRUE" : "FALSE")
        const response = await updateHidePage(obj)
        if (response.STATUS == "SUCCESS") {
            let list = []
            let response = await getTemplate(props.user.username)
            if (props.user.type == "ADMIN") {
                props.adminTemplate(response.DEFAULT_TEMPLATE)
            }
            else {
                props.template(response.USER_TEMPLATE)
            }
        }
    }

    const toggle = () => {
        setShowModal(!showModal)
    }

    const handleEdit = (e, value) => {
        toggle()
        setEditDetails(value)
        e.preventDefault()
    }

    const preView = async (e, link) => {
        if (link != '') {
            window.open(link, "_blank")
        }
        else {
            toast.error("No Preview is Present")
        }
    }

    const toggleLoader = () => {
        setLoader(!loader)
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


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    {props.page.map(value =>
                        <div className="col-sm-4 col-xs-4">
                            <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                <img src={value.image ? value.image : "https://res.cloudinary.com/w3bizz-com/image/upload/c_scale,w_425/v1632246930/2_hjs08o.png"} style={{ height: "15em", width: "100%" }} />
                                <br />
                                <CardContent>
                                    <span >
                                        <h4 style={{ display: "inline" }}>{value.page_title}</h4>
                                        <br />
                                        <br />
                                        <span style={{ display: "flex" }} className="mouseCursor">
                                            {props.Preview == true &&
                                                <Tooltip title="Preview of Page"><SlideshowIcon onClick={(e) => { preView(e, value.preview_link) }} /></Tooltip>
                                            }
                                            {props.EditCode == true &&
                                                <Tooltip title="Edit Page"><EditIcon onClick={(event) => handleView(event, value)} /></Tooltip>
                                            }
                                            {props.ShowHide == true &&
                                                <span onClick={() => { handleHide(value) }}>
                                                    {value.is_hidden == "TRUE" ? <Tooltip title="SHOW"><VisibilityOffIcon /></Tooltip> : <Tooltip title="HIDE"><VisibilityIcon /></Tooltip>}
                                                </span>
                                            }
                                            {props.EditPage == true &&
                                                <Tooltip title="Edit Page Details"><SettingsApplicationsIcon onClick={(event) => handleEdit(event, value)} /></Tooltip>
                                            }
                                        </span>
                                    </span>
                                </CardContent>
                            </Card>
                            <br />
                        </div>
                    )}
                </div>
            </div>
            <PageModal modal={showModal} loader={props.loader} toggle={toggle} title={"Edit Page"} Add={false} editData={editDetails} type={props.type}/>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.login.data,
        template: state.template.userTemplate,
        published: state.template.published,
        adminTemplate: state.template.adminTemplate
    }
}

const mapDispatchToProps = dispatch => {
    return {
        template: (data) => dispatch(actions.setUserTemplate(data)),
        adminTemplate: (data) => dispatch(actions.setAdminTemplate(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageCard)