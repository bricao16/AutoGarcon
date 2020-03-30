import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuItem from './MenuItem';
import NewItem from './NewItem';

/*
  This component is used to get the menu information
  from the database for the appropriate resturant. 
  
  componentDidMount() connects to the database and puts
  the information in out state.
  
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
      error: null,
      isLoaded: false,
      menuJSON: [],
      menu:[],
      categories: [],
      renderCategory: "main",
      newItem: false
    };
  }

  /* Used for connecting to Menu in database */
  componentDidMount() {
  fetch("http://50.19.176.137:8000/menu/123")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          menuJSON: result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
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
  /* Aggregate all the menu categories onto cards and call the change which menu to display is clicked */
  renderMenuCategories(){
    return this.state.categories.map((item, key) =>
      <Col sm={6} className="p-3" style={{'min-width':'225px'}}>
        <Card className="text-center" >
          <div onClick={() => this.changeCategory(item) }>                     
            <Card.Header style={cardHeaderStyle}>{item}</Card.Header>
          </div>
        </Card>
      </Col>  
    );
  }
  //render the menu prop of the current category 
  renderMenu(){
    return this.state.menu.map((item, key) =>
        <MenuItem menu={item} category={this.state.renderCategory} />
    );
  }
   //toggle between creating a new menu item and not
  ToggleNewItem= () => {
      this.setState({
        newItem: !this.state.newItem
    })
  }
    //generate form for new item
    NewItemForm(){
        return <NewItem/>
    }


  // Default render method
  render() {
    //clear the menu each time we load
    this.state.menu = []
    const { error, isLoaded, menuJSON, menu,categories,renderCategory, newItem } = this.state;
    
    if (error) {
      return <div>Error: {error.message}</div>;
    } 

    else if (!isLoaded) {
      return <div>Loading...</div>;
    } 

    else {
      //map the menu json to an array
      Object.keys(menuJSON).forEach(function(key) {
            menu.push([key ,menuJSON[key]]);

      });
    }
      //create a list of all unique categories of food/drink
    for (const [index, value] of menu.entries()) {
        if(categories.indexOf(value[1].category) === -1){
          categories.push(value[1].category)
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
              <Container fluid>
                <div class="d-flex flex-wrap">
                    {this.renderMenuCategories()}
                    <Col sm={6} className="p-3"> {/*add a create new category option*/}
                      <Card className="text-center" >
                        <div onClick={() => this.ToggleNewItem() }>                     
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
            <Container fluid>
              <div class="d-flex flex-wrap">
                {this.renderMenu()}                
              </div>
              <Col sm={12} className="p-3"> {/*add a create new item option*/}
                <Card className="text-center" >
                  <button class="btn btn-link m-2" onClick={() => this.ToggleNewItem() }>                     
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
              <button type="button" onClick={() => {this.changeCategory("main"); this.setNewItem(false)} } class="btn btn-outline-light m-2">Back</button>
              <div style={menuTextStyle}>Create New Item</div>
            </h2>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div style={managerStyle}>
                    {this.NewItemForm()}
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
  'padding-top':'8px'
}
const categoryHeaderStyle = Object.assign({
  'display': 'flex',
}, menuHeaderStyle);
const menuTextStyle = {
  'flex': '1',
  'padding-right': '69px',
  'padding-top': '8px'
};

export default Menu;