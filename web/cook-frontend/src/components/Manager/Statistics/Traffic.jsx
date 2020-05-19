import React from 'react';
import {
    XYPlot,
    XAxis, // Shows the values on x axis
    YAxis, // Shows the values on y axis
    HorizontalGridLines,
    VerticalGridLines,
    LineSeries,
    VerticalBarSeries,
    ChartLabel,
    LabelSeries,
    FlexibleHeightXYPlot

} from 'react-vis';
import Container from 'react-bootstrap/Container';

import 'react-vis/dist/style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';
import axios from 'axios';

/*this is the traffic portion of the stats component 
for the manager view. 

The data for this is pulled from /orderstats/ordersbyhour/, /orderstats/ordersbyday/,
/orderstats/ordersbymonth/. 

This component allows toggling between each of 
these datas. 

If hour is selected each hour rendered on the x axis, and the
number of items sold on the y in a line graph. 

If day is selected each day rendered on the x axis, and the
number of items sold on the y in a line graph.

If month is selected each hour rendered on the x axis, and the
number of items sold on the y in a bar graph. 
*/

const MSEC_Hour = 4000000;
const cookies = new Cookies();
//get the current date
const timestamp = new Date().setHours(0,0,0,0);;

class Traffic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              selectedTime: "Hour",
              unselectedCategories: [],
              data_hour:null,
              data_day:null,
              data_month:null,
              checked:true,
              token: cookies.get('mytoken'),
              staff: cookies.get('mystaff')
        };
        this.renderDay = this.renderDay.bind(this);
        this.renderMonth = this.renderMonth.bind(this);
        this.renderHour = this.renderHour.bind(this);

    }
    //change the time period selection
    changeSelection(category){
      this.setState({'selectedTime':category});
      
    }

     /* Used for connecting to  database */
    componentDidMount() {
     const https = require('https');
     //get the hour data
     axios({
          method: 'get',
          url: process.env.REACT_APP_DB + '/orderstats/ordersbyhour/' + this.state.staff.restaurant_id,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer '+ this.state.token
          },
          httpsAgent: new https.Agent({  
            rejectUnauthorized: false,
          }),
        })
          .then(res => {  
            console.log(res);
            var dataFormat = [];
            var maxHeight = 0;
            var i;
            for (i = 0; i < Object.keys(res.data).length; i++) {
                  dataFormat.push({"y":res.data[i].num_orders, "x": (timestamp +res.data[i].hour *MSEC_Hour)});
                  //find the max count to set the height of graph
                  if(res.data[i].num_orders> maxHeight)
                  {
                      maxHeight = res.data[i].num_orders;
                  }
              }
           this.setState({
              data_hour: dataFormat,
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
        //get the day data
        axios({
          method: 'get',
          url: process.env.REACT_APP_DB + '/orderstats/ordersbyday/' + this.state.staff.restaurant_id,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer '+ this.state.token
          },
          httpsAgent: new https.Agent({  
            rejectUnauthorized: false,
          }),
        })
        .then(res => {  
            var dataDay = [];
            var maxHeight = 0;
            var i;
            for (i = 0; i < Object.keys(res.data).length; i++) {
                  dataDay.push({"y":res.data[i].num_orders, "x": new Date(res.data[i].day).getTime()});
                  //find the max count to set the height of graph
                  if(res.data[i].num_orders> maxHeight)
                  {
                      maxHeight = res.data[i].num_orders;
                  }
              }
           this.setState({
              data_day: dataDay,
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
        //get the month data
        axios({
          method: 'get',
          url: process.env.REACT_APP_DB + '/orderstats/ordersbymonth/' + this.state.staff.restaurant_id,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer '+ this.state.token
          },
          httpsAgent: new https.Agent({  
            rejectUnauthorized: false,
          }),
        })
        .then(res => {  
            var dataFormat = [];
            var maxHeight = 0;
            var i;
            for (i = 0; i < Object.keys(res.data).length; i++) {
                  dataFormat.push({"y":res.data[i].num_orders, "x": new Date(res.data[i].month).getTime()});
                  //find the max count to set the height of graph
                  if(res.data[i].num_orders> maxHeight)
                  {
                      maxHeight = res.data[i].num_orders;
                  }
              }
           this.setState({
              data_month: dataFormat,
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
    //render the line graph for the data data
    renderDay(){
        return(
          <Container>
            
            <XYPlot xType="time" width={800} height={400} margin={{bottom: 50}} >
            <p style={{'float':'right', 'color': 'black'}}><i> Number of orders per day</i></p>
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Day"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data= {this.state.data_day}
                color = {this.props.primary}
              />

            </XYPlot>
          </Container>
        );
    }
    // render the line graph for the hour data
    renderHour(){
        return(
            <Container>
           
            <XYPlot xType="time" width={800} height={400} margin={{bottom: 50}} >
            <p style={{'float':'right', 'color': 'black'}}><i> Number of orders per hour - all time</i></p>
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Hour"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data= {this.state.data_hour}
                color = {this.props.primary}
              />

            </XYPlot>

            </Container>
        );
    }
    //render a bar graph for the month data
    renderMonth(){
        return(
            <Container>
            
             <FlexibleHeightXYPlot 
            xType="ordinal" 
            width={800} 
            height = {400}   
        >
        <p style={{'float':'right', 'color': 'black'}}><i> Number of orders per month </i></p>
            <XAxis />
            <YAxis tickTotal = {8} />
            <VerticalBarSeries 
                data={this.state.data_month}
                 style={{opacity: '0.80'}}
                 color = {this.props.primary}
            />
            <ChartLabel
                text="Month"
                className="alt-x-label"
                includeMargin={false}
                xPercent={0.90}
                yPercent={1.12}
                />
            <ChartLabel
                text="Number of Orders"
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
                data={this.state.data_month.map(obj => {
                    return { ...obj, x: obj.x.toString() }
                })}
                labelAnchorX="middle"
                labelAnchorY="text-before-edge"
            />
        </FlexibleHeightXYPlot>
        </Container>
        );
    }
    render() {
        return (
            <Container>
                {/*Dropdown of  hour, day and month*/}
                <div className="form-group p-3" style={{'float':'right'}}>
                  <Dropdown  >
                    <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                      {this.state.selectedTime} 
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <div onClick={()=>this.changeSelection("Hour")}>
                      <Dropdown.Item href="#/action-1">Hour</Dropdown.Item>
                      </div>
                      <div onClick={()=>this.changeSelection("Day")}>
                        <Dropdown.Item>Day</Dropdown.Item>
                      </div>
                      <div onClick={()=>this.changeSelection("Month")}>
                        <Dropdown.Item>Month</Dropdown.Item>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              {/* render the correct plot */}
                {this.state.selectedTime === "Hour" &&
                  this.renderHour()
                }
                {this.state.selectedTime === "Day" &&
                  this.renderDay()
                }
                {this.state.selectedTime === "Month" && 
                  this.renderMonth()
                }
            </Container>
        );
    }
}
export default Traffic;