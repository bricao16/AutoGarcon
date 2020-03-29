import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Pencil from '../assets/pencil.png';

/*
    This Prop is used to render the cards of the Manager Menu page.
    The menu is a 2d array with the first array containing only
    the title of the food item. The second array contains the category,
    price, calories, picture and whether the item is in stock.

    getStockState is a helper function which takes in_stock property
    which is either 0 or 1 and creates the appropriate text to display.

*/
class MenuItem extends React.Component {
    getStockState(in_stock){
        if(in_stock === 0)
        {
            return "Out of Stock";
        }
        else{
            return "In Stock";
        }
    }
    render(){
        console.log(this.props)
        if(this.props.menu[1].category === this.props.category)
        {
           return(
                <Col sm={6} className="p-3">
                    <Card className="text-center"> { /* a header is the item name and a clickable edit pencil */}
                        <Card.Header style={cardHeaderStyle}>{this.props.menu[0]} 
                            <div onClick={() => this.ToggleNewItem() }>  
                                <img src={Pencil} style ={imagePencil} alt='Pencil Gray clip art' />
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p style={{margin: "0", padding: "0.3em"}}>${this.props.menu[1].price} </p>
                            <p style={{margin: "0", padding: "0.3em"}}>Calories: {this.props.menu[1].calories} </p>
                            <p style={{margin: "0", padding: "0.3em"}}>{this.props.menu[1].picture} </p>
                           <i> <p style={{margin: "0", padding: "0.3em"}}>{this.getStockState(this.props.menu[1].in_stock)} </p></i>
                           
                        </Card.Body>
                    </Card>
                </Col>
            ) 
        }
        else{
            return (
                <p></p>
             )
        }
    }
}

const imagePencil = {
    'width':'auto',
    'height':'2vw',
    'paddingLeft':'1em'
}
const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff',
    'fontFamily': 'Kefa'
};

export default MenuItem;