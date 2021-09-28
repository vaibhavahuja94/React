import React, { Component } from 'react';
import ModalPage from '../modal/Template'
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/SetTemplateActions'
import {Tooltip, Card, CardContent} from '@material-ui/core';
import { withRouter } from 'react-router-dom'
import '../../asset/Template.css'
import {Web as WebIcon, WebAsset, Edit as EditIcon, Check as CheckIcon, Clear as ClearIcon} from '@material-ui/icons';
import TemplateCard from '../cardComponent/TemplateCard';

class UserTemplateById extends Component {

    state = {
        editDetails:'',
        showModal: false,
    }

    render() {
        const {template} = this.props
        return (
            <>
                <div className="container-fluid">
                    <div className="row">
                        {template.length > 0 ? 
                        (
                        <>
                        <TemplateCard Publish={true} ViewPages={true} EditTemplate={true} CopyTemplate={true} userTemplate={template} />
                        </>
                        ):(
                            <div>
                                <h3 className="demo-heading">
                                It is Very Easy To Create Template.
                                <span className="demo-sub">You Can Either choose Built-In Template or Create New Blank Template to Start.</span>
                                </h3>
                                <div className="demo-div">
                                <Card className="demo-card" onClick={(e)=>{this.props.history.push('/savedWebTemplate')}}>
                                <WebIcon style={{fontSize:120}} className="demo-icon"/>
                                <h6 className="demo-title">Template</h6>                                    
                                <span className="demo-sub">Choose from our pre-defined templates curated for your website.</span> 
                                </Card>
                                <Card className="demo-card" onClick={(e) => this.props.toggle()}>
                                <WebAsset style={{fontSize:120}} className="demo-icon"/>
                                <h6 className="demo-title">Create New Template</h6>
                                <span className="demo-sub">You can create a new blank template in few clicks and build your website from scratch.</span>                                  
                                </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        template: state.template.userTemplate
    }
}

export default connect(mapStateToProps, null)(withRouter(UserTemplateById));
