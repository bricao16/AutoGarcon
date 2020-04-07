import React from "react";
import Card from 'react-bootstrap/Card';

class Alert extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="d-flex" style={alertStyle}>
        <Card>
          <Card.Header style={cardHeaderStyle}>
            <p className="m-0">Alert</p>
          </Card.Header>
          <Card.Body className="">
            {this.props.alert}
          </Card.Body>
        </Card>
      </div>
    )
  }
}

const alertStyle = {
  width: '100vw',
  height: '100vh',
  background: '#00000078',
  position: 'fixed',
  top: 0,
  left: 0,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

var cardHeaderStyle = {
  backgroundColor: '#0b658a',
  color: '#ffffff'
};

export default Alert;