import React from "react";
import Card from 'react-bootstrap/Card';

/*This prop is used to render the stats page for the manager view
    it is the default view when the manager logs in. Each type of statistic
    is desplayed on a seperate card. This data is pulled in the MStats component.
*/

function StatsProp(props) {
    return (
        <Card className="text-center m-2" style={itemStyle}>
            <Card.Header style={cardHeaderStyle}>Stats</Card.Header>
            <Card.Body>
            {/* for each type of statistic create a card */}
                { <Card.Title>{props.statsType.type}</Card.Title>}
                
                {
                /* render each component of that stat in the card */
                props.statsType.items.map((item, key) => (
                    <div style={statStyle}>
                        <p style={{margin: "0", padding: "0.8em"}}>{item.title}: </p>
                        <p style={{margin: "0", padding: "0.8em"}}>{item.quantity} /day</p>
                    </div>
                ))
            }
            </Card.Body>
        </Card>
    )
}

const statStyle = {
    'border-bottom': 'grey solid 1px'
};
const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff'
};
const itemStyle = {
    'border-bottom': 'grey solid 1px',
    'width':'200px'
};

export default StatsProp;