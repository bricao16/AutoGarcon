import React from "react";
import DisplayOrders from "./DisplayOrders";
import Toolbar from "./Toolbar";
import {Button, makeStyles} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  main: {
    margin: theme.spacing(3)
  },
  button: {
    marginRight: theme.spacing(2)
  }
}));

function ActiveOrders(){

  const theme = useTheme();
  const classes = useStyles(theme);

  const serverUrl = process.env.REACT_APP_DB;
  // const path = serverUrl + '/orders/' + restaurant_id;
  const path = serverUrl + '/orders/' + '124';

  const buttons = [
    <Button variant="contained" color="primary" className={classes.button}>Completed</Button>,
    // <Button variant="contained" color="primary" className={classes.button}></Button>
  ];

  return (
    <div className={classes.main}>
      <p>Active Orders</p>
      <Toolbar buttons={buttons}/>
      <DisplayOrders type="active" path={path} />
    </div>
  );
}

export default ActiveOrders;
