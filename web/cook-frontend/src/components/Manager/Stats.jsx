import React from "react";
import Container from 'react-bootstrap/Container';
import Stat from './StatItem';
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

/*this is the stats component for the manager
view. The stats are stored in state and rendered 
onto cards in by statsProp
Currently not displaying any real info */
class Stats extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            statistics: [
                {type: "Highest Selling Breakfast", items: [{quantity: 50, title: "Eggs"}]},
                {type: "Highest Selling Lunch", items: [{quantity: 75, title: "Fries"}]},
                {type: "Highest Selling Dinner", items: [{quantity: 150, title: "Pasta"}]}
                ]
        };
    }
    renderStats(){
        return this.state.statistics.map((item, key) =>
            <Stat key={key} id={key} statsType={item}/>
        );
    }
    render() {
        return (
            <Container>
              <div style={backgroundStyle}>
             <Container fluid style={{'minHeight': '70vh'}}>
                <div className="d-flex flex-wrap">
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
                </div>
            </Container> 
        </div>
    </Container>
        );
    }
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1'
}

export default Stats;


