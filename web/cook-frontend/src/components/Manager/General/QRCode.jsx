import React from "react";
import Card from 'react-bootstrap/Card';
import Cookies from 'universal-cookie';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
			QRValue: ",default"
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (e) => {

        this.setState({ 
					myValue: e.target.value
				});
      }
  /* Used for generating QR code */
  handleSubmit(event) {
		
		var string = this.state.restaurant_id + "," + this.state.myValue;
		
		this.setState({QRValue:string});
	  this.forceUpdate();
	}

  render() {
      const {restaurantInfo } = this.state;
      const fullResturantInfo = this.props;
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

                  <input className="form-control" type="text" placeholder={this.state.myValue} onChange={this.onChange} >
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
      );
   }
}

export default StoreInfo;

