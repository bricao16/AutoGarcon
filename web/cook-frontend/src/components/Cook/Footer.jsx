import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import moment from 'moment'; // Used for getting and formatting time

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
    <Container fluid style={footerStyle} className="p-2">
      <h1>{time}</h1>
    </Container>
  );
}

const footerStyle = {
  background: 'white',
  textAlign: 'center'
};

export default Footer;