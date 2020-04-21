import React from "react";
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import '../../assets/orders/nav.css'

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="pt-2">
        <Nav variant="tabs" defaultActiveKey="/active" style={navStyle}>
          <Nav.Item className="ml-4">
            <NavLink to="/cook/active" className="nav-link" activeClassName="nav-link active" style={navLinkStyle}>
              Active Orders
            </NavLink>
          </Nav.Item>
          <Nav.Item >
            <NavLink to="/cook/completed" className="nav-link" activeClassName="nav-link active" style={navLinkStyle}>
                Completed Orders
            </NavLink>
          </Nav.Item>
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