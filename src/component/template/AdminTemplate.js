import React, { Component } from 'react';
import Modal from 'react-modal'
import { connect } from 'react-redux';
import { setAdminTemplate, setDefaultPages } from '../../redux/actions/SetTemplateActions'
import AdminLayout from '../AdminLayout';
import { getTemplate } from '../../services/apiFunction';
import AdminTemplateById from './AdminTemplateById';
import LottieIcon from '../lottieIcons/LottieIco';
import loadingAnimationData from '../lottieIcons/loadingV2.json'
import TemplateModal from '../modal/Template'
import PageModal from '../modal/Page'

class AdminTemplate extends Component {
    state = {
        showModal: false,
        loader: true,
        isPaused: true,
        isStopped: true,
        showPageModal: false,
    }


    async componentDidMount() {
        const response = await getTemplate(this.props.user.username)
        if (response.STATUS == "SUCCESS") {
            let list = []
            if (response.DEFAULT_TEMPLATE && response.DEFAULT_TEMPLATE.length > 0) {
                response.DEFAULT_TEMPLATE.map((val) => {
                    if (val.is_hidden == "FALSE") {
                        list.push(val)
                    }
                })
            }
            if (this.props.user.type == "ADMIN") {
                this.props.AdminTemplate(response.DEFAULT_TEMPLATE)
            }else{
                this.props.AdminTemplate(list)
            }
            this.setState({ loader: false })
        }

    }

    toggleLoader = () => {
        this.setState({ loader: !this.state.loader })
    }

    toggle = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    togglePage = () => {
        this.setState({
            showPageModal: !this.state.showPageModal,
        });
    }

    render() {
        Modal.setAppElement('*')
        const { user } = this.props;
        const { loader } = this.state
        return loader ?
            (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: "20%" }}>
                        <LottieIcon Play={true} animationData={loadingAnimationData} type="Running" height={50} width={50} />
                    </div>
                </>
            ) :
            (
                <>
                    <AdminLayout title="Default Templates">
                        <div style={{ boxSizing: "border-box", width: "100%", height: "4em" }}>
                            {user.type == "ADMIN" &&
                                <>
                                    <button style={{ float: "right", borderRadius: "6px", backgroundColor: "#1DABB8", marginLeft: "10px" }} className="btn text-white" onClick={() => this.setState({ showModal: true })}>Create Template</button>
                                </>
                            }
                        </div>
                        <br />
                        <AdminTemplateById loader={this.toggleLoader}/>
                        <TemplateModal modal={this.state.showModal} loader={this.toggleLoader} toggle={this.toggle} title={"Create Template"} Add={true} data={""} type={"DEFAULT"} />
                        <PageModal modal={this.state.showPageModal} loader={this.toggleLoader} toggle={this.togglePage} title={"Add Default Page"} add={true} editData={""} type={"DEFAULT"} />
                    </AdminLayout>
                </>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login && state.login.data,
        defaultPages: state.template && state.template.defaultPages
    }
}

const mapDispatchToProps = dispatch => {
    return {
        AdminTemplate: (data) => dispatch(setAdminTemplate(data)),
        defaultPages: (data) => dispatch(setDefaultPages(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminTemplate);
