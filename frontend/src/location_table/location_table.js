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
import {LocationTableItem, FavTableItem} from './location_table_item';
import { useNavigate } from "react-router-dom";
import { Table, Button, InputGroup, FormControl, Spinner, Dropdown, DropdownButton, Container, Row , Col } from 'react-bootstrap';
class LocationTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locations: null,

            search: 1,
            filterValue: '',

            is_selecting_favourite: false,
            favLocations: null,

            mode: 0,
            sortMode: 0,

            searchValue: 'by Name',
            sortFieldValue: 'Sort by: --',
            sortOrderValue: 'Order by: --'
        };

        this.set_favourite_location = this.set_favourite_location.bind(this);
        this.remove_favourite_location = this.remove_favourite_location.bind(this);
    }

    componentDidMount() {
        this.load_locations();
        this.load_favLocations();
    }

    render() {
        if (this.state.locations === null) {
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", bottom: "0", left: "0", width: "100%", height: "calc(100vh - 56px)", zIndex: "100", backgroundColor: "rgba(0,0,0,0.8)"}}>
                    <Spinner animation="border" variant="secondary" />
                </div>
            );
        }

        let displayed_locations = this.filter_locations(this.sort(this.state.locations));

        return (
            <div style={{margin: "auto", width: "90%", padding: "2em"}}>
                <h2 style={{color: "#2c387e"}}>
                    Location Table
                    {JSON.parse(sessionStorage.getItem("userInfo")).isAdmin &&
                    <Button variant="muted" size="lg" onClick={()=> {this.refreshData()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2c387e" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                        </svg>
                    </Button>}
                </h2><br/>
                <Container>
                    <Row>
                        <Col lg={7} >
                            <InputGroup>
                                <InputGroup.Text id="name_search_box_icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24" style={{fill: "#000"}}>
                                        <path d="M 9 2 C 5.1458514 2 2 5.1458514 2 9 C 2 12.854149 5.1458514 16 9 16 C 10.747998 16 12.345009 15.348024 13.574219 14.28125 L 14 14.707031 L 14 16 L 20 22 L 22 20 L 16 14 L 14.707031 14 L 14.28125 13.574219 C 15.348024 12.345009 16 10.747998 16 9 C 16 5.1458514 12.854149 2 9 2 z M 9 4 C 11.773268 4 14 6.2267316 14 9 C 14 11.773268 11.773268 14 9 14 C 6.2267316 14 4 11.773268 4 9 C 4 6.2267316 6.2267316 4 9 4 z"></path>
                                    </svg>
                                </InputGroup.Text>
                                <DropdownButton
                                    variant="secondary"
                                    title={this.state.searchValue}
                                    id="input-group-dropdown-1"
                                >
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({search: 1, searchValue: e.target.textContent, filterValue: ''})}>by Name</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({search: 2, searchValue: e.target.textContent, filterValue: ''})}>by Latitude</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({search: 3, searchValue: e.target.textContent, filterValue: ''})}>by Longitude</Dropdown.Item>
                                </DropdownButton>
                                
                                {this.state.search===1 && 
                                <FormControl
                                    id="name_search_box"
                                    placeholder='Search by name'
                                    aria-label='name_search_box'
                                    aria-describedby='name_search_box_icon' 
                                    onChange={(e)=>{this.set_filterValue(e.target.value);}}
                                />}
                                {this.state.search===2 && 
                                <FormControl
                                    id="latitude_search_box"
                                    placeholder='Search by latitude'
                                    aria-label='latitude_search_box'
                                    aria-describedby='latitude_search_box_icon' 
                                    onChange={(e)=>{this.set_filterValue(e.target.value)}}
                                />}
                                {this.state.search===3 && 
                                <FormControl
                                    id="longitude_search_box"
                                    placeholder='Search by longitude'
                                    aria-label='longitude_search_box'
                                    aria-describedby='longitude_search_box_icon' 
                                    onChange={(e)=>{this.set_filterValue(e.target.value)}}
                                />}
                            </InputGroup>

                        </Col>
                        <br/><br/>
                        <Col lg={5}>
                            <InputGroup>
                                <InputGroup.Text id="name_sort_box_icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-filter-left" viewBox="0 0 16 16">
                                        <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                                    </svg>
                                </InputGroup.Text>
                                <DropdownButton
                                    variant="secondary"
                                    title={this.state.sortFieldValue}
                                    id="input-group-dropdown-1"
                                >
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 0, sortFieldValue: e.target.textContent})}>Sort by: Name</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 1, sortFieldValue: e.target.textContent})}>Sort by: NO2</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 2, sortFieldValue: e.target.textContent})}>Sort by: O3</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 3, sortFieldValue: e.target.textContent})}>Sort by: SO2</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 4, sortFieldValue: e.target.textContent})}>Sort by: CO</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 5, sortFieldValue: e.target.textContent})}>Sort by: PM10</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({mode: 6, sortFieldValue: e.target.textContent})}>Sort by: PM2.5</Dropdown.Item>
                                </DropdownButton>
                                <DropdownButton
                                    variant="secondary"
                                    title={this.state.sortOrderValue}
                                    id="input-group-dropdown-1"
                                >
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({sortMode: 1, sortOrderValue: e.target.textContent})}>Order by: Asc</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={(e)=>this.setState({sortMode: -1, sortOrderValue: e.target.textContent})}>Order by: Desc</Dropdown.Item>
                                </DropdownButton>
                            </InputGroup>
                        </Col>

                    </Row>
                </Container>
                <br/>
                <Table striped hover size="sm" className="align-middle">
                    <thead>
                        <tr style={{textAlign: "left"}}>
                            <th></th>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>NO2</th>
                            <th>O3</th>
                            <th>SO2</th>
                            <th>CO</th>
                            <th>PM10</th>
                            <th>PM2</th>
                        </tr>
                    </thead>
                    <tbody style={{textAlign: "left"}}>
                        {displayed_locations.map((location, index) =>
                        <tr key={'location-row-'+index}>
                            <LocationTableItem key={location.name} id={location._id} name={location.name} location={location}
                                is_selecting_favourite={this.state.is_selecting_favourite}
                                is_favourite={this.state.favLocations === null ?
                                    null : this.state.favLocations[location._id]}
                                set_favourite_location={this.set_favourite_location}
                                remove_favourite_location={this.remove_favourite_location}
                            />
                            <td>
                            </td>           
                        </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }

    load_locations() {
        fetch(window.backendUrl+'/locations')
            .then((response) => response.json())
            .then((data) => {
                this.setState({locations: data});
            });
    }

    async load_favLocations() {
        let user = sessionStorage.getItem('userInfo');
        
        if (user === null) {
            return;
        }

        const res = await fetch(`${window.backendUrl}/users/favourites`, {
            headers: {
                'authorization': `Bearer ${JSON.parse(user).token}`
            }
        });
        const { favLocations } = await res.json();
        console.log(favLocations);
        let favLocationsDict = {};
        for (let idx in favLocations) {
            let _id = favLocations[idx]._id;
            favLocationsDict[_id] = favLocations[idx];
        }
        console.log(favLocationsDict);
        this.setState({favLocations: favLocationsDict});
    }

    set_sortMode(mode) {
        this.setState({sortMode: mode});
    }

    set_filterValue(value) {
        this.setState({filterValue: value});
    }

    select_favLocations() {
        this.setState({is_selecting_favourite: true});
    }

    async set_favourite_location(id) {
        let user = sessionStorage.getItem('userInfo');

        if (id in this.state.favLocations || user === null) return false;
        else{
            const res = await fetch(`${window.backendUrl}/locations/${id}/favourite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                }
            });
            console.log(res.status);
            if (res.status == 200){
                for (let idx in this.state.locations){
                    if (this.state.locations[idx]._id === id){
                        const updatedFavLocationsDict = this.state.favLocations;
                        updatedFavLocationsDict[id] = this.state.locations[idx];
                        this.setState({ favLocations: updatedFavLocationsDict });
                        break;
                    }
                }
                return true;
            }else return false;
        }
    }

    async remove_favourite_location(id) {
        let user = sessionStorage.getItem('userInfo');

        if (!(id in this.state.favLocations) || user === null) return false;
        else{
            const res = await fetch(`${window.backendUrl}/locations/${id}/favourite`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                }
            });
            if (res.status == 204){
                const updatedFavLocationsDict = this.state.favLocations;
                delete updatedFavLocationsDict[id];
                this.setState({ favLocations: updatedFavLocationsDict });
                return true;
            }else return false;
        }
    }

    sort(locations){
        if(this.state.mode === 0){
            return this.filter_locations(this.sort_locations(locations));
        }else if(this.state.mode === 1){
            return this.filter_locations(this.sort_by_NO2(locations))
        }else if(this.state.mode === 2){
            return this.filter_locations(this.sort_by_O3(locations))
        }else if(this.state.mode === 3){
            return this.filter_locations(this.sort_by_SO2(locations))
        }else if(this.state.mode === 4){
            return this.filter_locations(this.sort_by_CO(locations))
        }else if(this.state.mode === 5){
            return this.filter_locations(this.sort_by_PM10(locations))
        }else if(this.state.mode === 6){
            return this.filter_locations(this.sort_by_PM2_5(locations))
        }
    }

    sort_by_NO2(locations){
        let sorted = [];
        for (let location of locations){
            sorted.push(location);
        }
        sorted.sort((a,b)=>{
            var x = a.pollutions[0].no2;
            var y = b.pollutions[0].no2;
            if(this.state.sortMode==1){
                return x<y?-1:1;
            }else{
                return x<y?1:-1;
            }
        });
        return sorted;

    }

    sort_by_CO(locations){
        let sorted = [];
        for (let location of locations){
            sorted.push(location);
        }
        sorted.sort((a,b)=>{
            var x = a.pollutions[0].co;
            var y = b.pollutions[0].co;
            if(this.state.sortMode==1){
                return x<y?-1:1;
            }else{
                return x<y?1:-1;
            }
        });
        return sorted;
    }

    sort_by_SO2(locations){
        let sorted = [];
        for (let location of locations){
            sorted.push(location);
        }
        sorted.sort((a,b)=>{
            var x = a.pollutions[0].so2;
            var y = b.pollutions[0].so2;
            if(this.state.sortMode==1){
                return x<y?-1:1;
            }else{
                return x<y?1:-1;
            }
        });
        return sorted;
    }

    sort_by_O3(locations){
        let sorted = [];
        for (let location of locations){
            sorted.push(location);
        }
        sorted.sort((a,b)=>{
            var x = a.pollutions[0].o3;
            var y = b.pollutions[0].o3;
            if(this.state.sortMode==1){
                return x<y?-1:1;
            }else{
                return x<y?1:-1;
            }
        });
        return sorted;
    }

    sort_by_PM10(locations){
        let sorted = [];
        for (let location of locations){
            sorted.push(location);
        }
        sorted.sort((a,b)=>{
            var x = a.pollutions[0].pm10;
            var y = b.pollutions[0].pm10;
            if(this.state.sortMode==1){
                return x<y?-1:1;
            }else{
                return x<y?1:-1;
            }
        });
        return sorted;
    }

    sort_by_PM2_5(locations){
        let sorted = [];
        for (let location of locations){
            sorted.push(location);
        }
        sorted.sort((a,b)=>{
            var x = a.pollutions[0].pm2_5;
            var y = b.pollutions[0].pm2_5;
            if(this.state.sortMode==1){
                return x<y?-1:1;
            }else{
                return x<y?1:-1;
            }
        });
        return sorted;
    }


    sort_locations(locations) {
        let sorted = [];
        for (let location of locations) {
            sorted.push(location);
        }

        // sort by name
        sorted.sort((a, b) => {
            return this.state.sortMode * a.name.localeCompare(b.name);
        });

        return sorted;
    }

    filter_locations(locations) {
        let filtered = [];
        for (let location of locations) {
            if(this.state.filterValue != ''){
                if(this.state.search===1){
                    if (location.name.toLowerCase().includes(this.state.filterValue.toLowerCase())) {
                        filtered.push(location)
                    }
                } else if(this.state.search===2){
                    if (location.lat.toString().includes(this.state.filterValue)) {
                        filtered.push(location)
                    }
                } else if(this.state.search===3){
                    if (location.long.toString().includes(this.state.filterValue)) {
                        filtered.push(location)
                    }
                }
            } else filtered.push(location)
        };
        return filtered;
    }

    refreshData(){
        let requestOptions = {
            method: 'GET'
            // redirect: 'follow'
        };
        fetch(window.backendUrl+'/locations?refreshPollutions=1', requestOptions)
            .then((response) => window.location.reload(false));


    }
}


class FavTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            is_selecting_favourite: false,
            favLocations: null
        };

        this.remove_favourite_location = this.remove_favourite_location.bind(this);
    }

    componentDidMount() {
        this.load_favLocations();
    }

    render() {
        if (this.state.favLocations === null) {
            return (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", bottom: "0", left: "0", width: "100%", height: "calc(100vh - 56px)", zIndex: "100"}}>
                    <Spinner animation="border" variant="secondary" />
                </div>
            );
        }
        
        return (
            <Table striped hover size="sm" className="align-middle">
                <thead>
                    <tr>
                        <th colspan="2" style={{textAlign: "center"}}>{((this.state.favLocations === null || this.state.favLocations.length <= 0) ? "No Favourite Locations" : "Name")}</th>
                    </tr>
                </thead>
                <tbody style={{textAlign: "left"}}>
                    {this.state.favLocations.map((location, index) =>
                        <FavTableItem key={location.name} id={location._id} name={location.name} remove_favourite_location={this.remove_favourite_location}/>
                    )}
                </tbody>
            </Table>
        );
    }

    async load_favLocations() {
        let user = sessionStorage.getItem('userInfo');
        
        if (user === null) return;
        const res = await fetch(`${window.backendUrl}/users/favourites`, {
            headers: {
                'authorization': `Bearer ${JSON.parse(user).token}`
            }
        });
        const { favLocations } = await res.json();
        this.setState({ favLocations: favLocations });
    }

    async remove_favourite_location(id) {
        let user = sessionStorage.getItem('userInfo');

        let isIdInFavLocations = false;
        let listIdx = -1;
        for (let idx in this.state.favLocations){
            if (this.state.favLocations[idx]._id === id){
                isIdInFavLocations = true;
                listIdx = idx;
                break;
            }
        }

        if (!isIdInFavLocations || user === null) return false;
        else{
            const res = await fetch(`${window.backendUrl}/locations/${id}/favourite`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(user).token}`
                }
            });
            if (res.status == 204){
                const updatedFavLocationsList = [];
                for (let idx in this.state.favLocations){
                    if (idx !== listIdx) updatedFavLocationsList.push(this.state.favLocations[idx]);
                }
                this.setState({ favLocations: updatedFavLocationsList });
                return true;
            }else return false;
        }
    }
}

export {LocationTable, FavTable};
