import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'universal-cookie';
import {Redirect} from "react-router-dom";

/*
This component is the dropdown menu that displays the user and 
other actions that the user can perform such as 
account settings, privacy policy and logging out
*/
const cookies = new Cookies();
class AccountDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
        section:"",
        privacyPolicy:false
      };
    this.privacyPolicy = this.privacyPolicy.bind(this);
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
    return <Redirect to='/'/> 
  }
  privacyPolicy(){
    //set privacy policy to true on click and render it
    this.setState({
        privacyPolicy: true
    })
  }
  render() {
    //if the privacy policy has been clicked open it in new tab
    if(this.state.privacyPolicy)
    {
      window.open('/privacy_policy', "_blank");
        this.setState({
          privacyPolicy: false
      })
    }
    //either log out or view the dropdown
    return (
        this.state.section === "" ? 
          <Dropdown alignRight className={this.props.className}>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {this.props.firstName} {this.props.lastName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">View Profile</Dropdown.Item>
              <div onClick={()=>this.privacyPolicy()}>
                <Dropdown.Item>Privacy Policy</Dropdown.Item>
              </div>
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