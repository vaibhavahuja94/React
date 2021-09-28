import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/SetTemplateActions'
import { withRouter } from 'react-router-dom'
import TemplateCard from '../cardComponent/TemplateCard';

class AdminTemplateById extends Component {
    state = {
        loader: false
    }

    render() {
        const { user, adminTemplate } = this.props
        return (
            <>
                <div className="container-fluid">
                    <div className="row">
                        {adminTemplate.length > 0 &&
                            <>
                                {user.type == "ADMIN" &&
                                    <TemplateCard ViewPages={true} EditTemplate={true} ShowHide={true} userTemplate={adminTemplate} />
                                }
                                {user.type == "DEFAULT" &&
                                    <TemplateCard ViewPages={true} UseNow={true} userTemplate={adminTemplate}/>
                                }
                            </>
                        }
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.login.data,
        adminTemplate: state.template.adminTemplate,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchIdBlog: (data) => dispatch(actions.setAdminTemplate(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminTemplateById));
