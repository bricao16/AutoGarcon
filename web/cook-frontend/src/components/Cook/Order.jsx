import React from "react";
import Card from 'react-bootstrap/Card';

class Order extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  /*
  renderConfirmDelete(){
    if(this.props.order.confirmDelete) {
      return <div style={confirmDeleteStyle}></div>;
    }
  }
  */

  render() {
    return (
      <div className="p-3">
        <Card>
          {/*{this.renderConfirmDelete()}*/}
          <Card.Header style={cardHeaderStyle} className="p-0">
            <span className="px-2 py-1" style={cardIdStyle}>{this.props.boxNumber}</span>
            <div style={{display: 'flex', justifyContent: 'space-between', flexGrow: 1}}>
              <span className="px-2 py-1">Table {this.props.order.table}</span>
              <span className="px-2 py-1">#{this.props.order.order_num}</span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div style={itemTypeStyle}>Entrees</div>
            <div style={cardBodyStyle} className="px-1">
              <div>2x Grilled Chicken</div>
              <div>1x Hamburger</div>
            </div>
          </Card.Body>
          <Card.Footer className="p-0 p-1 px-2 d-flex" style={cardFooterStyle}>
            <span>10:30 am</span>
            <span>2:20</span>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

const itemStyle = {
    display: "flex",
};

var cardHeaderStyle = {
  backgroundColor: '#0b658a',
  color: '#ffffff',
  display: 'flex',
  borderBottom: 'none'
  // justifyContent: 'space-evenly',
  // alignItems: 'center'
};

const cardIdStyle = {
  background: '#ffffff6e',
  borderTopLeftRadius: 'calc(.25rem - 1px)',
  fontWeight: 500
};

const confirmDeleteStyle = {
  background: '#ff000061',
  width: '100%',
  height: '100%',
  position: 'absolute'
};

const cardBodyStyle = {
  // borderTop: '1px solid rgba(0,0,0,.125)'
};
const cardFooterStyle = {
  color: 'white',
  justifyContent: 'space-between',
  backgroundColor: 'rgb(11, 101, 138)'
};
const itemTypeStyle = {
  textAlign: 'center',
  backgroundColor: 'rgba(0,0,0,.03)',
  fontWeight: 500,
  borderBottom: '1px solid rgba(0,0,0,.125)',
  borderTop: '1px solid rgba(0,0,0,.125)'
};



export default Order;