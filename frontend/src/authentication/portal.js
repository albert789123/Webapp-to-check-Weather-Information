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

import { useState, useEffect } from 'react';
import { Alert, Container, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Login from './login';
import Register from './register';
import ErrorMessage from '../errorHandling/errorMessage';

function Portal({ user, loginHandler }) {

  const navigate = useNavigate();
  const [login, setLogin] = useState(true);

  useEffect(()=>{
    if (user){
      if (user.isAdmin) navigate('/locDB');
      else navigate('/map');
    }
  }, [user]);

  return (
    <Container style={{padding: "2em"}}>
      {!user && 
        <>
        <Row>
          <Col><Alert varient="info">You must login to access the information.</Alert></Col>
        </Row>
        <br />
        <Container style={{margin:'auto', maxWidth:650}}>
          <Nav fill variant="tabs" activeKey={(login ? "login" : "register")}>
            <Nav.Item>
              <Nav.Link eventKey="register" onClick={()=>setLogin(false)}>Register</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="login" onClick={()=>setLogin(true)}>Login</Nav.Link>
            </Nav.Item>
          </Nav>
          <br/>
          {!login && <Register />}
          {login && <Login loginHandler={loginHandler} />}
        </Container>
        </>
      }
      {user && <ErrorMessage>You have already logged in</ErrorMessage>}
    </Container>
  );
}

export default Portal;