import React from "react";


class OrdersMenu extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div style={menuStyle}>
        Test
      </div>
    )
  }
}

const menuStyle = {
  background: 'white',
  width: '100%'
};

export default OrdersMenu;