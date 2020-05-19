import React, {useEffect, useRef, useState} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
//import clsx from 'clsx';
import axios from "axios";
import https from "https";

const useStyles = makeStyles(theme => ({
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // background: '#fafafa'
  },
  tableContainer: {
    margin: theme.spacing(3)
  },
  selected: {
    border: 'solid 1px black'
  }
}));


const universalCookies = new Cookies();

function ServiceRequests() {
  const theme = useTheme();
  const classes = useStyles(theme);

  const cookies = {
    token: universalCookies.get('mytoken'),
    staff: universalCookies.get('mystaff')
  };

  const [serviceData, setServiceData] = useState({});

  const [selected, setSelected] = useState(null);


  useEffect(() => {
    getServiceData();
  }, []);

  function getServiceData(){
    const url = process.env.REACT_APP_DB + '/services/' + cookies.staff.restaurant_id;
    axios.get(url, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + cookies.token
      },
    })
      .then(res => res.data)
      .then(data => {
        setServiceData(data);
        if(Object.keys(data).length){
          setSelected(0);
        }
      })
      .catch(error =>{
        console.error(error);
      });
  }

  function changeStatus(status, table_num){
    const url = process.env.REACT_APP_DB + '/services/update';
    const data = 'restaurant_id=' + cookies.staff.restaurant_id + '&table_num=' + table_num + '&status=' + status;
    axios.post(url,
      data,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + cookies.token
        },
      })
      .then((r) => {
        if(r.status === 200){
          getServiceData();
        }
      })
      .catch(error =>{
        console.log('post request error');
        console.error(error);
      });
  }

  function renderTableService(){
    let tables = [];
    if(Object.keys(serviceData).length) {
      let index = 0;
      Object.values(serviceData).forEach(table => {
        tables.push(
          <div className={classes.tableContainer} key={index}>
            <p>Table {table.table_num}</p>
            <p>Status {table.status}</p>
            <button onClick={() => changeStatus("Good", table.table_num)}>Finished</button>
          </div>
        );
        index++;
      });
    }
    return tables;
  }

  // After being verified and loading restaurant info is done
  // Render Cook view
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.main}>
        {renderTableService()}
      </div>
    </ThemeProvider>
  )
}

export default ServiceRequests;