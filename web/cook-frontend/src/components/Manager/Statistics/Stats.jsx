import React from "react";
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import HighestSelling from './HighestSelling';
import Traffic from './Traffic';
/*this is the stats component for the manager
view. The stats are stored in state and rendered 
onto cards in by statsProp
Currently not displaying any real info */

const data = [
    { "y": 100, "x": "Appetizer", "label":"Deep Fried Green Beans" },
    { "y": 112, "x": "Drinks" , "label":"Coke"},
    { "y": 230, "x": "Entree", "label":"Pasta" },

];
class Stats extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
              selected: "Highest Selling Items"
        };
    }
    changeSelection(category){
      this.setState({'selected':category})
    }

    render() {
        return (
            <Container>
             <Dropdown  className="p-3">
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    {this.state.selected} 
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <div onClick={()=>this.changeSelection("Highest Selling Items")}>
                    <Dropdown.Item href="#/action-1">Highest Selling Items</Dropdown.Item>
                    </div>
                    <div onClick={()=>this.changeSelection("Traffic")}>
                      <Dropdown.Item>Traffic</Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              <div style={backgroundStyle}>
             <Container fluid style={{'minHeight': '70vh'}}>
                <div className="d-flex flex-wrap">

                {this.state.selected === "Highest Selling Items" ? 
                  <HighestSelling data={data} primary ={this.props.primary} font_color = {this.props.font_color} font ={this.props.font} />
                :
                  <Traffic data = {data} primary ={this.props.primary} font_color = {this.props.font_color} font ={this.props.font} />
                }
                </div>
            </Container> 
        </div>
    </Container>
        );
    }
}

const backgroundStyle = {
  'paddingBottom': '4em',
  'minWidth': '70vw'
}

export default Stats;


