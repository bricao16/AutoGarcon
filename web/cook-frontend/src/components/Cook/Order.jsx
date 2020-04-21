import React from "react";
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons';
import  'moment-duration-format';

class Order extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      orderTime: null,
      orderTimeString: null,
      timeSinceOrder: null
    };
  }

  renderItems(){
    let allItems = [];
    let key1 = 0;
    for(let category in this.props.order.items){
      let items = [];
      let key2 = 0;
      this.props.order.items[category].forEach(item => {
        items.push(
          <div key={key2++}>
            <span className="pr-3">{item.quantity}</span>
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

  variableOrderStyles(){
    let style = Object.assign({}, orderStyle);
    if(this.props.isSelected){
      style.background = '#7e7e7e';
    }
    if(this.props.order.expand){
      style.fontSize = '1.6em';
    }
    return style;
  }

  initializeTime(){
    // Make Moment object out of order placed time
    const orderTime = moment(this.props.order.order_date, 'YYYY-MM-DD HH:mm:ss');
    // Convert to string that displays as 12 hour time with AM/PM
    const orderTimeString = orderTime.format('LT');
    this.setState({orderTime: orderTime, orderTimeString: orderTimeString}, this.setupTimeInterval);
  }

  setupTimeInterval(){
    this.updateTime();
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  updateTime(){
    // Time right now as Moment object
    let now = moment();
    // Seconds between now and order placed time
    const secondsSinceOrder = now.diff(this.state.orderTime, 's');
    // Formatted time between order placed time and now as hours:minute:seconds
    const timeSinceOrder = moment.duration(secondsSinceOrder, 's').format('hh:mm:ss');
    let state = this.state;
    state.timeSinceOrder = timeSinceOrder;
    this.setState(state);
  }

  renderTime(){
    let timeSince = <></>;
    if(!this.props.isCompleted) {
      timeSince = (
        <div className="d-flex" style={{alignItems: 'center'}}>
          <FontAwesomeIcon icon={faClock}/>
          <span className="pl-1">{this.state.timeSinceOrder}</span>
        </div>
      );
    }
    return (
      <>
        <span className="pr-3">{this.state.orderTimeString}</span>
        {timeSince}
      </>
    );
  }

  renderCompletedFooter(){
    if(this.props.isCompleted) {
      return (
        <Card.Footer className="py-1 px-2 d-flex" style={this.statusStyle()}>
          Completed
        </Card.Footer>
      )
    }
  }

  statusStyle(){
    let style = {color: '#fff'};
    style.backgroundColor = '#17af29';
    // style.backgroundColor = '#e2dd26';
    return style;
  }

  componentDidMount() {
    this.initializeTime()
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="p-1 m-2 order" style={this.variableOrderStyles()} onClick={() => this.props.handleCardClick(this.props.cardId)}>
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
            {this.renderTime()}
          </Card.Footer>
          {this.renderCompletedFooter()}
        </Card>
      </div>
    )
  }
}

const orderStyle = {
  borderRadius: '0.25rem',
  cursor: 'pointer',
  userSelect: 'none'
};

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