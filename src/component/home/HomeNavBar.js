import React, { useState } from 'react';

const HomeNavBar = () => {
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top ">
               <div className="container ">
                 <a
                  aria-current="page"
                  className="navbar-brand"
                  href="https://www.chatwoot.com/"
                >
                  <img
                    src="/asset/brand-d6ec4f18194acc9e590c511b9ae51974.svg"
                    className="navbar-brand-img"
                    alt="..."
                    style={{maxHeight: "2rem" ,verticalAlign: "top",width: "auto"}}
                  />
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarCollapse"
                  aria-controls="navbarCollapse"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="collapse navbar-collapse justify-content-end mt-xs-10"
                  id="navbarCollapse"
                >
                  <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        id="navbarDocumentation"
                        data-toggle="dropdown"
                        href="https://www.chatwoot.com/#"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Features
                      </a>
                      <div
                        className="dropdown-menu dropdown-menu-md px-5 bg-white"
                        aria-labelledby="navbarDocumentation"
                      >
                        <div className="row ">
                          <div className="col-md-6 border-right-md">
                            <div className="list-group list-group-flush ">
                              <a
                                className="features-menu-item list-group-item bg-white"
                                href="https://www.chatwoot.com/features/shared-inbox"
                              >
                                <div className="mx-2">
                                  <h4 className="mb-1 d-flex align-items-center title">
                                    <div className="icon icon-xs mr-3 d-inline-block text-primary">
                                      <span role="img" aria-label="Shared Inbox">
                                        📥
                                      </span>
                                    </div>
                                    Shared inbox
                                  </h4>
                                  <p className="font-size-sm text-gray-700 mb-0">
                                    Collaborate easily with other agents and manage
                                    conversations
                                  </p>
                                </div>
                              </a>
                              <a
                                className="features-menu-item list-group-item bg-white"
                                href="https://www.chatwoot.com/features/live-chat"
                              >
                                <div className="mx-2">
                                  <h4 className="mb-1 d-flex align-items-center title">
                                    <div className="icon icon-xs mr-3 d-inline-block text-primary">
                                      <span role="img" aria-label="Live chat">
                                        💬
                                      </span>
                                    </div>
                                    Live Chat
                                  </h4>
                                  <p className="font-size-sm text-gray-700 mb-0">
                                    Simple and elegant live chat for your website
                                  </p>
                                </div>
                              </a>
                              <a
                                className="features-menu-item list-group-item bg-white"
                                href="https://www.chatwoot.com/features/channels"
                              >
                                <div className="mx-2">
                                  <h4 className="mb-1 d-flex align-items-center title">
                                    <div className="icon icon-xs mr-3 d-inline-block text-primary">
                                      <span role="img" aria-label="Live chat">
                                        🎡
                                      </span>
                                    </div>
                                    Channels
                                  </h4>
                                  <p className="font-size-sm text-gray-700 mb-0">
                                    Connect with your customers on the channels of
                                    their choice
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="list-group list-group-flush border-top border-top-md-0">
                              <a
                                className="features-menu-item list-group-item bg-white"
                                href="https://www.chatwoot.com/features/chatbots"
                              >
                                <div className="mx-2">
                                  <h4 className="mb-1 d-flex align-items-center title">
                                    <div className="icon icon-xs mr-3 d-inline-block text-primary">
                                      <span role="img" aria-label="Chatbots">
                                        🤖
                                      </span>
                                    </div>
                                    Chatbots
                                  </h4>
                                  <p className="font-size-sm text-gray-700 mb-0">
                                    Easily integrate with popular chatbot platforms to
                                    automate conversations
                                  </p>
                                </div>
                              </a>
                              <a
                                className="features-menu-item list-group-item bg-white"
                                href="https://www.chatwoot.com/mobile-apps"
                              >
                                <div className="mx-2">
                                  <h4 className="mb-1 d-flex align-items-center title">
                                    <div className="icon icon-xs mr-3 d-inline-block text-primary">
                                      <span role="img" aria-label="Mobile apps">
                                        📱
                                      </span>
                                    </div>
                                    Mobile apps
                                  </h4>
                                  <p className="font-size-sm text-gray-700 mb-0">
                                    Don't miss out on new customers. Manage
                                    conversations on the go
                                  </p>
                                </div>
                              </a>
                              <a
                                className="features-menu-item list-group-item bg-white"
                                href="https://www.chatwoot.com/features/integrations"
                              >
                                <div className="mx-2">
                                  <h4 className="mb-1 d-flex align-items-center title">
                                    <div className="icon icon-xs mr-3 d-inline-block text-primary">
                                      <span role="img" aria-label="Integrations">
                                        ⚡
                                      </span>
                                    </div>
                                    Integrations
                                  </h4>
                                  <p className="font-size-sm text-gray-700 mb-0">
                                    Super charge your workflow with integrations
                                  </p>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="https://www.chatwoot.com/blog">
                        Blog
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="https://www.chatwoot.com/pricing">
                        Pricing
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href="https://www.chatwoot.com/help-center"
                      >
                        Help Center
                      </a>
                    </li>
                    <li className="nav-item mr-4">
                      <a
                        className="nav-link"
                        href="https://app.chatwoot.com/app/login"
                      >
                        Login
                      </a>
                    </li>
                  </ul>
                  <a
                    className="navbar-btn btn btn-sm btn-primary lift"
                    href="https://app.chatwoot.com/app/auth/signup"
                  >
                    Create an account
                  </a>
                </div>
              </div>
            </nav>
            </>
    );
}
 
export default HomeNavBar;