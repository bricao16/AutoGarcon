import React, {Component} from "react";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {render} from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactToPrint from 'react-to-print';


import ListGroup from 'react-bootstrap/ListGroup';
var QRCode = require('qrcode.react');

/* This component is used create the QR Codes a manager will want to print and
place at each table.  The manager enters in the desired table number and presses 
'generate code', which will then create a QR code for printing.*/
class StoreInfo extends React.Component{
  constructor(props) {     
    super(props);
    
    const cookies = new Cookies();
    this.state = {
      restaurantInfo: [],
      sectionEdit: "",
      show:false,
      name:this.props.info.name,
      address: this.props.info.address,
      phone: this.props.info.phone,
      open: this.props.info.opening,
      close:this.props.info.closing,
      restaurant_id :cookies.get("mystaff").restaurant_id,
      token:cookies.get('mytoken'),
			myValue: "Please enter in the table number for your QR Code.",
			QRValue: "default",
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
      }
  /* Used for connecting to restaurantInfo in database */
  handleSubmit(event) {
		this.setState({QRValue:this.state.myValue});
	  this.forceUpdate();
	}

  //change the category of which is being edited
  editForm = (category) => {
      this.setState({
        sectionEdit: category
    })
  }
  render() {
      const {restaurantInfo } = this.state;
      const fullResturantInfo = this.props;
      console.log(this.props);
      //put resturant info into an array
      Object.keys(fullResturantInfo.info).forEach(function(key) {
          restaurantInfo.push([key ,fullResturantInfo.info[key]]);
      });
      //get the styles
      const primary = this.props.primary;
      const secondary = this.props.secondary;
      const tertiary = this.props.tertiary;
      const font = this.props.font;
      const font_color = this.props.font_color;
      console.log(tertiary);

      return (
        <React.Fragment>
            <Alert show={this.state.show} variant={this.state.alertVariant}>
              {this.state.response}
            </Alert>
          <Card>
              <Card.Header style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color, 'textAlign' : 'center',"fontSize": "1.5rem"}}>
                    QR Code Generator
                </Card.Header>
                <Card.Body >
                <Row>
                  <Col>
                  <Card.Text style = {{'fontFamily' :font,fontSize: '1.2rem'}}>
                    Create unique QR code's to put at each table in your restaurant.
                  </Card.Text>
                  <Card.Text style = {{'fontFamily' :font,fontSize: '1.2rem'}}>
                    When a customer uses the AutoGarcon app, they can simply scan the QR code on the table to
                    pull up the menu. 
                  </Card.Text>
                    <Card.Text style = {{'fontFamily' :font,fontSize: '1.2rem'}}>
                     When their order is placed, the table number will be sent along with the order.
                  </Card.Text>

                  <input className="form-control" type="text"  placeholder={this.state.myValue} onChange={this.onChange} >
                  </input>
                  <br/>
                      <button type="button" className="btn" style = {{'backgroundColor': secondary,'color': font_color,'fontFamily' :font }} onClick={this.handleSubmit}>Generate Code</button>
                  </Col>
                  <Col>
                  <QRCode
                    id="123456"
                    value={this.state.QRValue}
                    size={300}
                    level={"H"}
                    includeMargin={true}
                  />
                  <div style = {{'textAlign' : 'center'}}>
                  <button
                  type="button" className="btn"
                  style = {{'backgroundColor': tertiary,'color': font_color,'fontFamily' :font, 'textAlign' : 'center'}} 
                  onClick={window.print} >
                  Print
                  </button>
                  </div>
                                  
                </Col>

                 </Row>
                </Card.Body>
                
              </Card>
            </React.Fragment>
            /*
        <Container>
          <div style={backgroundStyle}>
            <Alert show={this.state.show} variant={this.state.alertVariant}>
              {this.state.response}
            </Alert>
            <h2 style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color, 'textAlign' : 'center','height':'54px', 'paddingTop':'8px'}}>
              QR Code Generator
            </h2>
						<input className="form-control col" type="text" name="myValue" placeholder={this.state.myValue} onChange={this.onChange}>
            </input>
						<button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Generate Code</button>
					  <div style={QRCodeStyle} size="300">
							<QRCode
								id="123456"
								value={this.state.QRValue}
								size={400}
								level={"H"}
								includeMargin={true}
							/>
					  </div>
            <Container fluid style={{'minWidth': '70vh'}}/>
          </div>
        </Container>*/
      );
   }
}
class QRToPrint extends React.Component {
    constructor(props) {     
    super(props);
  }
  render() {
    return (
      <QRCode
        id="123456"
        value={2}
        size={300}
        level={"H"}
        includeMargin={true}
      />
    );
  }
}
const QRCodeStyle = {
	'height': '15vw',
	'width': '15vw',
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1',
  'minWidth': '70vw',
  'minHeight':'70vh'
}

const cardHeaderStyle = {
    'backgroundColor': '#0b658a',
    'color': '#ffffff',
    'fontFamily': 'Kefa'
};
const itemStyle = {
    'borderBottom': 'grey solid 1px',
    'width':'200px'
};

export default StoreInfo;
 {/*
        */}
