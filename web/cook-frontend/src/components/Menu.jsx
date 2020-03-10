import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import MenuProp from './MenuProp';
class Menu extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            menu: [
                {type: "Breakfast", items: [{item: "Toast"}, {item: "Eggs"}, {item: "Bacon"}]},
                {type: "Lunch",items: [{item: "Hamburger"}, {item: "Fries"}, {item: "Salad"}]},
                {type: "Dinner",items: [{item: "Pasta"}, {item: "Chicken"}, {item: "Sandwich"}]}
            ]
        };
    }
    renderMenu(){
        return this.state.menu.map((item, key) =>
            <MenuProp key={key} id={key} menuType={item}/>
        );
    }
    render() {
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