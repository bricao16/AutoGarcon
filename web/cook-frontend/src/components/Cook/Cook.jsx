import React from "react";
import Orders from "./Orders"
import OrdersMenu from "./OrdersMenu.jsx";

class Cook extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div style={cookPageStyle}>
        <OrdersMenu />
        <Orders />
      </div>
    )
  }
}

const cookPageStyle = {
  backgroundColor: '#f1f1f1',
  height: '100vh',
  width: '100vw'
};

export default Cook;