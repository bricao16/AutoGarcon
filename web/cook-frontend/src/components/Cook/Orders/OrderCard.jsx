import React, {useEffect, useRef, useState} from "react";
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons';
import  'moment-duration-format';

import "../../../assets/orders/order.css"
import {makeStyles} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";

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

const customizationStyle = {
  color: 'grey'
};

const cardFooterStyle = {
  backgroundColor: '#0b658a',
  color: '#ffffff',
  justifyContent: 'space-between',
};

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'start',
    padding: theme.spacing(0)
  }
}));

function OrderCard(props) {

  // const theme = useTheme();
  // const classes = useStyles(theme);

  const {order, isSelected, isCompleted} = props;

  const orderTime = moment(order.order_date, 'YYYY-MM-DD HH:mm:ss');
  const orderTimeString = orderTime.format('LT');
  const [timeSinceOrder, setTimeSinceOrder] = useState(null);
  const timeInterval = useRef(null);

  function renderItems(){
    let allItems = [];
    let categoryKey = 0;
    for(let category in order.items){
      let items = [];
      let itemKey = 0;
      order.items[category].forEach(item => {
        items.push(
          <div key={itemKey++}>
            <div>
              <span className="pr-3">{item.quantity}</span>
              <span>{item.title}</span>
            </div>
            <div style={customizationStyle} className="pl-4">No tomatoes</div>
          </div>
        );
      });
      allItems.push(
        // Category with children items
        <div key={categoryKey++}>
          <p style={itemCategoryStyle} className="m-0">{category}</p>
          <div className="px-2">
            {items}
          </div>
        </div>
      );
    }
    return allItems;
  }

  function variableOrderStyles(){
    let style = Object.assign({}, orderStyle);
    if(isSelected){
      // style.background = '#7e7e7e';
      style.background = 'red';
    }
    if(order.expand){
      style.fontSize = '1.6em';
    }
    return style;
  }

  function initializeTime() {
    // Make Moment object out of order placed time
    // const momentOrderDate = moment(order.order_date, 'YYYY-MM-DD HH:mm:ss');
    // setOrderTime(momentOrderDate);
    // Convert to string that displays as 12 hour time with AM/PM
    // setOrderTimeString(orderTime.format('LT'));
  }

  function setupTimeInterval() {
    updateTime();
    timeInterval.current = setInterval(updateTime, 1000);
  }

  function updateTime(){
    // Time right now as Moment object
    let now = moment();
    // Seconds between now and order placed time
    const secondsSinceOrder = now.diff(orderTime, 's');
    // Formatted time between order placed time and now as hours:minute:seconds
    const momentTimeSinceOrder = moment.duration(secondsSinceOrder, 's').format('hh:*mm:ss');
    setTimeSinceOrder(momentTimeSinceOrder);
  }

  function renderTime(){
    let timeSince = <></>;
    if(!isCompleted) {
      timeSince = (
        <div className="d-flex" style={{alignItems: 'center'}}>
          <FontAwesomeIcon icon={faClock}/>
          <span className="pl-1">{timeSinceOrder}</span>
        </div>
      );
    }
    return (
      <>
        <span className="pr-3">{orderTimeString}</span>
        {timeSince}
      </>
    );
  }

  function renderCompletedFooter(){
    if(isCompleted) {
      return (
        <Card.Footer className="py-1 px-2 d-flex" style={statusStyle()}>
          Completed
        </Card.Footer>
      )
    }
  }

  function statusStyle(){
    let style = {color: '#fff'};
    style.backgroundColor = '#17af29';
    // style.backgroundColor = '#e2dd26';
    return style;
  }

  useEffect(() => {
    // initializeTime();
    setupTimeInterval();
    return () => {
      clearInterval(timeInterval.current);
    }
  }, []);

  return (
    <div className="p-1 mr-3 mb-2 order" style={variableOrderStyles()} onClick={() => props.handleOrderClick(props.cardId)}>
      <Card>
        <Card.Header style={cardHeaderStyle} className="p-0 d-flex">
          <span className="px-2 py-1" style={cardIdStyle}>{props.cardId + 1}</span>
          <div style={{flexGrow: 1, display: 'flex', justifyContent: 'space-between'}}>
            <span className="px-2 py-1">Table {order.table}</span>
            <span className="px-2 py-1">#{order.order_num}</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {renderItems()}
        </Card.Body>
        <Card.Footer className="py-1 px-2 d-flex" style={cardFooterStyle}>
          {renderTime()}
        </Card.Footer>
        {renderCompletedFooter()}
      </Card>
    </div>
  )
}

export default OrderCard;