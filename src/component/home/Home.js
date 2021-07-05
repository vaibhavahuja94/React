import React, { Component } from 'react';
import Navigation from '../Header';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/GetAllBlogActions'
//import S1 from '../../../public/asset/img/slider1.jpg'
//import S2 from '../../../public/asset/img/slider2.jpg'
//import S3 from '../../../public/asset/img/slider3.jpg'
import * as action from '../../redux/actions/BlogStatusAction'

class Home extends Component {
  componentDidMount() {
    this.props.fetchBlog()
    this.props.fetchStatusBlog()
  }
  render() {

    const { blogStatus } = this.props
    return (
      <>
        <Navigation />



        <div id="homebody">
          <div id="myCarousel" className="carousel slide" data-ride="carousel">

            <ol className="carousel-indicators">
              <li key="One" data-target="#myCarousel" data-slide-to="0" className="active"></li>
              <li key="Two" data-target="#myCarousel" data-slide-to="1"></li>
              <li key="Three" data-target="#myCarousel" data-slide-to="2"></li>
            </ol>


            <div className="carousel-inner">

              <div className="item active">
                <img src="asset/img/slider1.jpg" alt="Los Angeles" />
                <div className="carousel-caption">
                  <h3>Los Angeles</h3>
                  <p>LA is always so much fun!</p>
                </div>
              </div>

              <div className="item">
                <img src="asset/img/slider2.jpg" alt="Chicago" />
                <div className="carousel-caption">
                  <h3>Chicago</h3>
                  <p>Thank you, Chicago!</p>
                </div>
              </div>

              <div className="item">
                <img src="asset/img/slider3.jpg" alt="New York" />
                <div className="carousel-caption">
                  <h3>New York</h3>
                  <p>We love the Big Apple!</p>
                </div>
              </div>

            </div>


            <a className="left carousel-control" href="#myCarousel" data-slide="prev">
              <span className="glyphicon glyphicon-chevron-left"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="right carousel-control" href="#myCarousel" data-slide="next">
              <span className="glyphicon glyphicon-chevron-right"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>
          <br />

          <div>
            {this.props.allBlog.map(value =>
              <div className="col-sm-3">
                <div className="panel panel-primary">
                  <div className="panel-heading">{value.blogTitle}</div>
                  <div className="panel-body">
                    <img src={value.blogImgSrc} className="img-responsive photo1" alt={value.blogTitle} />
                    <br /><br />
                    <p>Description:{value.desc}</p>
                  </div>
                  <div className="panel-footer">
                    <h3>
                      {(blogStatus === undefined) ?
                        (<span>0 <span className="glyphicon glyphicon-thumbs-up"></span></span>) :
                        (<span>{blogStatus.filter(values => (values.blog_id === value.id) && (values.status === "like")).length}
                            &nbsp;<span className="glyphicon glyphicon-thumbs-up" ></span></span>)
                      }
                      <span id="distance">
                        {
                          (blogStatus === undefined) ?
                            (<span>0 <span className="glyphicon glyphicon-thumbs-down"></span></span>) :
                            (<span>{blogStatus.filter(values => (values.blog_id === value.id) && (values.status === "dislike")).length}
                            &nbsp;<span className="glyphicon glyphicon-thumbs-down"></span></span>)
                        }
                      </span>
                    </h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allBlog: state.getAllBlog.allBlog,
    blogStatus: state.blogStatus.blogStatus,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchBlog: () => dispatch(actions.fetchBlog()),
    fetchStatusBlog: () => dispatch(action.fetchStatusBlog()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);