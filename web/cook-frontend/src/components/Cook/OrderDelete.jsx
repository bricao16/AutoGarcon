import React from "react";
import Card from 'react-bootstrap/Card';

/*
This component will be used to confirm clearing an order
 */
class OrderDelete extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div style={containerStyle}>
        <Card>
          <Card.Header style={cardHeaderStyle}>
            <span>Are you sure you want to delete {this.props.cardId}?</span>
          </Card.Header>
          <Card.Body style={cardBodyStyle}>
            <span>(Y)es</span>
            <span>(N)o</span>
          </Card.Body>
        </Card>
      </div>
    );
  }


}

const cardHeaderStyle = {
  backgroundColor: '#0b658a',
  color: '#ffffff'
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
  background: '#00000057',
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cardBodyStyle = {
  display: 'flex',
  justifyContent: 'space-around'
};

export default OrderDelete;