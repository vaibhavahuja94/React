import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserTemplate, setAdminTemplate, setDefaultPages } from '../../redux/actions/SetTemplateActions'
import AdminLayout from '../AdminLayout';
import { getTemplate, mergePage } from '../../services/apiFunction';
import '../../asset/Template.css'
import loadingAnimationData from '../lottieIcons/loadingV2.json'
import LottieIcon from '../lottieIcons/LottieIco';
import PageModal from '../modal/Page'
import PageCard from '../cardComponent/PageCard';

class DefaultPage extends Component {
    state = {
        showModal: false,
        loader: false,
        isStopped: false,
        isPaused: false,
    }

    toggleLoader = () => {
        this.setState({loader:!this.state.loader})
    }

    toggle = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    componentDidMount(){
        this.getDefaultPages();
    }

    getDefaultPages = async () => {
        this.setState({loader:true})
        const response = await getTemplate(this.props.user.username)
        if(response.STATUS == "SUCCESS"){
            this.setState({loader:false})
            this.props.createDefaultPage(response.DEFAULT_PAGES)
        }
    }
    render() {
        const {pageData} = this.props
        return this.state.loader ? (
            <LottieIcon animationData={loadingAnimationData} type="Running" height={50} width={50} pause={false} stop={false}/>
        ) :
            (
                <>
                    <AdminLayout title={pageData.title}>
                        <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                            <button style={{ float: "right", borderRadius: "3px", marginRight: "10px", backgroundColor: "#1DABB8" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Page</button>
                        </div>
                        <br />
                        {pageData && pageData.length > 0 &&//Template Type
                            <PageCard page={pageData} EditCode={true} EditPage={true} ShowHide={true} type={"DEFAULT"} loader={this.toggleLoader}/>
                        }
                        {this.state.showModal &&
                            <PageModal modal={this.state.showModal} loader={this.toggleLoader} toggle={this.toggle} title={"Add Page"} Add={true} editData={""} type={"DEFAULT"} />
                        }
                    </AdminLayout>
                </>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login && state.login.data,
        pageData: state.template && state.template.defaultPages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createDefaultPage: (data) => dispatch(setDefaultPages(data)),
        createAdminPage: (data) => dispatch(setAdminTemplate(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage)