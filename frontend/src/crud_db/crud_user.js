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

import React from 'react';
import CrudUserItem from './crud_user_item';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useState, useRef} from 'react';
import { Table, Button, Modal , Form, Alert, Spinner } from 'react-bootstrap';
import ErrorMessage from '../errorHandling/errorMessage';
import CrudLocation from "./crud_location";

function AddButton(){

    const [show, setShow] = useState(false);

    const newNameRef = useRef();
    const newPwdRef = useRef();
    const confirmPwdRef = useRef();
    const [error, setError] = useState(null);
    const closeModel = () =>{setShow(false); setError(null);};
    const showModel = () => setShow(true);

    const submit = () => {

        let newname = newNameRef.current.value;
        let newpassword = newPwdRef.current.value;
        let confirmpassword = confirmPwdRef.current.value;

        if (newpassword !== confirmpassword) {
            setError("Passwords do not match!");
        }
        else if (newname.length < 4) {
            setError("The username is too short!");
        }
        else if (newname.length > 20) {
            setError("The username is too long!");
        }
        else if (newpassword.length < 4) {
            setError("The password is too short!");
        }
        else if (newpassword.length > 20) {
            setError("The password is too long!");

        }else{
            setError(null);
            let body = JSON.stringify({
                "name": newname,
                "password": newpassword
            });

            let requestOptions = {
                method: 'POST',
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: body,
                redirect: 'follow'
            };

            // window.location.reload(false)
            fetch(window.backendUrl+"/users", requestOptions)
                .then(response => response.text())
                .then(result => window.location.reload(false))
                .catch(error => alert('error', error));
        }









    };

    return (
        <>
            <style type="text/css">
                {`
                .btn-indigo {
                background-color: #6573c3;
                color: white;
                }
                `}
            </style>
            <Button onClick={showModel} variant="indigo" type="button" size="lg" style={{position: "fixed", width: "3rem", aspectRatio: "1/1", right: "5rem", bottom: "3rem", borderRadius: "50%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", display: 'flex', alignItems: 'center'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
            </Button>

            <Modal show={show} onHide={closeModel} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: "#2c387e"}}>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Username</Form.Label>
                            <Form.Control ref={newNameRef} type="text"  id="name" />
                        </Form.Group>
                        <Form.Group  className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control ref={newPwdRef} type="password"  id="password" />
                        </Form.Group>

                        <Form.Group  className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control ref={confirmPwdRef} type="password"  id="confirmpassword" />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <style type="text/css">
                        {`
                        .btn-indigo {
                        background-color: #6573c3;
                        color: white;
                        }
                        `}
                    </style>
                    <Button variant="indigo" type="button" onClick={submit}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={closeModel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


class CrudUser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users: null
        };
    }

    load_users() {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(window.backendUrl+'/users', requestOptions)
            .then((response) => response.json())
            .then((data) => {

                this.setState({users: data});
            });
    }

    componentDidMount() {
        this.load_users();

    }
    render() {

        let users_list = this.state.users;
        if (this.state.users === null) {
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", bottom: "0", left: "0", width: "100%", height: "calc(100vh - 56px)", zIndex: "100", backgroundColor: "rgba(0,0,0,0.8)"}}>
                    <Spinner animation="border" style={{color: "white"}}/>
                </div>
            );
        }
        return (
            <>
                {/*{error && <ErrorMessage>{error}</ErrorMessage>}*/}
                <div style={{padding: "2em"}}>
                    <AddButton/>
                    <Table striped hover size="sm" className="align-middle" style={{width: "90%", margin: "auto"}}>
                        <thead>
                        <tr>
                            <th>Username</th>
                            {/*<th>Change Username</th>*/}
                            {/*<th>Change password</th>*/}
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users_list.map((user, index) => <CrudUserItem name={user.name} id={user._id} pw={user.password} key={index}/>)}
                        </tbody>
                    </Table>
                </div>
            </>
        );
    }
}

export default CrudUser;