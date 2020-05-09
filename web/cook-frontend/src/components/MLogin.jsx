import React from 'react';
import Login from './Login'

/*
login component for the manager view. Uses Login component to log cook in.
Only a manager can login to the manager view, a cook cannot.
Asks for the staffID, password and logs in if the user and correct password
exists on the database cookies are set to use persistent state once logged in.
*/

export default class CLogin extends React.Component {

  render() {
    return (
      <Login title={"Manager"} redirect={'/manager'} staffType={['manager']} cookieAge={3600} />
    );
  }
}