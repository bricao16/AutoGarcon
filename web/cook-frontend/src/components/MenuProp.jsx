import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
/*
    This Prop is used to render the cards of the Manager Menu page.
    The menu is a 2d array with the first array containing only
    the title of the food item. The second array contains the category,
    price, calories, picture and whether the item is in stock.

    getStockState is a helper function which takes in_stock property
    which is either 0 or 1 and creates the appropriate text to display.

*/
function MenuProp(props) {

    return (
        <Col sm={4} className="p-3">

            <Card className="text-center">
                <Card.Header style={cardHeaderStyle}>{props.menu[0]}</Card.Header>
                <Card.Body>
                   { <Card.Title>{props.menu[1].category}</Card.Title>}
                    <p style={infoStyle}>${props.menu[1].price} </p>
                    <p style={infoStyle}>Calories: {props.menu[1].calories} </p>
                    <p style={infoStyle}>{props.menu[1].picture} </p>
                   <i> <p style={infoStyle}>{getStockState(props.menu[1].in_stock)} </p></i>
                </Card.Body>
            </Card>
        </Col>
    )
}

// Determines whether data shows an item in stock or out of stock
function getStockState(in_stock){
    if(in_stock === 0)
    {
        return "Out of Stock";
    }
    else{
        return "In Stock";
    }
}
const infoStyle = {
    'margin': '0',
    'padding': '0.3em'
};

const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff'
};

export default MenuProp;