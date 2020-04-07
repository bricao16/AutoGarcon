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
  renderItems(){
    let allItems = [];
    let key1 = 0;
    for(let category in this.props.order.items){
      let items = [];
      let key2 = 0;
      this.props.order.items[category].forEach(item => {
        items.push(
          <div key={key2++}>
            <span className="pr-2">{item.quantity}x</span>
            <span>{item.title}</span>
          </div>
        );
      });
      allItems.push(
        // Category with children items
        <div key={key1++}>
          <p style={itemCategoryStyle} className="m-0">{category}</p>
          <div className="px-2">
            {items}
          </div>
        </div>
      );
    }
    return allItems;
  }

  selectedOrder(){
    let style = {};
    if(this.props.selectedOrder){
      style.background = '#7e7e7e';
    }
    if(this.props.order.expand){
      style.fontSize = '2em';
    }
    return style
  }

  render() {
    return (
      <div className="p-1 m-2 order" style={this.selectedOrder()} onClick={() => this.props.handleCardClick(this.props.cardId)}>
        <Card>
          <Card.Header style={cardHeaderStyle} className="p-0 d-flex">
            <span className="px-2 py-1" style={cardIdStyle}>{this.props.cardId + 1}</span>
            <div style={{flexGrow: 1, display: 'flex', justifyContent: 'space-between'}}>
              <span className="px-2 py-1">Table {this.props.order.table}</span>
              <span className="px-2 py-1">#{this.props.order.order_num}</span>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            {this.renderItems()}
          </Card.Body>
          <Card.Footer className="py-1 px-2 d-flex" style={cardFooterStyle}>
            <span>10:30 am</span>
            <span>2:20</span>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}



const cardHeaderStyle = {
  backgroundColor: '#0b658a',
  color: '#ffffff',
  borderBottom: 'none'
  // justifyContent: 'space-evenly',
  // alignItems: 'center'
};

const cardIdStyle = {
  background: '#ffffff6e',
  borderTopLeftRadius: 'calc(.25rem - 1px)',
  fontWeight: 500
};

const itemCategoryStyle = {
  textAlign: 'center',
  backgroundColor: 'rgba(0,0,0,.03)',
  fontWeight: 500,
  borderBottom: '1px solid rgba(0,0,0,.125)',
  borderTop: '1px solid rgba(0,0,0,.125)'
};

const cardFooterStyle = {
  backgroundColor: '#0b658a',
  color: '#ffffff',
  justifyContent: 'space-between',
};




export default Order;