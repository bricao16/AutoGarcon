import React from "react";
import Card from 'react-bootstrap/Card';
/*This prop contains the hours the resturant
is open and close. 
This data is pulled from the 
MHours component 
Type = weekday/ weekend etc*/
function Hours(props) {
    return (
        <Card className="text-center m-2" style={itemStyle}>
            <Card.Header style={cardHeaderStyle}>{props.hoursType.type}</Card.Header>
            <Card.Body>
    
                {
                props.hoursType.items.map((item, key) => (
                    <div style={infoStyle}>
                        <p style={{margin: "0", padding: "0.8em"}}>open: {item.open}</p>
                        <p style={{margin: "0", padding: "0.8em"}}>close: {item.close}</p>
                    </div>
                ))
            }
            </Card.Body>
        </Card>
    )
}

const infoStyle = {
    'display': 'flex',
    'borderBottom': 'grey solid 1px',
    'fontFamily': 'Kefa'
};
const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff',
    'fontFamily': 'Kefa'
};
const itemStyle = {
    'border-bottom': 'grey solid 1px',
    'width':'200px'
};

export default Hours;