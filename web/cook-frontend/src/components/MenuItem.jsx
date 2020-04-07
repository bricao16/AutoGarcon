import React from "react";
import Card from 'react-bootstrap/Card';

/*
    This Prop is used to render the cards of the Manager Menu page.
    The menu is a 2d array with the first array containing only
    the title of the food item. The second array contains the category,
    price, calories, picture and whether the item is in stock.

    getStockState is a helper function which takes in_stock property
    which is either 0 or 1 and creates the appropriate text to display.

    NewItemForm is a callback to create a new item form when the edit 
    button is click for a particular item



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
    //callback to newitemform when clicked edit button
    NewItemForm(e) {
        if (typeof this.props.onNew === 'function') {
            this.props.onNew(this.props);
        }
    }
    render(){
        if(this.props.menu[1].category === this.props.category)
        {
           return(
                <Card className="text-center m-2" style={itemStyle}> { /* a header is the item name and a clickable edit pencil */}
                    <Card.Header style={cardHeaderStyle}>{this.props.menu[0]} 
                    </Card.Header>
                    <Card.Body>
                        <p style={{margin: "0", padding: "0.3em"}}>${this.props.menu[1].price} </p>
                        <p style={{margin: "0", padding: "0.3em"}}>Calories: {this.props.menu[1].calories} </p>
                        <p style={{margin: "0", padding: "0.3em"}}>{this.props.menu[1].picture} </p>
                        <i> <p style={{margin: "0", padding: "0.3em"}}>{this.getStockState(this.props.menu[1].in_stock)} </p></i>
                        <div onClick={() => this.NewItemForm() }>  
                            <button className="btn btn-outline-dark btn-sm"> <i className='fas fa-edit'></i> </button>
                        </div>
                    </Card.Body>
                </Card>
            ) 
        }
        else{
            return (
                <p></p>
             )
        }
    }
}

const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff',
    'fontFamily': 'Kefa'
};
const itemStyle = {
    'width':'200px'
}

export default MenuItem;