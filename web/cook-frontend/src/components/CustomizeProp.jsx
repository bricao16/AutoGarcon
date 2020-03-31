import React from "react";
import Card from 'react-bootstrap/Card';

/*This prop is used to render the stats page for the manager view
    it is the default view when the manager logs in. Each type of statistic
    is desplayed on a seperate card. This data is pulled in the MStats component.
*/

function CustomizeProp(props) {
    return (
        <Card className="text-center m-2" style={itemStyle}>
            <Card.Header style={cardHeaderStyle}>Customize</Card.Header>
            <Card.Body>
            {/* for each type of statistic create a card */}
                { <Card.Title>{props.customizeType.type}</Card.Title>}
                
                {
                /* render each component of that stat in the card */
                props.customizeType.items.map((item, key) => (
                    <div style={customizeStyle}>
                        <p style={{margin: "0", padding: "0.8em"}}>{item.title} <br></br> <br></br> 
                        <button> <i class='fas fa-edit'></i> </button>
                     </p>
                    </div>
                ))
            }
            </Card.Body>
        </Card>
    )
}

const customizeStyle = {
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

export default CustomizeProp;