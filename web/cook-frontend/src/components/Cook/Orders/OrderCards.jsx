import React from "react";
import {makeStyles, Container} from '@material-ui/core'
import {useTheme} from "@material-ui/core/styles";

import OrderCard from "./OrderCard";


const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'start',
    padding: theme.spacing(0),
    // fontSize: '1.1em'
  }
}));

function OrderCards(props){

  const theme = useTheme();
  const classes = useStyles(theme);

  const {orders, expandedOrders, selectedCard} = props;

  let orderCards = [];
  if(Object.keys(orders).length) {
    let index = 0;
    Object.values(orders).forEach(order => {
      let isSelected = false;
      let isExpanded = expandedOrders[order.order_num];
      if(index === selectedCard){
        isSelected = true;
      }
      orderCards.push(
        <OrderCard key={index} cardId={index} order={order} handleOrderClick={props.handleOrderClick} isSelected={isSelected} isExpanded={isExpanded} isCompleted={props.isCompleted}/>
      );
      index++;
    });
    return (
      <Container maxWidth={false} className={classes.main}>
        { orderCards }
      </Container>
    );
  }
  // If there are no orders
  return <h4>No orders</h4>

}

export default OrderCards;