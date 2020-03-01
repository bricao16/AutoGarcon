import React from "react";
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Menu(props) {
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
                <Card.Header>Statistics</Card.Header>
                <Card.Body>
                   { <Card.Title>{props.statsType.type}</Card.Title>}
                    
                    {
                    props.statsType.items.map((item, key) => (
                        <div style={itemStyle}>
                            <p style={{margin: "0", padding: "0.8em"}}>{item.title}  : {item.quantity}</p>
                        </div>
                    ))
                }
                </Card.Body>
                {/*<Card.Footer className="text-muted">(Custom footer)</Card.Footer>*/}
            </Card>
        </Col>
    )
}

const menuStyle = {
    width: "20vw",
    border: "grey solid 1px",
    borderRadius: "5px",
    marginTop: "30px"
};

const topStyle = {
    background: "#20639B",
    color: "grey"
};

const itemStyle = {
    display: "flex",
    borderBottom: "grey solid 1px",
};

export default Menu;