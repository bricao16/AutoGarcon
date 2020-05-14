import React from 'react';
import {
    XAxis, // Shows the values on x axis
    YAxis, // Shows the values on y axis
    VerticalBarSeries,
    ChartLabel,
    LabelSeries,
    FlexibleHeightXYPlot
} from 'react-vis';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
//import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

const chartWidth = 800;


const cookies = new Cookies();

class HighestSelling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              selectedTime: "Week",
              unselectedCategories: [],
              full_data: null,
              data:null,
              checked:true,
              staff: cookies.get('mystaff'),
              chartHeight:null,
              isLoaded :false

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
        var categories = this.state.unselectedCategories;

        if(categories.includes(event.target.id)){
             //if already in unselected remove it
            const index = categories.indexOf(event.target.id);
            categories.splice(index, 1);
            this.setState({ unselectedCategories: categories });
        }
        else{
              //if not in unselected add it
            var joined = this.state.unselectedCategories.push(event.target.id);
            this.setState({ unselectedCategories: joined });
        }
        //now update the data to render correctly
        this.updateData();


    }
    /* Used for connecting to Resturant in database */
    componentDidMount() {
      const https = require('https');

    axios({
        method: 'get',
        url: process.env.REACT_APP_DB + '/orderstats/' + this.state.staff.restaurant_id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        httpsAgent: new https.Agent({  
          rejectUnauthorized: false,
        }),
      })
        .then(res => {  
        console.log(res.data);
          var dataFormat = [];
          var maxHeight = 0;
          var i;
          for (i = 0; i < Object.keys(res.data).length; i++) {
                dataFormat.push({"y":res.data[i].total_ordered, "x":res.data[i].category, "label":res.data[i].item_name});
                //find the max count to set the height of graph
                if(res.data[i].total_ordered> maxHeight)
                {
                    maxHeight = res.data[i].total_ordered;
                }
            }
        
        console.log(this.state.data);
         this.setState({
            data: dataFormat,
            full_data: dataFormat,
            chartHeight:maxHeight,
            isLoaded :true
          });
        })
        .catch((error) => {
          this.setState({
            isLoaded: true,
            error
          });
        })
    }
    //create a checkbox for every category of menu item
    renderCheckBoxes(){
        return this.state.full_data.map((item) => 
            <Col key={item.x.toString()}>
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
        this.state.full_data.map(function(item){
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
        <FlexibleHeightXYPlot 
            xType="ordinal" 
            width={chartWidth} 
            height = {400}
            
        >
            <XAxis />
            <YAxis tickTotal = {8} />
            <VerticalBarSeries 
                data={this.state.data}
                 style={{opacity: '0.80'}}
                 color = {this.props.primary}
            />
            <ChartLabel
                text="Categories"
                className="alt-x-label"
                includeMargin={false}
                xPercent={0.90}
                yPercent={1.12}
                />
            <ChartLabel
                text="Units Sold"
                className="alt-y-label"
                includeMargin={false}
                xPercent={0.03}
                yPercent={0.00}
                style={{
                  transform: 'rotate(-90)',
                  textAnchor: 'end'
                }}
                />
            <LabelSeries
                data={this.state.data.map(obj => {
                    return { ...obj, label: obj.label.toString() }
                })}
                labelAnchorX="middle"
                labelAnchorY="text-before-edge"
            />
        </FlexibleHeightXYPlot>
        );
    }
    render() {
        //spinner while loading
        if (!this.state.isLoaded) {
           return (
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            )
        }
        else
        {
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
                    <div style = {{'height':'100%'}}>
                        {this.renderPlot()}
                    </div>
                </Container>
            );
        }
    }
}
export default HighestSelling;
 