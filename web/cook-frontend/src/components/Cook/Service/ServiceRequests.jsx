import React, {useEffect, useRef, useState} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
//import clsx from 'clsx';
import axios from "axios";
import https from "https";
import Header from "./Header";
import Card from "./Card";
import {Container} from "@material-ui/core";

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


const universalCookies = new Cookies();

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
      console.log(serviceData);
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
    <ThemeProvider theme={theme}>
      <Header title={"Table Service Requests"}/>
      <div className={classes.main}>
        <p className={classes.note}>
          {updateRequestCount()} Pending Service Requests
        </p>
        <div className={classes.cardsContainer}>
          {renderTableCards()}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ServiceRequests;