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

import { Col, Container, Form, Row } from "react-bootstrap";

const GraphQL = ()=>{

    return (
        <Container style={{padding: "2em", margin:"auto", width: "90%"}}>
            <Row>
                <Col style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                    <h4 style={{color: "#2c387e"}}>Available GraphQL queries through <code>GET /graphql</code> or <code>POST /graphql</code></h4>
                    <br/>
                    <code style={{textAlign: "start", width: "fit-content", color: "orange", backgroundColor: "#000000", padding: "1rem", borderRadius: "0.5rem"}}>
                        &emsp;query&#123;<br/>
                        &emsp;&emsp;locations &#123;<br/>
                        &emsp;&emsp;&emsp;name : String!<br/>
                        &emsp;&emsp;&emsp;long : Float!<br/>
                        &emsp;&emsp;&emsp;lat : Float!<br/>
                        &emsp;&emsp;&emsp;address: String<br/><br/>
                        &emsp;&emsp;&emsp;pollutions &#123;<br/>
                        &emsp;&emsp;&emsp;&emsp;datetime : DateTime!<br/>
                        &emsp;&emsp;&emsp;&emsp;no2 : Float!<br/>
                        &emsp;&emsp;&emsp;&emsp;o3 : Float!<br/>
                        &emsp;&emsp;&emsp;&emsp;so2 : Float!<br/>
                        &emsp;&emsp;&emsp;&emsp;co : Float!<br/>
                        &emsp;&emsp;&emsp;&emsp;pm10 : Float!<br/>
                        &emsp;&emsp;&emsp;&emsp;pm2_5 : Float!<br/>
                        &emsp;&emsp;&emsp;&#125;<br/><br/>
                        &emsp;&emsp;&emsp;comments &#123;<br/>
                        &emsp;&emsp;&emsp;&emsp;user : String!<br/>
                        &emsp;&emsp;&emsp;&emsp;comment : String!<br/>
                        &emsp;&emsp;&emsp;&emsp;emotion : String!<br/>
                        &emsp;&emsp;&emsp;&#125;<br/>
                        &emsp;&#125;&emsp;<br/><br/>

                        &emsp;&emsp;location(locId : String!) &#123;<br/>
                        &emsp;&emsp;&emsp;#Same fields as locations<br/>
                        &emsp;&emsp;&#125;<br/>
                        &emsp;&#125;
                    </code>
                </Col>
            </Row>
        </Container>
    );
}

export default GraphQL;