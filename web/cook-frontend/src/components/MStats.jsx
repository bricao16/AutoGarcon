import React from "react";
import Container from 'react-bootstrap/Container';

import Col from 'react-bootstrap/Col';
import StatsProp from './statsProp';

/*this is the stats component for the manager
view. The stats are stored in state and rendered 
onto cards in by statsProp */
class MStats extends React.Component{

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
            <StatsProp key={key} id={key} statsType={item}/>
        );
    }
    render() {
        return (
            <Container>
              <div style={backgroundStyle}>
             <Container fluid>
                <div class="d-flex flex-wrap">
                    {this.renderStats()}
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

export default MStats;