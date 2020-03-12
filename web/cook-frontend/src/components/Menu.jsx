import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
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
class Menu extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
                error: null,
                isLoaded: false,
                menuJSON: [],
                menu:[]
        };
    }

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
    renderMenu(){
      return this.state.menu.map((item, key) =>
          <MenuProp key={key} id={key} menu={item}/>
      );
    }
    render() {
        const { error, isLoaded,menuJSON, menu } = this.state;
        
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
            return (
            <Container>
              <div style={backgroundStyle}>
             <Container fluid>
                <Col className="pt-3 px-3">
                        <Container fluid>
                            <div style={managerStyle}>
                                {this.renderMenu()}
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
    display: "flex",
    fontSize: "1.2em",
    justifyContent: "space-between",
    margin: "30px",
    marginTop: "0",
    flexWrap: "wrap"
};
var backgroundStyle = {
  'backgroundColor': '#f1f1f1'
}

export default Menu;