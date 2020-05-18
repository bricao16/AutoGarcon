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
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';
import axios from 'axios';

const MSEC_Hour = 4000000;
const MSEC_Day = 4000000;

const cookies = new Cookies();
const timestamp = new Date('May 4 2020').getTime();
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
    changeSelection(category){
      this.setState({'selectedTime':category});
      //this.getFromDB();
      
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
     /* Used for connecting to Resturant in database */
    componentDidMount() {

    const https = require('https');

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
            console.log(dataFormat);
          })
          .catch((error) => {
            this.setState({
              isLoaded: true,
              error
            });
          })
      
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
          console.log(dataDay);
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
          console.log(res.data);
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
            console.log(dataFormat);
          })
          .catch((error) => {
            this.setState({
              isLoaded: true,
              error
            });
          })
    }

    renderDay(){

        return(
            <XYPlot xType="time" width={800} height={400} margin={{bottom: 50}} >
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Day"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data= {this.state.data_day}
                color = {this.props.primary}
              />

            </XYPlot>
        );
    }
    renderHour(){
        return(
            <XYPlot xType="time" width={800} height={400} margin={{bottom: 50}} >
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Hour"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data= {this.state.data_hour}
                color = {this.props.primary}
              />

            </XYPlot>
        );
    }
    renderMonth(){
        const MSEC_DAILY = 6000000;
        const timestamp = new Date('May 4 2020').getTime();
        return(
            <XYPlot xType="time" width={800} height={400} margin={{bottom: 50}} >
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis title="Month"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data= {this.state.data_month}
                color = {this.props.primary}
              />

            </XYPlot>
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