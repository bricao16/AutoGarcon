import React from "react";
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import '../../assets/orders/nav.css'

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  tabStyle(tab){
    let style = tabStyle;
    if(this.props.currentTab === tab){
      style = {...style, ...activePageStyle};
    }
    return style;
  }

  render() {
    return (
      <div className="pt-2">
        <Nav variant="tabs" defaultActiveKey="/cook/active" style={navStyle}>
          <Nav.Item className="ml-4">
            <Link to="/cook/active" className="nav-link active">Active Orders</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/cook/completed" className="nav-link" style={navLinkStyle}>Completed Orders</Link>
          </Nav.Item>
        </Nav>
        {/*<div className="mx-5 d-flex">*/}
        {/*  <p className="m-0 mr-5 p-2" style={this.tabStyle(0)} onClick={() => this.props.handleTabClick(0)}>Active Orders</p>*/}
        {/*  <p className="m-0 mr-5 p-2" style={this.tabStyle(1)} onClick={() => this.props.handleTabClick(1)}>Completed Orders</p>*/}
        {/*</div>*/}
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
const tabStyle = {
  cursor: 'pointer'
};
const activePageStyle = {
  border: '1px solid black',
  borderBottom: 'none',
  backgroundColor: 'rgb(241, 241, 241)',
  borderTopLeftRadius: '.5em',
  borderTopRightRadius: '.5em',
};

export default Navigation;