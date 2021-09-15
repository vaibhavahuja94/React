import React, { Component } from 'react';
import './Home.css'
import HomeNavBar from './HomeNavBar';

 class Home extends Component {
   render() {
     return (
           <>
           <HomeNavBar />
           <div id="___gatsby">
           <div style={{ outline: "none" }} tabIndex={-1} id="gatsby-focus-wrapper">
             <div className="mt-10">
               <section className="pt-4 pt-md-11 pb-11">
                 <div className="container">
                   <div className="row align-items-center">
                     <div className="col-12 col-md-5 col-lg-6 order-md-2">
                       <img
                        src="/asset/hero-illustration-7c4bf8254c645949de90aed2f60618b7.svg"
                        className="img-fluid mw-md-100 mw-lg-100 mb-6 mb-md-0"
                        alt="all-channels"
                      />
                    </div>
                    <div className="col-12 col-md-7 col-lg-6 order-md-1">
                      <h1 className="mt-7 display-3 text-center text-md-left text-dark">
                        The better way to talk to your customers
                      </h1>
                      <p className="lead text-center text-md-left text-muted mb-6 mb-lg-8">
                        Manage conversations, build relationships and delight your
                        customers, all from one place.
                      </p>
                      <div className="text-center text-md-left">
                        <a
                          href="https://app.chatwoot.com/app/auth/signup"
                          className="btn btn-primary shadow lift mr-3"
                        >
                          Create an account
                        </a>
                        <a
                          href="https://github.com/chatwoot/chatwoot"
                          className="btn btn-outline-primary shadow lift mr-1"
                        >
                          <span className="fe fe-github mr-1" />
                          Use self-hosted version
                        </a>
                      </div>
                      <p className="text-muted mt-5 text-center text-md-left">
                        To schedule a demo,
                        <a
                          href="https://calendly.com/chatwoot"
                          className="ml-1"
                          target="_blank"
                          rel="noopener nofollow noreferrer"
                        >
                          Click here
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              </div>
              </div>
              </div>
           </>

     );
   }
}

export default Home