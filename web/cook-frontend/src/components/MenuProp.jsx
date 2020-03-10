import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function MenuProp(props) {
    return (
        <Col sm={4} className="p-3">

            <Card className="text-center">
                <Card.Header style={cardHeaderStyle}>Menu</Card.Header>
                <Card.Body>
                   { <Card.Title>{props.menuType.type}</Card.Title>}
                    
                    {
                    props.menuType.items.map((item, key) => (
                        <div style={itemStyle}>
                            <p style={{margin: "0", padding: "0.8em"}}>{item.item} </p>
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
    'backgroundColor': '#0b658a',
    'color': '#ffffff'
};

export default MenuProp;