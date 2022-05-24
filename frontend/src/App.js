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

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Portal from './authentication/portal';
import Map from './maps/map';
import { LocationTable } from './location_table/location_table';
import "./App.css"
import { useEffect, useState } from 'react';
import LocationItem from './location_table/location_detail';
import CrudLocation from './crud_db/crud_location';
import CrudUser from './crud_db/crud_user';
import GraphQL from './graphql/graphql';
import config from './config.json';

  
function App() {

  if (config.mode === "production") window.backendUrl = config.prod_url;
  else window.backendUrl = config.dev_url;

  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const loginHandler = async (name, password)=>{
    console.log(name, password);
    const config = {
      headers: {
        "Content-type":"application/json"
      },
    };

    const { data: userInfo } = await axios.post(
      window.backendUrl+"/users/login",
      {
        name,
        password
      },
      config,
    );
    
  
    setUser(userInfo);
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logoutHandler = ()=>{
    sessionStorage.removeItem("userInfo");
    setUser(null);
  }

  useEffect(()=>{
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar collapseOnSelect expand="lg" style={{background: "#3f51b5", zIndex: "10000"}} className="shadow">
          <Container>
            <Navbar.Brand as={Link} to="/" style={{color:"#e8eaf6"}}><b>Hi, {user ? user.name : "Anonymous User"}!</b></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto" style={{color: "#e8eaf6"}}>
                
                {user && JSON.parse(sessionStorage.getItem("userInfo")).isAdmin &&
                <>
                    <Nav.Link as={Link} to="/locDB" style={{color:"#e8eaf6"}}>Location DB</Nav.Link>
                    <Nav.Link as={Link} to="/userDB" style={{color:"#e8eaf6"}}>Users DB</Nav.Link>
                </>

                }
                {user &&
                  <>
                    <Nav.Link as={Link} to="/using-graphql" style={{color:"#e8eaf6"}}>GraphQL</Nav.Link>
                    <Nav.Link as={Link} to="/map" style={{color:"#e8eaf6"}}>Map</Nav.Link>
                    <Nav.Link as={Link} to="/table" style={{color:"#e8eaf6"}}>Table</Nav.Link>
                    <Nav.Link onClick={() => setShow(true)} style={{color:"#e8eaf6"}}>Logout</Nav.Link>
                  </>
                }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Modal id={"logout-modal"} show={show} onHide={handleClose} style={{zIndex: "10001"}}>
          <Modal.Header closeButton>
            <Modal.Title>Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <style type="text/css">
              {`
              .btn-indigo {
              background-color: #6573c3;
              color: white;
              }
              `}
            </style>
            <Button href="/" variant="indigo" onClick={()=>{handleClose();logoutHandler();}}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Routes>
            <Route exact path="using-graphql" element={<GraphQL />} />
            {user && 
            <>
              <Route exact path="map" element={<Map />} />
              <Route exact path="details/:id" element={<LocationItem />} />
              <Route exact path="table" element={<LocationTable />} />
              <Route exact path="locDB" element={<CrudLocation />} />
              <Route exact path="userDB" element={<CrudUser />} />
            </>
            }
            <Route path="/*" element={<Portal user={user} loginHandler={loginHandler}/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;