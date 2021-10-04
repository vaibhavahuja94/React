import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/SetTemplateActions'
import { withRouter } from 'react-router-dom'
import TemplateCard from '../cardComponent/TemplateCard';

class AdminTemplateById extends Component {
    render() {
        
        const { user, adminTemplate } = this.props
        return (
            <>
                <div className="container-fluid">
                    <div className="row">
                        {adminTemplate.length > 0 &&
                            <>
                                {user.type == "ADMIN" &&
                                    <TemplateCard toggle={this.props.loader} ViewPages={true} EditTemplate={true} ShowHide={true} userTemplate={adminTemplate} />
                                }
                                {user.type == "DEFAULT" &&
                                    <TemplateCard toggle={this.props.loader} ViewPages={true} UseNow={true} userTemplate={adminTemplate}/>
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

export default connect(mapStateToProps, null)(withRouter(AdminTemplateById));
