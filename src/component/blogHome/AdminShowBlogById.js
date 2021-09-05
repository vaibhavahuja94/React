import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import Modal from 'react-modal'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {Button, Typography} from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom'
import { getTemplate, mergeTemplate, updateHide } from '../../Services/apiFunction';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Tooltip from '@material-ui/core/Tooltip';

class ShowBlogById extends Component {

    state = {
        user: this.props.user,
        template: false,
    }

    handleView(event, value) {
        this.props.history.push({ pathname: 'webTemplate', state: { template: value, type: "DEFAULT" } })
    }

    handleMergeTemplate = async (event, value) => {
        let obj = {}
        obj.username = this.state.user.username
        obj.id = value.id
        const response = await mergeTemplate(obj)
        if (response.STATUS == "SUCCESS") {
            toast.success(response.MESSAGE)
        } else {
            toast.error(response.MESSAGE)
        }
    }

    handleHide = async(value) => {
        let obj = {}
        obj.username = value.username
        obj.id = value.id
        obj.is_hidden = (value.is_hidden === "FALSE"?"TRUE":"FALSE")
        const response = await updateHide(obj)
        if(response.STATUS == "SUCCESS"){
         let blog = this.props.blog
         var list = []
         blog.forEach((el)=>{
             if(el.id == value.id){
                 el.is_hidden = obj.is_hidden
                 list.push(el)
             }
             else{
                 list.push(el)
             }
         })
         this.props.fetchIdBlog(list)   
        }
    }

    render() {
        if ((this.props.blogStatus === undefined) && (this.props.pending === true)) {
            <p>Loading...</p>
        }
        const { blogStatus, comment, isWebPage } = this.props
        const { user } = this.state
        const customStyles = {
            content: {
                top: '50%',
                left: '30%',
                right: '26%',
                bottom: 'auto',
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
                                <>
                                <div className="col-sm-4 col-xs-4">
                                <Card className={classes.root} variant="outlined" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                                    <img src={value.image ? value.image : "/template.jpg"} style={{ height: "15em", width: "100%" }} />
                                    <CardContent>
                                        <span >
                                            <h4 style={{ display: "inline" }}>{value.title}</h4>
                                            <br />
                                            <div style={{float:"right"}}>
                                                <button className="btn text-white" style={{ backgroundColor: "#1DABB8", borderRadius: "6px" }} onClick={(event) => this.handleMergeTemplate(event, value)}>Use Now</button>
                                                &nbsp;
                                                <span style={{color:"#1DABB8"}} onClick={(event) => this.handleView(event, value)}>{''}{<Tooltip title="View Pages"><ArrowForwardIosIcon /></Tooltip>}</span>
                                                {user.type == "ADMIN" &&
                                                <span
                                                style={{color:"#1DABB8"}}
                                                    onClick={() => {
                                                        this.handleHide(value);
                                                    }}>
                                                    {' '}
                                                        {value.is_hidden == "FALSE" ? <Tooltip title="Hide"><VisibilityOffIcon /></Tooltip> : <Tooltip title="Show"><VisibilityIcon /></Tooltip>}
                                                </span>
                                                }
                                            </div>
                                        </span>
                                    <br />
                                    </CardContent>
                                </Card>
                                <br />
                                </div>
                                </>
                    )}
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login.data,
        blog: state.getBlogById.allAdminBlog,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.getAdminBlogIdSuccess(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ShowBlogById));
