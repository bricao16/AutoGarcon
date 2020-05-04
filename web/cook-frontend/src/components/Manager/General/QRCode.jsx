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
import QrCode from 'react.qrcode.generator';
import {render} from 'react-dom';

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
			QRValue: "default"
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
      //put resturant info into an array
      Object.keys(fullResturantInfo.info).forEach(function(key) {
          restaurantInfo.push([key ,fullResturantInfo.info[key]]);
      });

      return (
        <Container>
          <div style={backgroundStyle}>
            <Alert show={this.state.show} variant={this.state.alertVariant}>
              {this.state.response}
            </Alert>
            <h2 style={mainMenuHeaderStyle}>
              QR Code Generator
            </h2>
						<input className="form-control col" type="text" name="myValue" value={this.state.myValue} onChange={this.onChange}>
            </input>
						<button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Generate Code</button>
					  <div style={QRCodeStyle} size="300">
						  <QrCode value={this.state.QRValue} size='300'/>
							{this.state.QRValue}
					  </div>
            <Container fluid style={{'minWidth': '70vh'}}/>
          </div>
        </Container>
      );
   }
}

const QRCodeStyle = {
	'paddingLeft': '200px',
	'height': '300px',
	'width': '300px',
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1'
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
const mainMenuHeaderStyle = {
  'backgroundColor': '#102644',
  'color': '#ffffff',
  'fontFamily': 'Kefa',
  'textAlign' : 'center',
  'padding':'8px'
}
export default StoreInfo;
 {/*
        */}
