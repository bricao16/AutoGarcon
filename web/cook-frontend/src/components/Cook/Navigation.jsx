import React from "react";
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import '../../assets/orders/nav.css'
import AccountDropdown from "../AccountDropdown";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      token: cookies.get('mytoken'),
      staff: cookies.get('mystaff')
    }
  }

  render() {
    return (
      <div className="">
        <Nav variant="tabs" defaultActiveKey="/active" style={navStyle}>
          <Nav.Item className="ml-4 pt-3">
            <NavLink to="/cook/active" className="nav-link" activeClassName="nav-link active" style={navLinkStyle}>
              Active Orders
            </NavLink>
          </Nav.Item>
          <Nav.Item className="pt-3">
            <NavLink to="/cook/completed" className="nav-link" activeClassName="nav-link active" style={navLinkStyle}>
                Completed Orders
            </NavLink>
          </Nav.Item>
          <AccountDropdown firstName={this.state.staff.first_name} lastName={this.state.staff.last_name} className="ml-auto pt-3 pr-3" />
        </Nav>
      </div>
    )
  }
}

const navStyle = {
  borderColor: '#afafaf'
};
const navLinkStyle = {
  color: '#495057'
};
/*const tabStyle = {
  cursor: 'pointer'
};
const activePageStyle = {
  border: '1px solid black',
  borderBottom: 'none',
  backgroundColor: 'rgb(241, 241, 241)',
  borderTopLeftRadius: '.5em',
  borderTopRightRadius: '.5em',
};*/

export default Navigation;