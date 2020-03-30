import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import '../../node_modules/pretty-checkbox/dist/pretty-checkbox.min.css';
/* 
  This component is to allow the manager to 
  create a new item. It returns a form object that allows
  for several options and fields to be submitted.  There
  are no helper functions
*/
class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Used for connecting to Menu in database */
  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
        method: 'POST',
        data:data
    };

    fetch('http://50.19.176.137:8000/menu/123', requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: false,
            menuJSON: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
}

  render(){
    if(this.props.prefill.type === "default")
    {
      return ( 
        <Container>
          <div>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div>
                    <form>
                      <div className="form-group">
                        <input className="form-control" type="text" id = "itemName" placeholder={this.props.prefill.menu[0]}>
                        </input>
                       </div>
                       <div className="form-group">
                        <input className="form-control" type="text" id = "itemCategory" placeholder={this.props.prefill.menu[1].category}>
                        </input>
                       </div>
                        <div className="form-group">
                          <input className="form-control" type="text" id = "itemCalories" placeholder={this.props.prefill.menu[1].calories}>
                          </input>
                       </div>
                       <div className="form-group">
                          <div className="input-group mb-2 mr-sm-2">
                            <div className="input-group-prepend">
                              <div className="input-group-text">$</div>
                            </div>
                            <input type="text" className="form-control" id="inlineFormInputGroupUsername2" placeholder={this.props.prefill.menu[1].price}>
                            </input>
                          </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="itemDescription">Description</label>
                        <textarea className="form-control" id="itemDescription" rows="3"></textarea>
                      </div>
                      <div className="form-group">
                        <label hmtlfor="exampleFormControlFile1">Picture</label>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1">
                        </input>
                      </div>
                      <div class="pretty p-switch p-fill">
                          <input type="checkbox" defaultChecked/>
                          <div class="state">
                              <label placeholder = {this.props.prefill.menu[1].in_stock}>Currently in stock</label>
                          </div>
                      </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                  </div>
                </Container>
              </Col>
            </Container> 
          </div>
        </Container>
      );
    }
    else{
      return ( 
        <Container>
          <div>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div>
                    <form>
                      <div className="form-group">
                        <input className="form-control" type="text" id = "itemName" defaultValue={this.props.prefill.menu[0]}>
                        </input>
                       </div>
                       <div className="form-group">
                        <input className="form-control" type="text" id = "itemCategory" defaultValue={this.props.prefill.menu[1].category}>
                        </input>
                       </div>
                        <div className="form-group">
                          <input className="form-control" type="text" id = "itemCalories" defaultValue={this.props.prefill.menu[1].calories}>
                          </input>
                       </div>
                       <div className="form-group">
                          <div className="input-group mb-2 mr-sm-2">
                            <div className="input-group-prepend">
                              <div className="input-group-text">$</div>
                            </div>
                            <input type="text" className="form-control" id="inlineFormInputGroupUsername2" defaultValue={this.props.prefill.menu[1].price}>
                            </input>
                          </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="itemDescription">Description</label>
                        <textarea className="form-control" id="itemDescription" rows="3"></textarea>
                      </div>
                      <div className="form-group">
                        <label hmtlfor="exampleFormControlFile1">Picture</label>
                        <input type="file" className="form-control-file" id="exampleFormControlFile1">
                        </input>
                      </div>
                      <div class="pretty p-switch p-fill">
                          <input type="checkbox" defaultChecked/>
                          <div class="state">
                              <label placeholder = {this.props.prefill.menu[1].in_stock}>Currently in stock</label>
                          </div>
                      </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                  </div>
                </Container>
              </Col>
            </Container> 
          </div>
        </Container>
      ); 
    }
  }

}
export default NewItem;