import React, {useEffect, useRef, useState} from "react";
import Card from 'react-bootstrap/Card';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons';
import  'moment-duration-format';

import {makeStyles} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  order: {
    borderRadius: '0.25rem',
    cursor: 'pointer',
    userSelect: 'none',
    padding: theme.spacing(1),
    '&:hover': {
      background: 'rgba(126, 126, 126, 0.4)'
    }
  },
  cardHeader: {
    backgroundColor: '#0b658a',
    color: '#ffffff',
    borderBottom: 'none'
  },
  cardId: {
    background: '#ffffff6e',
    borderTopLeftRadius: 'calc(.25rem - 1px)',
    fontWeight: 500
  },
  itemCategory: {
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,.03)',
    fontWeight: 500,
    borderBottom: '1px solid rgba(0,0,0,.125)',
    borderTop: '1px solid rgba(0,0,0,.125)'
  },
  itemCustomization: {
    color: 'grey'
  },
  cardFooter: {
    color: '#ffffff',
    justifyContent: 'space-between',
    backgroundColor: '#0b658a',
  },
  selected: {
    background: '#00000070'
  },
  expanded: {
    fontSize: '1.5em'
  },
  completed: {
    background: 'rgb(76, 175, 80)!important'
  }
}));

function OrderCard(props) {

  const theme = useTheme();
  const classes = useStyles(theme);

  const {order, isSelected, isExpanded, isCompleted} = props;

  const orderTime = useRef(moment(order.order_date, 'YYYY-MM-DD HH:mm:ss'));
  const orderTimeString = useRef(orderTime.current.format('LT'));
  const [timeSinceOrder, setTimeSinceOrder] = useState(null);
  const timeInterval = useRef(null);

  useEffect(() => {
    orderTime.current = moment(order.order_date, 'YYYY-MM-DD HH:mm:ss');
    orderTimeString.current = orderTime.current.format('LT');
    updateTime();
  }, [order]);

  function renderItems() {
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
            <div className={"pl-4 " + classes.itemCustomization}>{item.customization}</div>
          </div>
        );
      });
      allItems.push(
        // Category with children items
        <div key={categoryKey++}>
          <p className={"m-0 " + classes.itemCategory} >{category}</p>
          <div className="px-2">
            {items}
          </div>
        </div>
      );
    }
    return allItems;
  }

  function variableOrderStyles(){
    let style = "";
    if(isSelected){
      style += classes.selected;
    }
    if(isExpanded){
      style += " " + classes.expanded;
    }
    return style;
  }

  function setupTimeInterval() {
    updateTime();
    timeInterval.current = setInterval(updateTime, 1000);
  }

  function updateTime(){
    // Time right now as Moment object
    let now = moment();
    // Seconds between now and order placed time
    const secondsSinceOrder = now.diff(orderTime.current, 's');
    // Formatted time between order placed time and now as hours:minute:seconds
    const momentTimeSinceOrder = moment.duration(secondsSinceOrder, 's').format('hh:*mm:ss');
    setTimeSinceOrder(momentTimeSinceOrder);
  }

  function renderFooter(){
    let footer = [];
    let footerClasses = " ";
    if(isCompleted) {
      footerClasses += classes.completed;
      footer.push(<span key={0} className="pr-3">Completed</span>);
    }
    footer.push(<span key={1}>{orderTimeString.current}</span>);
    if(!isCompleted){
      footer.push(renderTime());
    }
    return (
      <Card.Footer className={"py-1 px-2 d-flex space-between " + classes.cardFooter + footerClasses}>
        {footer}
      </Card.Footer>
    );
  }

  function renderTime(){
    return(
      <div key={2} className="d-flex pl-3" style={{alignItems: 'center'}}>
        <FontAwesomeIcon icon={faClock}/>
        <span className="pl-1">{timeSinceOrder}</span>
      </div>
    );
  }

  useEffect(() => {
    setupTimeInterval();
    return () => {
      clearInterval(timeInterval.current);
    }
  }, []);

  return (
    <div className={"mr-3 mb-2 " + classes.order + " " + variableOrderStyles()} onClick={() => props.handleOrderClick(props.cardId)}>
      <Card>
        <Card.Header className={"p-0 d-flex " + classes.cardHeader}>
          <span className={"px-2 py-1 " + classes.cardId}>{props.cardId + 1}</span>
          <div style={{flexGrow: 1, display: 'flex', justifyContent: 'space-between'}}>
            <span className="px-2 py-1">Table {order.table}</span>
            <span className="px-2 py-1">#{order.order_num}</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {renderItems()}
        </Card.Body>
        {renderFooter()}
      </Card>
    </div>
  )
}

export default OrderCard;