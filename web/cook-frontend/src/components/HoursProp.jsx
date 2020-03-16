import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
/*This prop contains the hours the resturant
is open and close. 
This data is pulled from the 
MHours component 
Type = weekday/ weekend etc*/
function Hours(props) {
    return (
        <Col sm={4} className="p-3">
            <Card className="text-center">
                <Card.Header style={cardHeaderStyle}>Hours</Card.Header>
                <Card.Body>
                   <Card.Title>{props.hoursType.type}</Card.Title>
                    {
                    props.hoursType.items.map((item, key) => (
                        <div style={itemStyle}>
                            <p style={{margin: "0", padding: "0.8em"}}>open: {item.open}</p>
                            <p style={{margin: "0", padding: "0.8em"}}>close: {item.close}</p>
                        </div>
                    ))
                }
                </Card.Body>
            </Card>
        </Col>
    )
}

const itemStyle = {
    'display': 'flex',
    'borderBottom': 'grey solid 1px',
};

const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff'
};

export default Hours;