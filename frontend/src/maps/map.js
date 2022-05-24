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

import { GoogleMap, LoadScript, useLoadScript } from "@react-google-maps/api";
import { Button, Container, Spinner, Nav, Offcanvas } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import LocationMarker from './locationMarker';
import {LocationTable, FavTable} from '../location_table/location_table.js';

function Map(props){
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBlAfRLhVvB-wiCi7gcqfOZ5r29SlQ8NBc"
    });

    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [isLocationTableOpened, setIsLocationTableOpened] = useState(false);
    const [googleMap, setGoogleMap] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(11);
    const [locations, setLocations] = useState([]);
    const [fav, setFav] = useState(false);
    const HONG_KONG_CENTER = useMemo(()=>({lat: 22.3379456, lng: 114.1571584}), []);
    const MAP_STYLE = useMemo(
        ()=>({
            width: "100%",
            height: "calc(100vh - 56px)"
        }),
        []
    );

    const onMapLoaded = (map)=>{
        setGoogleMap(map);
    }

    const onMapZoomChanged = ()=>{
        if (googleMap) setZoomLevel(googleMap.getZoom());
    }

    const findFav = () =>{
        let user = sessionStorage.getItem('userInfo');

        async function fetchFav(){
            setIsLocationLoading(true);
            const res = await fetch(`${window.backendUrl}/users/favourites`, {
            headers: {
                'authorization': `Bearer ${JSON.parse(user).token}`
            }
            })
            const data = await res.json();
            setLocations(data['favLocations']);
            setIsLocationLoading(false);
        }
        
        fetchFav();
    }

    const findAll = () =>{
        async function fetchLocations() {
            setIsLocationLoading(true);
            const res = await fetch(window.backendUrl+'/locations');
            const data = await res.json();
            console.log(data);
            setLocations(data);
            setIsLocationLoading(false);
        }
        fetchLocations();
    }

    useEffect(()=>{
        async function fetchLocations() {
            setIsLocationLoading(true);
            const res = await fetch(window.backendUrl+'/locations');
            const data = await res.json();
            console.log(data);
            setLocations(data);
            setIsLocationLoading(false);
        }
        fetchLocations();
    }, []);

    return (
        <Container fluid style={{padding: "0", position: "fixed", left: "0", top: "56px"}}>
            {!(isLoaded && !isLocationLoading) && 
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", bottom: "0", left: "0", width: "100%", height: "calc(100vh - 56px)", zIndex: "100", backgroundColor: "rgba(0,0,0,0.8)"}}>
                    <Spinner animation="border" style={{color: "white"}}/>
                </div>
            }
            {isLoaded &&
                <GoogleMap  onLoad={onMapLoaded} onZoomChanged={onMapZoomChanged} clickableIcons={false} zoom={11} center={HONG_KONG_CENTER} mapContainerStyle={MAP_STYLE}>
                    {locations.map((location, idx)=>{
                        return <LocationMarker key={"location-marker-"+location._id} id={location._id} position={{lat: location.lat, lng: location.long}} name={location.name} address={location.address}></LocationMarker>
                    })}
                </GoogleMap>
            }

            <Button onClick={()=>setIsLocationTableOpened(true)}variant="danger" type="button" size="sm" style={{position: "fixed", width: "3rem", aspectRatio: "1/1", right: "5rem", bottom: "3rem", borderRadius: "50%", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                </svg>
            </Button>

            <Offcanvas onHide={()=>setIsLocationTableOpened(false)} backdrop={false} show={isLocationTableOpened} placement="end">
                <br/><br/><br/>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{color: "#2c387e"}}><b>My Favourites</b></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body as={Container}>
                    <div className="d-grid gap-2">
                        <style type="text/css">
                            {`
                            .btn-indigo {
                            background-color: #6573c3;
                            color: white;
                            }
                            `}
                        </style>
                         <Button variant="indigo" onClick={findFav}>
                             Show My Favourite Only
                         </Button>
                         <Button variant="indigo" onClick={findAll}>
                             Show All Locations
                         </Button>
                     </div><br/>
                    <FavTable/>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    );
}

export default Map;