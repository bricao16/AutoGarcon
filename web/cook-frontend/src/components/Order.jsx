import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

class Order extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }
  
  //Going to be updated to insert <Row>s
  createTable() {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 5; j++) {
        children.push(<td>{`Column ${j + 1}`}</td>)
      }
      //Create the parent and add the children
      table.push(<tr>{children}</tr>)
    }
    return table
  }

  render() {
    return (
      <Col sm={3} className="p-.5">
          {/* <div style={orderStyle}>
              <div style={topStyle}>
                  <p style={{margin: "0", padding: "5px"}}>{props.id}</p>
              </div>
              {
                  props.order.items.map((item, key) => (
                      <div style={itemStyle}>
                          <p style={{margin: "0", padding: "0.8em"}}>{item.quantity}x</p>
                          <p style={{margin: "0", padding: "0.8em"}}>{item.title}</p>
                      </div>
                  ))
              }
          </div> */}

          <Card className="text-center">
              <Card.Header>Featured</Card.Header>
              <Card.Body>
                  <Card.Title>Special title treatment</Card.Title>
                  {/* <Card.Text>
                  With supporting text below as a natural lead-in to additional content.
                  </Card.Text> */}
                  {
                  this.props.order.items.map((item, key) => (
                      <div style={itemStyle}>
                          <p style={{margin: "0", padding: "0.8em"}}>{item.quantity}x</p>
                          <p style={{margin: "0", padding: "0.8em"}}>{item.title}</p>
                      </div>
                  ))
              }
              </Card.Body>
              <Card.Footer className="text-muted">(Custom footer)</Card.Footer>
          </Card>
      </Col>
    )
  }
}

const orderStyle = {
    width: "20vw",
    border: "grey solid 1px",
    borderRadius: "5px",
    marginTop: "30px"
};

const topStyle = {
    background: "#20639B",
    color: "white"
};

const itemStyle = {
    display: "flex",
    borderBottom: "grey solid 1px",
};

export default Order;