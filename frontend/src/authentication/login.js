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

import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../errorHandling/errorMessage';

function Login({ loginHandler }) {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (userInfo) {
      navigate('/');
    }
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!loginHandler){
        console.error("No Login Handler!");
        throw Error("No Login Handler!");
      }
      await loginHandler(name, password);
      window.location.reload(false);
    } catch (err) {
      setError("Invalid username or password!");
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
}
export default Login;
