import React from "react";
import Container from 'react-bootstrap/Container';
import CustomizeProp from './CustomizeProp';

/*this is the customize component for the manager
view. The stats are stored in state and rendered 
onto cards in by CustomizeProp */
class MCustomize extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            customize: [
                {type: "Font", items: [{title: "Times New Roman"}]},
                {type: "Primary Color", items: [{title: "#4285F4"}]},
                {type: "Secondary Color", items: [{title: "#DB4437"}]},
                {type: "Tertiary Color", items: [{title: "#A3A2A2"},]}
                ]
        };
    }
    renderCustomize(){
        return this.state.customize.map((item, key) =>
            <CustomizeProp key={key} id={key} customizeType={item}/>
        );
    }
    render() {
        return (
            <Container>
              <div style={backgroundStyle}>
             <Container fluid style={{'min-height': '70vh'}}>
                <div class="d-flex flex-wrap">
                    {this.renderCustomize()}
                </div>
            </Container> 
        </div>
    </Container>
        );
    }
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1'
}

export default MCustomize;