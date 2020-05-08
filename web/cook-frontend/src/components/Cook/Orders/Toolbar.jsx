import React from "react";
import {makeStyles} from "@material-ui/core";
import {createMuiTheme, useTheme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  main: {
    marginBottom: theme.spacing(3)
  }
}));

function Toolbar(props){

  const theme = useTheme();
  const classes = useStyles(theme);

  const {buttons} = props;

  return (
    <div className={classes.main}>
      {buttons}
    </div>
  );
}

export default Toolbar;
