import React, {useEffect, useRef, useState} from "react";
import Card from 'react-bootstrap/Card';
import {Button} from '@material-ui/core'
import {makeStyles} from "@material-ui/core";
import {useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  card: {
    borderRadius: '0.25rem',
    minWidth: '160px'
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    borderBottom: 'none',
  },
  headerText: {
    textAlign: 'center'
  },
  status: {
    textAlign: 'center',
  },
  container:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  border: {
    borderTop: '1px solid rgba(0,0,0,.125)'
  },
  button: {
    textTransform: 'initial',
    background: theme.primary,
    color: theme.palette.text.primary
  }
}));

function ServiceCard(props) {

  const theme = useTheme();
  const classes = useStyles(theme);

  const {table, status, onClick} = props;
  const statusMeaning = {
    Help: 'Assistance Requested',
    Bill: 'Bill Requested',
  };

  function getStatus(){
    return statusMeaning[status];
  }

  return (
    <Card className={"mr-5 mb-3 " + classes.card}>
      <Card.Header className={classes.cardHeader}>
        <p className={"m-0 " + classes.headerText}>Table {table}</p>
      </Card.Header>
      <Card.Body className={'p-0'}>
        <div className={'p-2 ' + classes.container}>
          <p className={'m-0 p-0 ' + classes.status}>Status:</p>
          <p className={'m-0 p-0'}>{getStatus()}</p>
        </div>
        <div className={'p-2 ' + classes.container + ' ' + classes.border}>
          <Button variant="contained" color="primary" className={'m-0 ' + classes.button} onClick={() => onClick("Good", table)}>
            Request Fulfilled
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ServiceCard;