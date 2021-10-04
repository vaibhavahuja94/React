import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserTemplate, setAdminTemplate } from '../../redux/actions/SetTemplateActions'
import AdminLayout from '../AdminLayout';
import {Tooltip} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import '../../asset/Template.css'
import loadingAnimationData from '../lottieIcons/loadingV2.json'
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
            <div style={{ display: 'flex', justifyContent: 'center', marginTop:'20%' }}>
                    <LottieIcon animationData={loadingAnimationData} type="Running" height={50} width={50}/>
            </div>
        ) :
        this.state.showPageModal ? (    
            <>
            <DefaultPagesModal modal={this.state.showPageModal} loader={this.toggleLoader} toggle={this.togglePageModal} title={"Default Pages"} templateData={template} />
            </>
        ):
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
                            <PageCard page={templateData.pageData} Preview={true} EditCode={true} EditPage={true} ShowHide={true} loader={this.toggleLoader}/>:
                            <PageCard page={templateData.pageData}  Preview={true} ShowHide={true} loader={this.toggleLoader}/>
                            :
                            <PageCard page={templateData.pageData} EditCode={true} EditPage={true} ShowHide={true} loader={this.toggleLoader}/>
                        }
                        {this.state.showModal &&
                            <PageModal modal={this.state.showModal} loader={this.toggleLoader} toggle={this.toggle} title={"Add Page"} Add={true} editData={""} template_id={templateData.id}/>
                        }
                        </AdminLayout>
                </>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login && state.login.data,
        userTemplate : state.template && state.template.userTemplate,
        adminTemplate: state.template && state.template.adminTemplate,
        defaultPages: state.template && state.template.defaultPages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createPage: (data) => dispatch(setUserTemplate(data)),
        createAdminPage: (data) => dispatch(setAdminTemplate(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentPage);
