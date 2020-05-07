import React from "react";
import LogoImage from "../../assets/AutoGarconLogoCrop.png";
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  footerStyle: {
    padding: '12px',
    height: '67px',
  },
  container: {
    display: 'flex',
    float: 'right',
    alignItems: 'center'
  },
  image: {
    margin: theme.spacing(0,0,0,2)
  }
}));

function Footer(){

  const theme = useTheme();
  const classes = useStyles(theme);

  return(
    <footer className={classes.footerStyle}>
      <div className={classes.container}>
        <p className="m-0">Powered by AutoGarcon</p>
        <img src={LogoImage} width="auto" height="40" alt="waiter" className={classes.image} />
      </div>
    </footer>
  )
}

export default Footer;