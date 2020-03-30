import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

/*
This component is the dropdown menu that displays the user and other actions that the user can perform 
such as viewing profile, account settings, and logging out
*/
class AccountDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <Dropdown alignRight className={this.props.className}>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          Sign in
        </Dropdown.Toggle>
      
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">View Profile</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Account Settings</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default AccountDropdown;