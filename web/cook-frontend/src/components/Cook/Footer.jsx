import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import moment from 'moment';

// React hook component
function Footer(){

  const [time, setTime] = useState(moment().format('LT'));

  useEffect(() => {
    const interval = setInterval(updateTime, 60000); // after mounting
    return () => clearInterval(interval); // after unmounting
  }, []);

  const updateTime = () => {
    setTime(moment().format('LT'));
  };

  return (
    <Container fluid style={footerStyle} className="p-2">
      <h3>{time}</h3>
    </Container>
  );
}

const footerStyle = {
  background: 'white',
  textAlign: 'center'
};

export default Footer;