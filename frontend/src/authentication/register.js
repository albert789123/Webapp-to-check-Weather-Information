/*
Student ID | Name
-----------------------
1155127438 | HONG Kai Yin 
1155141990 | NG Wing Ki Vickie
1155142639 | LAM Yan Yu
1155127411 | WONG Sai Ho
1155127379 | Tang Siu Cheong
1155133623 | Ho Lee Lee
*/

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import ErrorMessage from '../errorHandling/errorMessage';

function Register() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(name, password, confirmPassword);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    }
    else if (name.length < 4) {
      setError("The username is too short!");
    }
    else if (name.length > 20) {
      setError("The username is too long!");
    }
    else if (password.length < 4) {
      setError("The password is too short!");
    }
    else if (password.length > 20) {
      setError("The password is too long!");
    }
    else {
      setError(null);
      try {
        const config = {
          headers: {
            "Content-type":"application/json"
          },
        };
  
        const { data } = await axios.post(
          "/users",
          {
            name,
            password
          },
          config,
        );
        console.log(data);
      } catch (e) {
        setError("User alreay exists!");
      }

      setError("You have registered successfully! Please login now!");

    }

  };

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={submitHandler}>

        <Form.Group controlId="formBasicName">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <br/>
        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <br/><br/>
        <div className="d-grid gap-2">
          <style type="text/css">
            {`
            .btn-indigo {
            background-color: #6573c3;
            color: white;
            }
            `}
          </style>
          <Button variant="indigo" type="submit">
            Submit
          </Button>
        </div>

      </Form>

    </Container>

  );
};

export default Register;