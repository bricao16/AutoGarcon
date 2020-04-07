import React from "react";


class OrdersMenu extends React.Component {

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
      <div style={menuStyle} className="pt-2">
        <div className="mx-5 d-flex">
          <p className="m-0 mr-5 p-2" style={this.tabStyle(0)} onClick={() => this.props.handleTabClick(0)}>Current Orders</p>
          <p className="m-0 mr-5 p-2" style={this.tabStyle(1)} onClick={() => this.props.handleTabClick(1)}>Completed Orders</p>
        </div>
      </div>
    )
  }
}

const menuStyle = {
  background: 'white',
  borderBottom: 'solid 1px black',
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

export default OrdersMenu;