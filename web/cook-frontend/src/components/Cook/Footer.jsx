import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import moment from 'moment'; // Used for getting and formatting time
import logoImage from "../../assets/AutoGarconLogoHome.png";

// React hook component
function Footer() {
  // Time is current time formatted like '8:43 PM'
  const [time, setTime] = useState(moment().format('LT'));

  useEffect(() => {
    // updates clock every 30 seconds
    const interval = setInterval(updateTime, 30000); // after mounting
    return () => clearInterval(interval); // after unmounting
  }, []);

  function updateTime() {
    setTime(moment().format('LT'));
  }

  return (
    <Container fluid style={footerStyle} className="py-2">
      <Row>
        <Col className="d-flex" style={logoContainerStyle}>
            <Image src={logoImage} height="30px"/>
            <h1 style={titleStyle} className="mb-0 ml-2">AutoGarcon</h1>
        </Col>
        <Col>
          <h1 style={timeStyle}>{time}</h1>
        </Col>
        <Col className="d-none d-md-block">
        </Col>
      </Row>
    </Container>
  );
}

const footerStyle = {
  background: 'white',
};

const logoContainerStyle = {
  alignItems: 'center'
};

const titleStyle = {
  fontFamily: 'Kefa',
  fontSize: '2em'
};

const timeStyle = {
  textAlign: 'center'
};

export default Footer;