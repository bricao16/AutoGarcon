import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuItem from './MenuItem';
import NewItem from './NewItem';

/*
  This component is used to render menu information which
  is pulled from the database in MTasks. 

  The menu and unique categories are put into arrays.
    If we are on the main menu we just display the categories.
  
    If a category is click then we render the menu items with
    that category assigned. 
      If the edit button is clicked on a particular item then
      the new form will render with prefilled info from the item

    If the "create new" button is clicked then a new form with
    no prefilled information will render
  
  in the state renderCategory is what component we are on.
  render() checks if the database was properly loaded
  then it will map the returned menu to a 2d array

  renderMenu() will create the call the MenuProp for each 
  item making a Card for each to display.
*/
class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menu:[],
      categories: [],
      renderCategory: "main",
      newItem: false,
      newItemPrefill: 
                        {
                        type:"default",
                        menu:
                        [ "Name",
                        {'category':"Category",
                        'price' : "Price",
                        'calories': "Calories",
                        'in_stock': 0}
                        ]
                      }
                      
    };
  }

  //change the category of menu to render
  changeCategory = (category) => {
      this.setState({
        renderCategory: category
    })
  }
  //change the newItem state.  Mainly for going back to the main menu page
  setNewItem = (state) => {
      this.setState({
        newItem: state
    })
  }
   //toggle between creating a new menu item and not
  toggleNewItem= (itemProperties) => {

      this.setState({
        newItem: !this.state.newItem,
        newItemPrefill:itemProperties
    })
    //if the new item prefill is default set to default prefill
    if(itemProperties === "default")
    {
      this.resetNewItem();
    }  
  }
  /* Aggregate all the menu categories onto cards and call the change which menu to display is clicked */
  renderMenuCategories(){
    return this.state.categories.map((item) =>
      <Col sm={6} className="p-3" style={{'minWidth':'225px'}}>
        <Card className="text-center" >
          <div onClick={() => this.changeCategory(item) }>                     
            <Card.Header style={cardHeaderStyle}>{item}</Card.Header>
          </div>
        </Card>
      </Col>  
    );
  }
  //creates default placeholders for the new item
  resetNewItem(){
    this.setState({
      newItemPrefill:{
                        type:"default",
                        menu:
                        [ "Name",
                        {'category':"Category",
                        'price' : "Price",
                        'calories': "Calories",
                        'in_stock': 0}
                        ]
                      }
    })
  }
  //render the menu prop of the current category 
  renderMenu(){
    //onNew is a callback passed to call the new item form if it is edit is clicked
    return this.state.menu.map((item, key) =>
        <MenuItem menu={item} category={this.state.renderCategory} onNew={this.toggleNewItem.bind(this)}/>
    );
  }
  //generate form for new item with prefilled of whats already on the menu for this item
  newItemForm(){
      return <NewItem prefill = {this.state.newItemPrefill}/>
  }

  // Default render method
  render() {
    //clear the menu each time we load
    this.state.menu = [];
    const {menu,categories,renderCategory, newItem} = this.state;
    const menuJSON = this.props.menu;

    //map the menu json from Mtasks to an array
    Object.keys(menuJSON).forEach(function(key) {
          menu.push([key ,menuJSON[key]]);
    });

    //create a list of all unique categories of food/drink
    for (const [index, value] of menu.entries()) {
        if(categories.indexOf(value[1].category) === -1){
          categories.push( value[1].category)
        }
    }
    //if the render category is main then render all the categories of food/drink of this resturant
    if(renderCategory === "main" && newItem === false)
    {
      return (
          <Container>
            <div style={backgroundStyle}>
            <h2 style={mainMenuHeaderStyle}>
              Menu
            </h2>
              <Container fluid style={{'minHeight': '70vh'}}>
                <div className="d-flex flex-wrap">
                    {this.renderMenuCategories()}
                    <Col sm={6} className="p-3"> {/*add a create new category option*/}
                      <Card className="text-center" >
                        <div onClick={() => this.toggleNewItem("default") }>                     
                          <Card.Header style={cardHeaderStyle, createNewStyle}>Create New</Card.Header>
                        </div>
                      </Card>
                    </Col>  
                </div>
              </Container>
            </div>
          </Container>
      );
    }
    else if (renderCategory !== "main" && newItem === false){
      //render the proper menu based on the current category
      return ( 
        <Container>
          <div style={backgroundStyle}>
            <h2 style ={categoryHeaderStyle}>
              <button type="button" onClick={() => this.changeCategory("main") } class="btn btn-outline-light m-2">Back</button>
              <div style={menuTextStyle}>{renderCategory}</div>
            </h2>
            <Container fluid style={{'min-height': '70vh'}}>
              <div className="d-flex flex-wrap">
                {this.renderMenu()}                
              </div>
              <Col sm={12} className="p-3"> {/*add a create new item option*/}
                <Card className="text-center" >
                  <button className="btn btn-link m-2" onClick={() =>  this.toggleNewItem("default") }>                     
                    Create New
                  </button>
                </Card>
              </Col> 
            </Container> 
          </div>
        </Container>
      );
    }
    else{
      //render a form for the new menu item(s)
      return ( 
        <Container>
          <div style={backgroundStyle}>
            <h2 style ={categoryHeaderStyle}>
              <button type="button" onClick={() => {this.changeCategory("main"); this.setState({menu:[]}); this.setNewItem(false);}} className="btn btn-outline-light m-2">Back</button>
              <div style={menuTextStyle}>Menu Item</div>
            </h2>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div style={managerStyle}>
                    {this.newItemForm()}
                  </div>
                </Container>
              </Col>
            </Container> 
          </div>
        </Container>
      );
    }
  
  }
}

const managerStyle = {
  'display': "flex",
  'fontSize': "1.2em",
  'justifyContent': "space-between",
  'margin': "30px",
  'marginTop': "0",
  'flexWrap': "wrap",
  'fontFamily': 'Kefa'
};
const backgroundStyle = {
  'backgroundColor': '#f1f1f1'
};
const createNewStyle = {
  'opacity' : '.9'
};
const cardHeaderStyle = {
  'backgroundColor': '#0b658a',
  'color': '#ffffff',
  'fontFamily': 'Kefa'
};
const menuHeaderStyle = {
  'backgroundColor': '#102644',
  'color': '#ffffff',
  'fontFamily': 'Kefa',
  'textAlign' : 'center',
  'height':'54px'
};
const mainMenuHeaderStyle = {
  'backgroundColor': '#102644',
  'color': '#ffffff',
  'fontFamily': 'Kefa',
  'textAlign' : 'center',
  'height':'54px',
  'paddingTop':'8px'
}
const categoryHeaderStyle = Object.assign({
  'display': 'flex',
}, menuHeaderStyle);
const menuTextStyle = {
  'flex': '1',
  'paddingRight': '69px',
  'paddingTop': '8px'
};

export default Menu;