import React, { useState } from "react";
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import awsconfig from "../../aws-exports";

const userPool = new CognitoUserPool({
  UserPoolId: awsconfig.userPoolId,
  ClientId: awsconfig.userPoolClientId
});

const VerifyEmail = () => {
    const navigate = useNavigate();
    
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const email = localStorage.getItem('userEmail');

    const handleVerify = async (event) => {
        event.preventDefault();
        
        if (!email) {
        setErrorMessage("No email found. Please register first.");
        return;
        }
        
        const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    
        cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.error("Error confirming registration:", err);
                setErrorMessage(err.message || JSON.stringify(err));
                return;
            }
            alert('Email verified successfully! Please login to continue.');
            navigate('/auth/login');
        });
    };

    const handleResendCode = () => {
        if (!email) {
            setErrorMessage("No email found. Please register first.");
            return;
        }
    
        const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    
        cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
            console.error("Error resending confirmation code:", err);
            setErrorMessage(err.message || JSON.stringify(err));
            return;
        }
        alert('Please wait, a new verification code is being sent to your email!');
        });
    };
  

//   navigate("/admin/index");


    return (
        <>
        <Col lg="6" md="8">
            <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center mb-4">Verify Email</div>
                <div className="text-center text-muted mb-4"><small>{email}</small></div>
                <Form role="form" onSubmit={handleVerify}>
                <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                        <i className="ni ni-hat-3" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        placeholder="Enter verification code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    </InputGroup>
                </FormGroup>
                <small>{errorMessage && <p className="text-danger">{errorMessage}</p>}</small>
                <div className="text-center">
                    <Button className="mt-4" color="primary" type="submit">
                    Verify
                    </Button>
                    <Button className="mt-4 ml-2" color="secondary" onClick={handleResendCode}>
                    Resend Code
                    </Button>
                </div>
                </Form>
            </CardBody>
            </Card>
        </Col>
        </>
    );
  
};

export default VerifyEmail;
