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
import {useState} from 'react';

import { Table, Button, Modal , Form, Alert } from 'react-bootstrap';



function EditButton({id, name, long, lat}){

    const [show, setShow] = useState(false);

    const closeModel = () => setShow(false);
    const showModel = () => setShow(true);

    const submit = () => {

        let newname = document.querySelector("#name").value;
        let newlong = document.querySelector("#long").value;
        let newlat = document.querySelector("#lat").value;

        let myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");

        let body = JSON.stringify({
           "name": newname,
            "long": parseFloat(newlong),
            "lat": parseFloat(newlat)
        });

        let requestOptions = {
            method: 'PATCH',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: body,
            redirect: 'follow'
        };

        fetch(window.backendUrl+"/locations/"+id, requestOptions)
            .then(response => response.text())
            .then(result => window.location.reload(false))
            .catch(error => alert('error', error));

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
                    <Modal.Title style={{color: "#2c387e"}}>Edit Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" defaultValue={name} id="name" />

                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control type="text" defaultValue={long} id="long" />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control type="text" defaultValue={lat} id="lat"/>
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
        let user = sessionStorage.getItem('userInfo');

        let requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                'authorization': `Bearer ${JSON.parse(user).token}`
            }),
            body: "locId="+encodeURIComponent(id),
            redirect: 'follow'
        };

        fetch(window.backendUrl+"/locations/"+id, requestOptions)
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

class CrudLocationItem extends React.Component {



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
        let long = this.props.long;
        let lat = this.props.lat;
        let id = this.props.id;
        return (
            <>
            <tr>
                <td>{name}</td>
                <td>{long}</td>
                <td>{lat}</td>
                <td><EditButton id={id} name={name} long={long} lat={lat} /></td>
                <td><DeleteButton id={id}  /></td>


            </tr>


            </>


        );


    }
}

export default CrudLocationItem;