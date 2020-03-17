import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import MenuProp from './MenuProp';
/*
  This component is used to get the menu information
  from the database for the appropriate resturant. 
  
  componentDidMount() connects to the database and puts
  the information in out state.

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
      categories: []
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

  /* Aggregate all the menu categories into one object and call the prop to display is clicked */
  renderMenuCategories(){
    return this.state.categories.map((item, key) =>
        <Col sm={4} className="p-3">
          <Card className="text-center" >
           <div onClick={() => renderMenu(item)}>                     
              <Card.Header style={cardHeaderStyle}>{item}</Card.Header>
            </div>
          </Card>
      </Col>  
    );
  }


  // Default render method
  render() {
    const { error, isLoaded, menuJSON, menu, categories } = this.state;
    
    if (error) {
      return <div>Error: {error.message}</div>;
    } 

    else if (!isLoaded) {
      return <div>Loading...</div>;
    } 

    else {
      //map the menu json to an array
      Object.keys(this.state.menuJSON).forEach(function(key) {
        menu.push([key ,menuJSON[key]]);

      });
      //create a list of all unique categories of food/drink
    for (const [index, value] of menu.entries()) {
        if(categories.indexOf(value[1].category)==-1){
          categories.push(value[1].category)
        }
    }

      return (
        <Container>
          <div style={backgroundStyle}>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div style={managerStyle}>
                      {this.renderMenuCategories()}
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
//render the menu by the cateogry that was clicked
function renderMenu(category)
{
  console.log(category)
  return <MenuProp menu={category}/>
} 

const managerStyle = {
  'display': "flex",
  'fontSize': "1.2em",
  'justifyContent': "space-between",
  'margin': "30px",
  'marginTop': "0",
  'flexWrap': "wrap"
};

const backgroundStyle = {
  'backgroundColor': '#f1f1f1'
};
const itemStyle = {
    'display': 'flex',
    'borderBottom': 'white solid 1px'
};

const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff'
};

export default Menu;