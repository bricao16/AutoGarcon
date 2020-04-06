import React from "react";
import Button from 'react-bootstrap/Button';

class OrdersHeader extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="d-flex mb-2" style={headerStyle}>
        <h2 className="m-0 mx-2">Current Orders</h2>
        <div style={buttonsContainerStyle}>
          <Button variant="secondary" size="sm" className="mx-3">In-Progress</Button>
          <Button variant="secondary" size="sm" className="mx-3">Complete</Button>
        </div>
      </div>
    )
  }
}

const headerStyle = {
  alignItems: 'center'
};
const buttonsContainerStyle = {
  flex: 1
};

export default OrdersHeader;