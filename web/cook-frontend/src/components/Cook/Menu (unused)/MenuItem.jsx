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
  constructor(props) {
    super(props);
    this.state = {};
  }

  getStockState(in_stock){
    if(in_stock === 0) {
      return "Out of Stock";
    }
    else {
      return "In Stock";
    }
  }

  //callback to newitemform when clicked edit button
  NewItemForm(e) {
    if (typeof this.props.onNew === 'function') {
      var props = {
        type: "existing",
        item_id: this.props.menu[1].item_id,
        menu: {
          "name": this.props.menu[0],
          "category": this.props.menu[1].category,
          "price" : this.props.menu[1].price,
          "calories": this.props.menu[1].calories,
          "in_stock": this.props.menu[1].in_stock,
          "description": this.props.menu[1].description
        }
      }
        
      this.props.onNew(props);
    }
  }

  render(){
      //get the styles
      const secondary = this.props.secondary;
      const font = this.props.font;

      if(this.props.menu[1].category === this.props.category)
      {
          return(
          <>
            
            <Card className="text-center m-2" style={itemStyle}>

                <Card.Header style ={{'fontFamily' :font, 'backgroundColor': secondary,  'textAlign' : 'center','display': 'flex'}}>
                  {this.props.menu[0]}
                </Card.Header>
                <div onClick={() => this.NewItemForm()} style={editButtonStyle} className='p-1'>
                   <i className='fas fa-edit'/> 
                </div>
                <Card.Body style={{'cursor':'pointer'}}>
                  <p style={{margin: "0", padding: "0.3em"}}>${this.props.menu[1].price} </p>
                  <p style={{margin: "0", padding: "0.3em"}}>Calories: {this.props.menu[1].calories} </p>
                  <i> <p style={{margin: "0", padding: "0.3em"}}>{this.getStockState(this.props.menu[1].in_stock)} </p></i>
                </Card.Body>
            </Card>
          </>
        ) 
      }
      else {
        return (
          <p></p>
        )
      }
  }
}


const itemStyle = {
  'width':'200px'
};
const editButtonStyle = {
  'cursor':'pointer',
  'color': 'white',
  'position': 'absolute',
  'right': '0'
};

export default MenuItem;