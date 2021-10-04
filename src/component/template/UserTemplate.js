import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserTemplate, setDefaultPages, publishedTemplates } from '../../redux/actions/SetTemplateActions'
import UserTemplateById from './UserTemplateById';
import { ToastContainer } from 'react-toastify';
import AdminLayout from '../AdminLayout';
import { getTemplate } from '../../services/apiFunction';
import TemplateModal from '../modal/Template'
import LottieIcon from '../lottieIcons/LottieIco';
import loadingAnimationData from '../lottieIcons/loadingV2.json'

class UserTemplate extends Component {
    state = {
        showModal: false,
        loader: true,
        file: '',
        string: window.location.pathname.split("/")[1],
    }

    async componentDidMount() {
        const response = await getTemplate(this.props.user.username)
        if (response.STATUS == "SUCCESS") {
            this.props.createUserTemplate(response.USER_TEMPLATE)
            this.props.defaultPages(response.DEFAULT_PAGES)
            this.props.publishedTemplates(response.PUBLISHED)
            this.setState({ loader: false })
        }

    }

    toggleLoader = () => {
        this.setState({loader:!this.state.loader})
    }

    toggle = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    render() {
        const { loader, file } = this.state
        return loader ?
            (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop:'20%' }}>
                    <LottieIcon animationData={loadingAnimationData} type="Running" height={50} width={50}/>
                </div>
            ) :
            (
                <>
                    <AdminLayout title="All Templates">
                        <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                            <button style={{ float: "right", borderRadius: "6px", backgroundColor: "#1DABB8" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Template</button>
                        </div>
                        <br />
                        <UserTemplateById toggle={this.toggle}/>
                        <TemplateModal modal={this.state.showModal} loader={this.toggleLoader} toggle={this.toggle} title={"Create Template"} Add={true} data={""} />
                    </AdminLayout>
                    <ToastContainer />
                </>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login && state.login.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createUserTemplate: (data) => dispatch(setUserTemplate(data)),
        defaultPages: (data) => dispatch(setDefaultPages(data)),
        publishedTemplates: (data) => dispatch(publishedTemplates(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTemplate);
