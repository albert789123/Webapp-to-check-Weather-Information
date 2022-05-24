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
import CrudLocationItem from './crud_location_item';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {useState} from 'react';
import { Table, Button, Modal , Form, Alert, Spinner, Container, Row } from 'react-bootstrap';


function AddButton(){

    const [show, setShow] = useState(false);

    const closeModel = () => setShow(false);
    const showModel = () => setShow(true);

    const submit = () => {

        let newname = document.querySelector("#name").value;
        let newlong = document.querySelector("#long").value;
        let newlat = document.querySelector("#lat").value;
        let newAddr = document.querySelector("#addr").value;

        let myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");

        let body = JSON.stringify({
            "name": newname,
            "long": parseFloat(newlong),
            "lat": parseFloat(newlat),
            "address": newAddr
        });

        let requestOptions = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json"
            }),
            body: body,
            redirect: 'follow'
        };

        fetch(window.backendUrl+"/locations", requestOptions)
            .then(response => response.text())
            .then(result => window.location.reload(false))
            .catch(error => alert('error', error));

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
                    <Modal.Title style={{color: "#2c387e"}}>Add Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text"  id="name" />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control type="text"  id="long" />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control type="text"  id="lat"/>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text"  id="addr"/>
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



class CrudLocation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            locations: null,
            isLoading: true,
            updatedAt: null
        };
    }

    async load_locations() {
        this.setState({ isLoading: true });
        const res = await fetch(window.backendUrl+'/locations')
        this.setState({ 
            locations: (await res.json()),
            isLoading: false,
            updatedAt: Date.now()
        })
    }

    async refresh_pollution_data(){
        this.setState({isLoading: true});
        const res = await fetch(window.backendUrl+'/locations?refreshPollution=1');
        this.setState({
            locations: (await res.json()),
            isLoading: false,
            updatedAt: Date.now()
        });
    }

    componentDidMount() {
        this.load_locations();

    }
    render() {
        let updatedAtString = "";
        if (this.state.updatedAt){
            const datetime = new Date(this.state.updatedAt);
            const hourString = (datetime.getHours() < 10 ? `0${datetime.getHours()}` : `${datetime.getHours()}`);
            const minuteString = (datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : `${datetime.getMinutes()}`);
            const secondString = (datetime.getSeconds() < 10 ? `0${datetime.getSeconds()}` : `${datetime.getSeconds()}`);
            updatedAtString = datetime.toLocaleDateString()+" "+hourString+":"+minuteString+":"+secondString;
        }

        if (this.state.isLoading) {
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", bottom: "0", left: "0", width: "100%", height: "calc(100vh - 56px)", zIndex: "100", backgroundColor: "rgba(0,0,0,0.8)"}}>
                    <Spinner animation="border" style={{color: "white"}}/>
                </div>
            );
        }
        return (
            <div style={{padding: "2em"}}>
                <Button onClick={this.refresh_pollution_data.bind(this)} style={{backgroundColor: "#6573c3", color: "white"}}>Refresh Pollution Data</Button>
                <br/><br/>
                <p>Last update: {updatedAtString}</p>
                <AddButton/>
                <Table striped hover size="sm" className="align-middle" style={{width: "90%", margin: "auto"}}>
                    <thead>
                        <tr>
                            <th>Location name</th>
                            <th>Longitude</th>
                            <th>Latitude</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.locations.map((location, index) => <CrudLocationItem name={location.name} long={location.long} lat={location.lat} id={location._id} key={index}/>)}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default CrudLocation;