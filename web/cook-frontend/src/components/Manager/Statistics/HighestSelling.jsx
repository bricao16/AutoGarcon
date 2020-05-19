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
import axios from 'axios';
import Cookies from 'universal-cookie';

/*this is the highest selling portion of the stats component 
for the manager view. 

The data for this is pulled from /orderstats/highestsellingcat/
Each category is rendered on the x axis, and the
number of items sold on the y in a bar graph. A label of the 
item name is put on the bar of the its category.

Checkboxes are rendered which allow toggling of removing
and adding back cateogries to be displayed on the graph.*/

const chartWidth = 800;
const cookies = new Cookies();

class HighestSelling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
              unselectedCategories: [],
              full_data: null,
              data:null,
              checked:true,
              staff: cookies.get('mystaff'),
              chartHeight:null,
              isLoaded :false,
              token: cookies.get('mytoken'),
        };
        this.checkboxHandler = this.checkboxHandler.bind(this);
        this.updateData = this.updateData.bind(this);
        this.renderPlot = this.renderPlot.bind(this);
        this.renderCheckBoxes = this.renderCheckBoxes.bind(this);
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
    /* Used for connecting to database */
    componentDidMount() {
    const https = require('https');
    axios({
        method: 'get',
        url: process.env.REACT_APP_DB + '/orderstats/highestsellingcat/' + this.state.staff.restaurant_id,
        data: 'restaurant_id='+this.state.restaurant_id,
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
                dataFormat.push({"y":res.data[i].total_ordered, "x":res.data[i].category, "label":res.data[i].item_name});
                //find the max count to set the height of graph
                if(res.data[i].total_ordered> maxHeight)
                {
                    maxHeight = res.data[i].total_ordered;
                }
            }
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
    //create a checkbox for every category in the pulled menu
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
        //render a plot using react vis
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
            //render the checkboxes and then render the graph below
            return (
                <Container>
                     <div className="d-flex flex-wrap pt-3">
                        {this.renderCheckBoxes()}                
                    </div>
                    <br/>
                    <br/>
                    <p style={{'float':'right'}}><i> All time highest selling times from each category </i></p>
                    <br/>
                    <div style = {{'height':'100%'}}>
                        {this.renderPlot()}
                    </div>

                </Container>
            );
        }
    }
}
export default HighestSelling;
 