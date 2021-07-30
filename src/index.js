import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import configureStore from "./store";
import { Provider } from "react-redux";

const initialState = {};
const store = configureStore(initialState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
