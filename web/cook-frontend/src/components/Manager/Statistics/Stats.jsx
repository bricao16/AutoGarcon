import React from "react";
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import HighestSelling from './HighestSelling';
import Traffic from './Traffic';
/*this is the stats component for the manager
view. The stats are pulled from the database in the
Traffic and HighestSelling components. 

This component simply allows toggling between those two
components.*/

class Stats extends React.Component{
    //default on the highest selling stats page
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
        // dropdown of highest selling items and traffic pages 
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
                {/* render the correct page based on which is selected*/}
                {this.state.selected === "Highest Selling Items" ? 
                  <HighestSelling  primary ={this.props.primary} font_color = {this.props.font_color} font ={this.props.font} />
                :
                  <Traffic primary ={this.props.primary} font_color = {this.props.font_color} font ={this.props.font} />
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


