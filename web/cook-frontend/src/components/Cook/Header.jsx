import React from "react";
import Button from 'react-bootstrap/Button';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  renderTabs(){
    if(this.props.path === '/active'){
      return <Button variant="secondary" size="sm" className="mr-3" onClick={() => this.props.handleStatusChangeClick('Complete')}>Complete (C)</Button>;
    } else if(this.props.path === '/completed') {
      return <Button variant="secondary" size="sm" className="mr-3" onClick={() => this.props.handleStatusChangeClick('In Progress')}>Restore (R)</Button>;
    }
  }

  renderTitle(){
    if(this.props.path === '/active'){
      return <h2 className="m-0 mx-2 mr-4">Active Orders</h2>;
    } else if(this.props.path === '/completed') {
      return <h2 className="m-0 mx-2 mr-4">Completed Orders</h2>;
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="d-flex flex-wrap mb-2" style={headerStyle}>
          { this.renderTitle() }
          <div className="d-flex flex-nowrap" style={buttonsContainerStyle}>
            {/*<Button variant="secondary" size="sm" className="mr-3">In-Progress</Button>*/}
            { this.renderTabs() }
            {/*<Button variant="secondary" size="sm" className="mr-3" onClick={() => this.props.handleStatusChangeClick('Complete')}>Complete (C)</Button>*/}
            {/*<Button variant="secondary" size="sm" className="mr-3" onClick={() => this.props.handleStatusChangeClick('In Progress')}>Restore (R)</Button>*/}
            {/*<Button variant="secondary" size="sm" className="mr-3" onClick={this.props.handleExpandClick}>Expand (E)</Button>*/}
          </div>
        </div>
        {/*<p className="mb-2 mx-2">Use arrow keys or mouse to select an order</p>*/}
      </React.Fragment>
    )
  }
}

const headerStyle = {
  alignItems: 'center'
};
const buttonsContainerStyle = {
  flex: 1
};

export default Header;