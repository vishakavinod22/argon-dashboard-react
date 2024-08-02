// /*!

// =========================================================
// * Argon Dashboard React - v1.2.4
// =========================================================

// * Product Page: https://www.creative-tim.com/product/argon-dashboard-react
// * Copyright 2024 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

// * Coded by Creative Tim

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// */

// reactstrap components
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from "reactstrap";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import awsconfig from "../../aws-exports";
import axios from 'axios';

const userPool = new CognitoUserPool({
    UserPoolId: awsconfig.userPoolId,
    ClientId: awsconfig.userPoolClientId
});

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try{
      const response = await axios.get(`https://gzb9r51nek.execute-api.us-east-1.amazonaws.com/build/getUserInfo?email=${email}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response);

    } catch(error){

    }
  }

  const handleLogin = (event) => {
    event.preventDefault();
    
    if (!email || !password) {
        setErrorMessage('Both email and password are required');
        return;
    }

    // Setup authentication data
    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
    });

    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
    });

    // Authenticate the user
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            console.log('Login successful: ', result);
            const accessToken = result.getAccessToken().getJwtToken();
            localStorage.setItem('userEmail', email); 
            localStorage.setItem('userToken', accessToken);
            getUserInfo();
            // navigate('/admin/index');
        },
        onFailure: (err) => {
            console.error('Login failed: ', err);
            setErrorMessage(err.message || JSON.stringify(err));
        }
    });
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center mt-2 mb-3">
              Login
            </div>
            <Form role="form" onSubmit={handleLogin}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              <small>{errorMessage && <p className="text-danger">{errorMessage}</p>}</small>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
