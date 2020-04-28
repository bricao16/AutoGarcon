import React from "react";
import Container from 'react-bootstrap/Container';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import Dropdown from 'react-bootstrap/Dropdown';
import HighestSelling from './HighestSelling';

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
                  <HighestSelling data={data} />
                :
                  <XYPlot
                    width={300}
                    height={300}>
                    <HorizontalGridLines />
                    <LineSeries
                      data={[
                        {x: 1, y: 10},
                        {x: 2, y: 5},
                        {x: 3, y: 15}
                      ]}/>
                    <XAxis />
                    <YAxis />
                  </XYPlot>
                }
                </div>
            </Container> 
        </div>
    </Container>
        );
    }
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1',
  'minWidth': '70vw'
}

export default Stats;


