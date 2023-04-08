import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { IP_URI, API_URI } from "./shortcut";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

let vh = (window.innerHeight - 0.5) * 0.01;
document.documentElement.style.setProperty("--vh", vh + "px");
document.documentElement.style.setProperty("--100vh", 100 * vh + "px");
document.documentElement.style.setProperty("--newvh", vh + "px");
document.documentElement.style.setProperty("--new100vh", 100 * vh + "px");

axios.get(API_URI).then((res, req) => {
  console.log(res);
});

window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
  document.documentElement.style.setProperty("--100vh", 100 * vh + "px");
  document.documentElement.style.setProperty("--newvh", vh + "px");
  document.documentElement.style.setProperty("--new100vh", 100 * vh + "px");
});

const rootNode = document.getElementById("root");

ReactDOM.createRoot(rootNode).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
