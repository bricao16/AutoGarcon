import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Menu(props) {
    return (
        <Col sm={4} className="p-3">

            <Card className="text-center">
                <Card.Header style={cardHeaderStyle}>Menu</Card.Header>
                <Card.Body>
                   { <Card.Title>{props.menuItem.type}</Card.Title>}
                    
                    {
                    props.menuItem.items.map((item, key) => (
                        <div style={itemStyle}>
                           
                            <p style={{margin: "0", padding: "0.8em"}}>{item.item}</p>
                        </div>
                    ))
                }
                </Card.Body>
            </Card>
        </Col>
    )
}

const itemStyle = {
    display: "flex",
    borderBottom: "grey solid 1px",
};

var cardHeaderStyle = {
    'background-color': '#0b658a',
    'color': '#ffffff'
};

export default Menu;