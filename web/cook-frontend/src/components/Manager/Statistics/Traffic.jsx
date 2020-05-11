import React from 'react';
import {
    XYPlot,
    XAxis, // Shows the values on x axis
    YAxis, // Shows the values on y axis
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,

} from 'react-vis';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import 'react-vis/dist/style.css';


class HighestSelling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              selectedTime: "Week",
              unselectedCategories: [],
              data:this.props.data,
              checked:true

        };

        this.updateData = this.updateData.bind(this);
        this.renderPlot = this.renderPlot.bind(this);

    }

    //create a checkbox for every category of menu item
    renderCheckBoxes(){
        return this.props.data.map((item) => 
            <Col>
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id={item.x} defaultChecked={ this.state.checked } onChange={ this.checkboxHandler} ></input>
                  <label className="custom-control-label" htmlFor={item.x}>{item.x}</label>
                </div>
            </Col>
        );
    }
    //change the data so it only renders correct categories
    updateData(){
        //reset the data
        var joined = [];
        var categories = this.state.unselectedCategories;
        this.props.data.map(function(item){
            if(!(categories.includes(item.x)))
            {
                //if its not unselected then add to data
                joined.push(item);
            }
            this.setState({ data: joined });
            this.setState({ unselectedCategories: categories });
        }.bind(this));
    }
    renderPlot(){
        const MSEC_DAILY = 6000000;
        const timestamp = new Date('May 4 2020').getTime();
        return(
            <XYPlot xType="time" width={800} height={400} margin={{bottom: 50}} >
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Hour"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data={[
                  {x: timestamp + MSEC_DAILY, y: 3},
                  {x: timestamp + MSEC_DAILY * 2, y: 5},
                  {x: timestamp + MSEC_DAILY * 3, y: 15},
                  {x: timestamp + MSEC_DAILY * 4, y: 17},
                  {x: timestamp + MSEC_DAILY * 5, y: 12},
                  {x: timestamp + MSEC_DAILY * 6, y: 10},
                  {x: timestamp + MSEC_DAILY * 7, y: 14},
                  {x: timestamp + MSEC_DAILY * 8, y: 9}
                ]}
                color = {this.props.primary}
              />

            </XYPlot>
        );
    }
    render() {
        return (
            <Container>
                {/*Dropdown of week and month*/}
                <div className="form-group p-3" style={{'width':'10vw', 'float':'right'}}>
                  <select className="form-control">
                    <option onClick={()=>this.changeSelection("Week")}>Week</option>
                    <option onClick={()=>this.changeSelection("Month")}>Month</option>
                  </select>
                </div>
                {this.renderPlot()}

            </Container>
        );
    }
}
export default HighestSelling;
 