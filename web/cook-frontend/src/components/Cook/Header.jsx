import React from "react";
import Button from 'react-bootstrap/Button';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex mb-2" style={headerStyle}>
          <h2 className="m-0 mx-2">Active Orders</h2>
          <div style={buttonsContainerStyle}>
            <Button variant="secondary" size="sm" className="mx-3">In-Progress</Button>
            <Button variant="secondary" size="sm" className="mx-3" onClick={this.props.handleCompleteClick}>Complete (C)</Button>
            <Button variant="secondary" size="sm" className="mx-3" onClick={this.props.handleExpandClick}>Expand (E)</Button>
          </div>
        </div>
        <p className="mb-2 mx-2">Use arrow keys or mouse to select an order</p>
      </React.Fragment>
    )
  }
}

const headerStyle = {
  alignItems: 'center'
};
const buttonsContainerStyle = {
  flex: 1
};

export default Header;