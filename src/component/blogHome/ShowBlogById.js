import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetBlogByIdActions'
import * as action from '../../redux/actions/BlogStatusAction'
import Modal from 'react-modal'
import { Formik, Field, Form, ErrorMessage} from 'formik';
import * as Yup from 'yup'



class ShowBlogById extends Component {
    
    state={
        user:JSON.parse(localStorage.getItem('user')),
        showModal:false,
        id:'',
        img:'',
        name:''
    }
    componentDidMount(){
        this.props.fetchIdBlog()
        this.props.fetchStatusBlog()
        this.props.fetchBlogComment()
    }
    likeBlog = (id) => {
        let data = {
            user_id:this.state.user.id,
            blog_id:id,
            status:"like"

        }   
        
        this.props.changeStatus(data);
        this.componentDidMount();
    }
    disLikeBlog = (id) => {
        let data = {
            user_id:this.state.user.id,
            blog_id:id,
            status:"dislike"
        }   
        
        this.props.changeStatus(data);
        this.componentDidMount();
    }
    comment = (id1,img1,name1) => {
        this.setState({showModal:true})
        this.setState({id:id1})
        this.setState({img:img1})
        this.setState({name:name1})
    }
    render(){
       
        if((this.props.blogStatus===undefined)&&(this.props.pending===true)){
            <p>Loading...</p>
        }
        const {blogStatus,comment} = this.props
        const {user} = this.state
        const customStyles = {
            content : {
              top                   : '50%',
              left                  : '30%',
              right                 : '26%',
              bottom                : 'auto',
              transform             : 'translate(-50%, -50%)'
            }
          };
          
           Modal.setAppElement('*')
        return(
            <>
            <div>
                {this.props.blog.map(value=>
                <div className="col-sm-3">
                <div className="panel panel-primary">
                    <div className="panel-heading">{value.blogTitle}</div>
                    <div className="panel-body">
                        <img src={value.blogImgSrc} className="img-responsive photo" alt={value.blogTitle} />
                        <br /><br />
                        <p>Description:{value.desc}</p>
                        
                        <button className="btn btn-danger" onClick={()=>this.props.deleteBlog(value.id)}>Delete Blog</button>
                    </div>
                    <div className="panel-footer">
                        <h3>
                            {(blogStatus===undefined)?
                            (<span>0 <span className="glyphicon glyphicon-thumbs-up" onClick={()=>this.likeBlog(value.id)}></span></span>):
                            (blogStatus.filter(values=>(values.user_id===user.id)&&(values.status==="like")&&(values.blog_id===value.id)).length>0)?
                            (<span>{blogStatus.filter(values=>(values.blog_id===value.id)&&(values.status==="like")).length}&nbsp; 
                            <span className="glyphicon glyphicon-thumbs-up text-primary" onClick={()=>this.likeBlog(value.id)}></span></span>):
                            (
                            <span>{blogStatus.filter(values=>(values.blog_id===value.id)&&(values.status==="like")).length}
                            &nbsp;<span className="glyphicon glyphicon-thumbs-up" onClick={()=>this.likeBlog(value.id)}></span>
                            </span>
                            )}
                            <span id="distance">
                            {(blogStatus===undefined)?
                            (<span>0 <span className="glyphicon glyphicon-thumbs-up" onClick={()=>this.disLikeBlog(value.id)}></span></span>):
                            ((blogStatus.filter(values=>(values.user_id===user.id)&&(values.status==="dislike")&&(values.blog_id===value.id)).length===0))?
                            (<span>{blogStatus.filter(values=>(values.blog_id===value.id)&&(values.status==="dislike")).length}&nbsp; 
                            <span className="glyphicon glyphicon-thumbs-down" onClick={()=>this.disLikeBlog(value.id)}></span></span>):
                            (
                            <span>{blogStatus.filter(values=>(values.blog_id===value.id)&&(values.status==="dislike")).length}
                            &nbsp;<span className="glyphicon glyphicon-thumbs-down text-danger" onClick={()=>this.disLikeBlog(value.id)}></span>
                            </span>
                            )}
                            </span>
                            &nbsp;&nbsp;
                            <span id="distance">
                            {(comment===undefined)?
                            (<span>0 <span className="glyphicon glyphicon-comment" onClick={()=>this.comment(value.id,value.blogImgSrc)} ></span></span>):
                            (
                            <span>{comment.filter(values=>(values.blog_id===value.id)).length}
                            &nbsp;<span className="glyphicon glyphicon-comment" onClick={()=>this.comment(value.id,value.blogImgSrc,value.blogTitle)} ></span>
                            </span>
                            )}
                            </span>
                        </h3>
                    </div>
                </div>
                </div>
                )}
            </div>
            {this.state.id!==''&&
            <Modal isOpen={this.state.showModal} style={customStyles}>
                    <div className="panel panel-default ">
                    <div className="panel-heading">Change Profile
                    <button className="close" onClick={()=>this.setState({showModal:false})}>&times;</button>
                    
                    </div>
                    <div className="panel panel-body">
                    <div className="col-sm-4">
                    <img src={this.state.img} alt="profile" className="img-responsive photo2" />
                    </div>
                    <div className="col-sm-8 container">
                        <div className="panel panel-default ">
                            <div className="panel-heading">
                                {this.state.name}
                            </div>
                            <div className="panel-body">
                                {comment.filter(val=>(val.blog_id===this.state.id)).map(values=>
                                <div className="div1">
                                    <div style={{fontWeight:'bold'}}>{values.user_name}</div>
                                    <div>{values.comment}</div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="panel panel-footer">
            <Formik
                initialValues={{
                    
                    comment:''
                }}
                validationSchema={Yup.object().shape({
                   comment:Yup.string().required('Please Enter Comment ')
                })}
                onSubmit={(fields,{resetForm,initialValues}) => {
                    fields.blog_id = this.state.id
                    fields.user_name = user.name
                    this.props.createComment(fields)
                    resetForm(initialValues)
                    this.componentDidMount()
                    this.setState({showModal:false})
                }}
                render={({ errors, touched}) => (
                    
                    <Form>
                        <div className="form-group">
                            <Field as="textarea" name="comment"
                            className={'form-control' + (errors.comment && touched.comment ? ' is-invalid' : '')} />
                            <ErrorMessage name="comment" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" 
                            className="btn btn-primary"
                            >Comment</button>
                        </div>
                    </Form>
                )}
            />
            </div>
            </div>
            </Modal>
            }
            </>
        )
    }
}     

const mapStateToProps = (state) => {
    
    return {
    blog: state.getBlogById.allBlog,
    pending:state.blogStatus.pending,
    blogStatus:state.blogStatus.blogStatus,
    comment:state.blogStatus.comment
    }
  }

const mapDispatchToProps = dispatch => {
  return{
    fetchIdBlog:()=>dispatch(actions.fetchIdBlog()),
    fetchBlogComment:()=>dispatch(action.fetchCommentBlog()),
    createComment:(data)=>dispatch(actions.createComment(data)),
    fetchStatusBlog:()=>dispatch(action.fetchStatusBlog()),
    changeStatus:(data)=>dispatch(action.changeBlogStatus(data)),
    deleteBlog:(id)=>(dispatch(actions.deleteBlog(id)))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShowBlogById);
