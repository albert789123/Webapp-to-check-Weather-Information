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

import { Marker, OverlayView } from '@react-google-maps/api';
import { useState } from 'react';
import { Card, CloseButton, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LocationMarker({ id, position, name, address, disablePopup }){
    const MARKER_SVG = "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z";

    const [openOverlay, setOpenOverlay] = useState(false);
    
    return (
        <>
            <Marker onClick={()=>setOpenOverlay(true)} position={position} icon={{
                path:MARKER_SVG,
                fillColor: "red",
                fillOpacity: 1,
                scale: 1.3,
                strokeColor: "#8F0000",
                strokeWeight: 2,
            }} />
            {!disablePopup && openOverlay && 
                <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                    <Card>
                        <Card.Header as="h6">
                            <div className="align-middle" style={{textAlign: "left"}}>
                            <CloseButton onClick={()=>setOpenOverlay(false)}/>
                            <span style={{padding: "5px"}}>{name}</span>
                            <Button as={Link} variant="muted" size="sm" to={{pathname: `/details/${id}`}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                </svg>
                            </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>{address}</Card.Text>
                        </Card.Body>
                    </Card>
                </OverlayView>
            }
        </>
        
    );
}

export default LocationMarker;

