import React from 'react';
import {
    XYPlot,
    XAxis, // Shows the values on x axis
    YAxis, // Shows the values on y axis
    VerticalBarSeries,
    LabelSeries
} from 'react-vis';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

const chartWidth = 800;
const chartHeight = 400;
const chartDomain = [0, chartHeight];

class HighestSelling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              selectedTime: "Week",
              unselectedCategories: [],
              data:this.props.data,
              checked:true

        };
        this.checkboxHandler = this.checkboxHandler.bind(this);
        this.updateData = this.updateData.bind(this);
        this.renderPlot = this.renderPlot.bind(this);
        this.renderCheckBoxes = this.renderCheckBoxes.bind(this);
    }

    changeSelection(category){
      this.setState({'selectedTime':category})
    }
    //handle when a checkbox is changed
    checkboxHandler(event){
        if(this.state.unselectedCategories.includes(event.target.id)){
             //if already in unselected remove it
             this.state.unselectedCategories.pop(event.target.id);
        }
        else{
              //if not in unselected add it
            var joined = this.state.unselectedCategories.push(event.target.id);
            this.setState({ unselectedCategories: joined });
        }
        //now update the data to render correctly
        this.updateData();


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
        return(
        <XYPlot 
            xType="ordinal" 
            width={chartWidth} 
            height={chartHeight} 
            yDomain={chartDomain}
        >
            <XAxis />
            <YAxis />
            <VerticalBarSeries
                data={this.state.data}
            />
            <LabelSeries
                data={this.state.data.map(obj => {
                    return { ...obj, label: obj.label.toString() }
                })}
                labelAnchorX="middle"
                labelAnchorY="text-after-edge"
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

                 <div className="d-flex flex-wrap pt-3">
                    {this.renderCheckBoxes()}                
                </div>
                {this.renderPlot()}

            </Container>
        );
    }
}
export default HighestSelling;
 