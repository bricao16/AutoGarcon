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


const cookies = new Cookies();
class Traffic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              selectedTime: "Hour",
              unselectedCategories: [],
              data:this.props.data,
              checked:true,
              token: cookies.get('mytoken'),
              staff: cookies.get('mystaff')

        };

        this.updateData = this.updateData.bind(this);
        this.renderDay = this.renderDay.bind(this);
        this.renderMonth = this.renderMonth.bind(this);
        this.renderHour = this.renderHour.bind(this);

    }
    changeSelection(category){
      console.log(category);
      this.setState({'selectedTime':category})
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
    renderDay(){
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
    renderHour(){
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
                  {x: timestamp + MSEC_DAILY * 6, y: 20},
                  {x: timestamp + MSEC_DAILY * 7, y: 14},
                  {x: timestamp + MSEC_DAILY * 8, y: 9}
                ]}
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
              <XAxis title="Hour"  tickTotal = {8} />
              <YAxis title="Number of Orders" />
              <LineSeries
                data={[
                  {x: timestamp + MSEC_DAILY, y: 3},
                  {x: timestamp + MSEC_DAILY * 2, y: 20},
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