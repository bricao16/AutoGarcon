import React from "react";
import logoImage from "../assets/AutoGarconLogoHome.png";
import {Link} from "react-router-dom";
import Background from "../assets/background.jpg";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

function Home() {
  return (
    <div style={homeStyle} className="d-flex flex-column">
      <Container fluid>
        {/* Logo, title and navigation are each in a column*/}
        <Row style={{alignItems: 'center'}}>
          {/* Only display logo when page is larger than 'medium' */}
          <Col xs="auto" lg="4" className="d-none d-md-block">
            <Image src={logoImage} height="60px" style={logoStyle}/>
          </Col>
          {/* Title floats left when less than 'large', then goes back to center when 'extra-small' */}
          <Col xs="12" md="auto" lg="4" style={{textAlign: 'center'}}>
            <Link to="/" style={titleStyle}>Auto Garcon</Link>
          </Col>
          {/* When less than 'large' this will separate title and nav. When 'extra-small' this will help center nav. */}
          {/*<Col className="d-lg-none p-0" style={{height: '20px', minWidth: 1}}></Col>*/}
          {/* Float right until 'extra-small', then center */}
          <Col xs="12" md="auto" className="p-0" style={{marginLeft: 'auto'}}>
            <Nav style={{justifyContent: 'center'}}>
              <Nav.Item>
                <Link to="/login_manager">
                  <Button size="md" variant="link" style={buttonStyle}>
                    Login Manager
                  </Button>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/login_cook">
                  <Button size="md" variant="link" style={buttonStyle}>
                    Login Cook
                  </Button>
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/sign_up">
                  <Button size="md" variant="link" style={buttonStyle}>
                    Sign up
                  </Button>
                </Link>
              </Nav.Item>
            </Nav>
          </Col>
          {/* Used to center nav when 'extra-small' */}
          {/*<Col className="d-md-none p-0" style={{height: '20px', minWidth: 1}}></Col>*/}
        </Row>
      </Container>
      <Container fluid style={backgroundImageStyle} className="p-0">
        <Container style={contentStyle}>
          <div style={circleStyle} className="d-flex flex-column">
            <h4 style={captionStyle}>Enhance your restaurant experience with Auto Garcon</h4>
            <Link to='/sign_up'>
              <Button variant="secondary" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>
        </Container>
      </Container>
    </div>
  );
}

const homeStyle = {
  height: '100vh',
  width: '100vw',
  fontFamily: 'Kefa',
};

const logoStyle = {
  margin: '10px'
};

const titleStyle = {
  fontSize: '3em',
  color:'#102644',
  textDecoration: 'none'
};

const buttonStyle = {
  textDecoration: 'none', // no underline on link hover
  color: 'black'
};

// Image of restaurant
const backgroundImageStyle = {
  backgroundImage: `url(${Background})`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  flex: 1, // fill all vertical space
};

const contentStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%', // parent is flex grow 1
};

const circleStyle = {
  background: '#112745b3',
  borderRadius: '50%',
  textAlign: 'center', // horizontal centering
  color: 'white',
  justifyContent: 'center', // vertical centering
  height: '400px',
  width: '400px',
  marginTop: '15px',
  marginBottom: '20vh', // offset upward from center
};

const captionStyle = {
  fontStyle: 'italic',
  marginBottom: '1em',
  marginTop: '2em', // push it down a bit
  padding: '1em'
};

export default Home;