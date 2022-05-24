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
import { Button } from 'react-bootstrap';

function LocationTableItem({ id, name, is_favourite, set_favourite_location, remove_favourite_location, location }) {
    const toggleFavoutire = async ()=>{
        let status = false;
        if (!is_favourite) status = await set_favourite_location(id);
        else status = await remove_favourite_location(id);
        console.log(status);
    }

    return (
        <>
            <td>
                {
                    //is_selecting_favourite &&
                    <Button variant="muted" onClick={toggleFavoutire}>
                        {
                            (is_favourite ? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f44336" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z"/>
                                </svg>
                                : 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
                                    <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                </svg>)
                        }
                    </Button>
                }
            </td>
            <td>{name}</td>
            <td>{location.lat}</td>
            <td>{location.long}</td>
            {location.pollutions[0].no2==null?<td>N/A</td>:<td>{location.pollutions[0].no2}</td>}
            {location.pollutions[0].o3==null?<td>N/A</td>:<td>{location.pollutions[0].o3}</td>}
            {location.pollutions[0].so2==null?<td>N/A</td>:<td>{location.pollutions[0].so2}</td>}

            {location.pollutions[0].co==null?<td>N/A</td>:<td>{location.pollutions[0].co}</td>}
            {location.pollutions[0].pm10==null?<td>N/A</td>:<td>{location.pollutions[0].pm10}</td>}
            {location.pollutions[0].pm2_5==null?<td>N/A</td>:<td>{location.pollutions[0].pm2_5}</td>}
            
        </>
    );
}

function FavTableItem({ id, name, remove_favourite_location }) {
    const removeFavLocation = async () =>{
        const status = await remove_favourite_location(id);
        console.log(status);
    }

    return (
        <tr>
            <td>
                {
                    <Button variant="muted" onClick={removeFavLocation}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </Button>
                }
            </td>
            <td>{name}</td>
        </tr>
    );
}

export {LocationTableItem, FavTableItem};