import React from 'react';
import Login from './Login'

/*
login component for the cook view. Uses Login component to log cook in.
Manager or cook can login to the cook view.
Asks for the staffID, password and logs in if the user and correct password
exists on the database cookies are set to use persistent state once logged in.
*/

export default class CLogin extends React.Component {

  render() {
    return (
      <Login title={"Cook"} redirect={'/cook'} staffType={['cook', 'manager']} cookieAge={28800} />
    );
  }
}