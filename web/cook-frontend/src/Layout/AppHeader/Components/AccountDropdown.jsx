import React, {Fragment} from 'react';
import {Redirect} from "react-router-dom";
import {
    DropdownToggle, DropdownMenu,
    Nav, Button, NavItem, NavLink,
    UncontrolledTooltip, UncontrolledButtonDropdown
} from 'reactstrap';
import Cookies from 'universal-cookie';
import {
    toast,
    Bounce
} from 'react-toastify';

import {
    faCalendarAlt,
    faAngleDown

} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
//import avatar1 from '../../../assets/utils/images/avatars/1.jpg';
/*
This component is the dropdown menu that displays the user and 
other actions that the user can perform such as 
account settings, privacy policy and logging out
*/

const cookies = new Cookies();
class AccountDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
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
        return (
        this.state.section === "" ? 
            <Fragment>
                <div className="header-btn-lg pr-0">
                    <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                            <div className="widget-content-left">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color="link" className="p-0">
                                        {this.props.firstName} {this.props.lastName}
                                        <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                    </DropdownToggle>
                                    <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                        <Nav vertical>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);">
                                                    My Account 
                                                </NavLink>
                                            </NavItem>
                                            <NavItem onClick={()=>this.privacyPolicy()} >
                                               <NavLink> Privacy Policy</NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);">
                                                    Logout
                                                    
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
            :
            this.logout()
        )
    }
}

export default AccountDropdown;