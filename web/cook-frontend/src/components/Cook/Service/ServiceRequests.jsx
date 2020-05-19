import React, {useEffect, useRef, useState} from "react";
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Header from "./Header";
import Card from "./Card";

const useStyles = makeStyles(theme => ({
  main: {
    margin: theme.spacing(4),
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  cardsContainer: {
    display: 'flex'
  },
  note: {
    fontSize: '1.1em'
  }
}));

function ServiceRequests(props) {
  const theme = useTheme();
  const classes = useStyles(theme);

  const {serviceData, changeStatus} = props;

  function updateRequestCount(){
    let count = 0;
    if(Object.keys(serviceData).length > 0){
      Object.values(serviceData).forEach(table => {
        if(table.status !== 'Good'){
          count++;
        }
      });
    }
    return count;
  }

  function renderTableCards(){
    let tables = [];
    if(Object.keys(serviceData).length) {
      let index = 0;
      Object.values(serviceData).forEach(table => {
        if(table.status !== 'Good'){
          tables.push(
            <Card key={index} table={table.table_num} status={table.status} onClick={changeStatus}/>
          );
          index++;
        }
      });
    }
    return tables;
  }

  // After being verified and loading restaurant info is done
  // Render Cook view
  return (
    <div>
      <Header title={"Table Service Requests"}/>
      <div className={classes.main}>
        <p className={classes.note}>
          {updateRequestCount()} Pending Service Requests
        </p>
        {/*<Card table={21} status={'Bill'} onClick={changeStatus}/>*/}
        {/*<Card table={22} status={'Bill'} onClick={changeStatus}/>*/}
        {/*<Card table={23} status={'Bill'} onClick={changeStatus}/>*/}
        <div className={classes.cardsContainer}>
          {renderTableCards()}
        </div>
      </div>
    </div>
  )
}

export default ServiceRequests;