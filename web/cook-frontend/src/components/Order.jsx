import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Order(props) {
    return (
        <Col sm={4} className="p-.5">
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
                    props.order.items.map((item, key) => (
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