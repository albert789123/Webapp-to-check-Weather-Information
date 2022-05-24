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

import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useState} from 'react';
import { Table, Button, Modal , Form, Alert } from 'react-bootstrap';
import ErrorMessage from '../errorHandling/errorMessage';

function EditButton({id, name, pw}){

    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);
    const closeModel = () =>{setShow(false); setError(null);};
    const showModel = () => setShow(true);

    const submit = () => {

        let newname = document.querySelector("#name").value;
        let newpassword = document.querySelector("#password").value;
        let confirmpassword = document.querySelector("#confirmpassword").value;
        let user = sessionStorage.getItem('userInfo');
        // if(newpw == "" || newpw == null){
        //     newpw= pw;
        // }
        if (newpassword !== confirmpassword) {
            setError("Passwords do not match!");
        }
        else if(!newname){
            setError("Username can not be null!");
        }
        else if (newpassword && newpassword.length < 4) {
            setError("The password is too short!");
        }
        else if (newpassword && newpassword.length > 20) {
            setError("The password is too long!");

        }else{
            let body = JSON.stringify({
                "name": newname,
                "password": newpassword
            });

            let requestOptions = {
                method: 'PATCH',
                headers: new Headers({
                    "Content-Type": "application/json",
                    'authorization': `Bearer ${JSON.parse(user).token}`
                }),
                body: body,
                redirect: 'follow'
            };

            // window.location.reload(false)
            fetch("http://localhost:5000/users/"+id, requestOptions)
                .then(response => response.text())
                .then(result => window.location.reload(false))
                .catch(error => alert('error', error));
        }



    };

    return (
        <>
            <Button variant="muted" onClick={showModel}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                </svg>
            </Button>

            <Modal show={show} onHide={closeModel} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: "#2c387e"}}>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" defaultValue={name} id="name" />

                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"  id="password" />
                        </Form.Group>

                        <Form.Group  className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control  type="password"  id="confirmpassword" />
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
                        Save Changes
                    </Button>
                    <Button variant="secondary" onClick={closeModel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteButton({id}) {

    const del = () =>{
        let myHeaders = new Headers();
        let user = sessionStorage.getItem('userInfo')


        let requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                'authorization': `Bearer ${JSON.parse(user).token}`
            }),
            body: "locId="+encodeURIComponent(id),
            redirect: 'follow'
        };

        fetch(window.backendUrl+"/users/"+id, requestOptions)
            .then(response => response.text())
            .then(result => window.location.reload(false))
            .catch(error => alert('error', error));
    }


    return(
        <>
            <Button variant="muted" onClick={del}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
            </Button>
        </>
    );

}

// function CrudUserItem(props){
//
//     return(
//         <>
//         <tr>
//             <td>{props.name}</td>
//             <td><EditUsername name={props.name}/></td>
//             <td><EditPassword name={props.name}/></td>
//             <td><DeleteButton name={props.name}/></td>
//         </tr>
//         </>
//     );
// }

class CrudUserItem extends React.Component {



    constructor(props){
        super(props);
        this.state = {
            show: false
        };

    }

    edit_data(){
        this.setState({show: true});
    }

    close_dialog(){
        this.setState({show: false});
    }



    render() {

        let name = this.props.name;
        let id = this.props.id;
        let pw = this.props.pw;
        return (
            <>
                <tr>
                    <td>{name}</td>

                    <td><EditButton id={id} name={name} pw={pw}/></td>
                    {/*<td><EditPassword id={id} /></td>*/}
                    <td><DeleteButton id={id}  /></td>


                </tr>


            </>


        );


    }
}

export default CrudUserItem;
