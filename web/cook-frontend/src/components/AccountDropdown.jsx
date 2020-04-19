import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';
import {Redirect} from "react-router-dom";
/*
This component is the dropdown menu that displays the user and other actions that the user can perform 
such as viewing profile, account settings, and logging out
*/
const cookies = new Cookies();
class AccountDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
        section:""
      };
    this.handleAction = this.handleAction.bind(this);
  }

  handleAction = (category) => {
    //change view category
    this.setState({
        section: category
    })
  }
  logout(){
    //remove the cookies to logout
    cookies.remove('mytoken');
    cookies.remove('mystaff');
    console.log(cookies.get('mystaff'));
    return <Redirect to='/'/> 
  }
  render() {
    return (
        this.state.section === "" ? 
          <Dropdown alignRight className={this.props.className}>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {this.props.firstName} {this.props.lastName}
            </Dropdown.Toggle>
          
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">View Profile</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Account Settings</Dropdown.Item>
              <div onClick={()=>this.handleAction('logout')}>
                <Dropdown.Item>Logout</Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        :
        this.logout()
     


    );
  }
}

export default AccountDropdown;