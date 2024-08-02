/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

// import { Amplify } from 'aws-amplify';
// import awsconfig from './aws-exports'; 

// Amplify.configure({
//   Auth: {
//     region: awsconfig.region,
//     userPoolId: awsconfig.userPoolId,
//     userPoolWebClientId: awsconfig.userPoolWebClientId
//   }
// });

const PrivateRoute = ({ element }) => {
  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('userToken');

  // Check if both email and token are present in localStorage
  if (!email || !token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  // Render the element if authenticated
  return element;
};


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth/*" element={<AuthLayout />} />
      
      {/* PrivateRoute wraps AdminLayout to protect the /admin/* routes */}
      <Route
        path="/admin/*"
        element={<PrivateRoute element={<AdminLayout />} />}
      />
      
      {/* Redirect any other routes to the login page */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  </BrowserRouter>
);
