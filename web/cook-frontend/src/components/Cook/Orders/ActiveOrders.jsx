import React from "react";
import OrderCards from "./OrderCards";
import Toolbar from "./Toolbar";
import {Button, makeStyles} from "@material-ui/core";
import {createMuiTheme, ThemeProvider, useTheme} from "@material-ui/core/styles";

import Body from "./Body"

const useStyles = makeStyles((theme) => ({
  main: {
    margin: theme.spacing(3)
  },
  button: {
    marginRight: theme.spacing(2)
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0b658a',
    }
  },
});

function ActiveOrders(){

  // const theme = useTheme();
  const classes = useStyles(theme);

  const serverUrl = process.env.REACT_APP_DB;
  // const path = serverUrl + '/orders/' + restaurant_id;
  const path = serverUrl + '/orders/' + '124';

  function handleOrderClick(){

  }


  const buttons = [
    <Button key={0} variant="contained" color="primary" className={classes.button}>Completed</Button>,
    // <Button variant="contained" color="primary" className={classes.button}></Button>
  ];

  return (
    <Body />
    // <ThemeProvider theme={theme}>
    //   <div className={classes.main}>
    //     <Toolbar buttons={buttons}/>
    //     <OrderCardsContainer type="active" path={path} handleOrderClick={handleOrderClick()}/>
    //   </div>
    // </ThemeProvider>
  );
}

export default ActiveOrders;
