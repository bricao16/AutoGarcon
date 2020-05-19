import React from "react";

function Toolbar(props){

  const {buttons} = props;

  return (
    <div>
      {buttons}
    </div>
  );
}

export default Toolbar;
