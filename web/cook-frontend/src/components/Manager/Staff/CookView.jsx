import React from "react";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Redirect} from "react-router-dom";
import CSignUp from './CSignUp';
import CookViewImg from '../../../assets/cookview.png';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
/*
this view in the manager page allows a manager
to either
1. view the current orders on the "cook view" by
redirecting to the cook page 
2. create a new cook account
*/
class CookView extends React.Component{
	constructor(props) {
      super(props);
      this.state = {
      	section:"cook"
      };

      this.viewCategory = this.viewCategory.bind(this);
    }

	viewCategory = (category) => {
		//change view category
		this.setState({
        section: category
    })
	}
  viewCook()
  {
    return <Redirect to='/cook'/>
  }
  handleModalClose = () => this.setState({ModalShow: false});
  handleModalShow = () => this.setState({ModalShow: true});
  renderInfo(){
    //get the styles
    const primary = this.props.primary;
    const secondary = this.props.secondary;
    const font = this.props.font;
    const font_color = this.props.font_color;
     const section = this.state.section
    return(
            //if cook view clicked go to cook view
            <React.Fragment>
            {section === "goCookView" ? 
              <Redirect to='/cook'/>
              :

              <Card>
                {/* otherwise render two tabs for cook view or creating account */}
                <Card.Header style = {{'backgroundColor': primary}}>
                  <Nav variant="tabs" defaultActiveKey="cookview" >
                    <Nav.Item>
                      <Nav.Link href = "cookview" onClick={() => this.viewCategory("cook")} style = {{'color': font_color,fontSize: '1.5rem','fontFamily' :font, 'backgroundColor': primary}}>Cook View</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="link-1" onClick={() => this.viewCategory("acct") } style = {{'color': font_color,fontSize: '1.5rem','fontFamily' :font, 'backgroundColor': primary}} >Create New Staff Account</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                {this.state.section === "cook" ? 
                <Card.Body >
                <Row>
                  {/* some information on the cook view*/}
                  <Col>
                  <Card.Text style = {{'fontFamily' :font,fontSize: '1.2rem'}}>
                    Cook View shows the current orders coming in including the time ordered and time elapsed since order. 
                  </Card.Text>
                  <Card.Text style = {{'fontFamily' :font,fontSize: '1.2rem'}}>
                    Staff
                    can  mark the orders complete, look at order history, restore completed orders
                    and message customer's regarding their order. 
                  </Card.Text>
                    <Card.Text style = {{'fontFamily' :font,fontSize: '1.2rem'}}>
                     <i>It is the only page cook accounts have access to </i>
                  </Card.Text>
                  {/* button that takes to the cook view*/}
                  <div className = "text-center">
                    <Button onClick={() =>  this.viewCategory("goCookView") } className="btn btn-light " style = {{'backgroundColor': secondary,'color': font_color,'fontFamily' :font}}> Go to Cook View</Button>
                  </div>
                  </Col>
                  <Col>
                  <Image  src = {CookViewImg} className = "m-3" width = {'100%'}/>
                  </Col>
                 </Row>
                </Card.Body>
                
                :
                <Card.Body  className="text-center">
                  <Row>
                  <Col>
                {/* sign up information*/}
                  <ListGroup variant="flush" style = {{'fontFamily' :font,fontSize: '1.2rem', 'textAlign': 'left'}}>
                    <ListGroup.Item disabled> Give Staff access by creating an account for them. </ListGroup.Item>
                    <ListGroup.Item disabled><b>Cook</b> accounts have access to the Cook View only.</ListGroup.Item>
                    <ListGroup.Item disabled><b>Manager</b>  accounts have access to the Cook View and Manager page. Managers
                    are given ability to create new accounts and edit restaurant information.</ListGroup.Item>
                   
                  </ListGroup>
                  {/* sign up form*/}
                  </Col>
                  <Col>
                    <CSignUp/>
                    </Col>
                  </Row>
                  </Card.Body>
                }
              </Card>
            }
            </React.Fragment>
      );
  }
	render(){
      //put all things rendered into container for the manager page
      return (
        <Container>
                <Container fluid style={{'minHeight': '70vh'}}>
                    <div className="d-flex flex-wrap">
                        {this.renderInfo()}
                    </div>
                </Container>
        </Container>
    );
	}
}


export default CookView;