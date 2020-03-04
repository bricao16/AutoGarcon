import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

class AccountDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <Dropdown alignRight className={this.props.className}>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          Joey
        </Dropdown.Toggle>
      
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default AccountDropdown;