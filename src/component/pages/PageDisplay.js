import React, { Component } from 'react';
import Modal from 'react-modal'
import { connect } from 'react-redux';
import { getBlogIdSuccess, getAdminBlogIdSuccess } from '../../redux/actions/GetBlogByIdActions'
import { toast } from 'react-toastify';
import AdminLayout from '../AdminLayout';
import { getTemplate, mergePage } from '../../services/apiFunction';
import {Card, CardContent, Tooltip} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import '../../asset/Template.css'
import loadingAnimationData from '../lottieIcons/LottieIco'
import LottieIcon from '../lottieIcons/LottieIco';
import PageModal from '../modal/Page'
import PageCard from '../cardComponent/PageCard';
import DefaultPagesModal from '../modal/DefaultPagesModal';

class RecentPage extends Component {
    state = {
        showModal: false,
        showPageModal: false,
        loader: false,
        radioValue: '',
        valueError: '',
        pageData: [],
        isStopped: false,
        isPaused: false,
    }

    openModal = (e, value) => {
        this.setState({ showPageModal: true })
        e.preventDefault()
    }

    toggleLoader = () => {
        this.setState({loader:!this.state.loader})
    }

    toggle = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    togglePageModal = () => {
        this.setState({
            showPageModal: !this.state.showPageModal,
        });
    }

    render() {
        const { user, adminTemplate, userTemplate } = this.props
        const { template, type } = this.props.location.state;
        let templateData;
        if(type == "USER"){
            templateData = userTemplate.find(val=> val.s_no == template.s_no)
        }else{
            templateData = adminTemplate.find(val=> val.s_no == template.s_no)
            if(user.type == "DEFAULT"){
                let tempPage = []
                if(templateData && templateData.pageData.length>0){
                    templateData.pageData.map((val)=>{
                        if(val.is_hidden == "FALSE"){
                            tempPage.push(val)
                        }
                    })
                }
                templateData.pageData = tempPage
            }
        }
        return this.state.loader ? (
            <LottieIcon animationData={loadingAnimationData} type="Running" height={50} width={50}/>
        ) :
            (
                <>
                    <AdminLayout title={templateData.title}>
                        <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                            <Tooltip title="Add Default Page">
                                <span style={{ float: "right", marginRight: "10px" }} onClick={(e) => { this.openModal(e, templateData) }}>
                                    <AddCircleOutlineIcon />
                                </span></Tooltip>
                            <button style={{ float: "right", borderRadius: "3px", marginRight: "10px", backgroundColor: "#1DABB8" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Page</button>
                        </div>
                        <br />
                        {templateData && type == "DEFAULT" ?//Template Type
                            user.type == "ADMIN" ?//User Type
                            <PageCard page={templateData.pageData} Preview={true} EditCode={true} EditPage={true} ShowHide={true} />:
                            <PageCard page={templateData.pageData}  Preview={true} ShowHide={true} />
                            :
                            <PageCard page={templateData.pageData} EditCode={true} EditPage={true} ShowHide={true} />
                        }
                        {this.state.showModal &&
                            <PageModal modal={this.state.showModal} loader={this.toggleLoader} toggle={this.toggle} title={"Add Page"} Add={true} editData={""} />
                        }
                        </AdminLayout>
                        <DefaultPagesModal modal={this.state.showPageModal} loader={this.toggleLoader} toggle={this.togglePageModal} title={"Default Pages"} templateData={template} />
                </>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login && state.login.data,
        userTemplate : state.getBlogById && state.getBlogById.allBlog,
        adminTemplate: state.getBlogById && state.getBlogById.allAdminBlog,
        defaultPages: state.getBlogById && state.getBlogById.defaultPages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createPage: (data) => dispatch(getBlogIdSuccess(data)),
        createAdminPage: (data) => dispatch(getAdminBlogIdSuccess(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentPage);
