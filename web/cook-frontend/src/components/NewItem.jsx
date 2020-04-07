import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
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
      id: '123',
      name:"",
      category: "",
      calories: "",
      price:"",
      description:"",
      picture:"",
      in_stock:true
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
        console.log(this.state);
      }
  /* Used for connecting to Menu in database */
  handleSubmit(event) {
    event.preventDefault();
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/ 
    const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'restaurant_id='+this.state.id +'&item_name='+this.state.name
          +'calorie_num='+this.state.calories+'&category='+this.state.category
          +'&price='+this.state.price
          /* Need database to add these!
            +'&description='+this.state.description+ '&picture='+this.state.picture
          +'&in_stock='+this.state.in_stock*/
      
    };
    fetch('http://50.19.176.137:8000/menu/add', requestOptions)
    .then(async response => {
      const data = await response.json();
      
      if(!response.ok){
        
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      alert('Sucessful sumbit');
      this.setState({redirect: true});
    
    })
    .catch(error =>{
      alert('Unsucessful sumbit');
      this.setState({redirect: false});
      console.error("There was an error!", error);
    });

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
                    <form onSubmit = {this.handleSubmit}>
                      <div className="form-group">
                        <input  className="form-control" type="text" name = "name" 
                                placeholder={this.props.prefill.menu[0]}
                                onChange={this.onChange}>
                        </input>
                       </div>
                       <div className="form-group">
                        <input  className="form-control" type="text" name = "category"
                                placeholder={this.props.prefill.menu[1].category}
                                onChange={this.onChange}>
                        </input>
                       </div>
                        <div className="form-group">
                          <input  className="form-control" type="text" name = "calories" 
                                  placeholder={this.props.prefill.menu[1].calories}
                                  onChange={this.onChange}>
                          </input>
                       </div>
                       <div className="form-group">
                          <div className="input-group mb-2 mr-sm-2">
                            <div className="input-group-prepend">
                              <div className="input-group-text">$</div>
                            </div>
                            <input type="text" className="form-control" name="price" 
                            placeholder={this.props.prefill.menu[1].price}
                            onChange={this.onChange}>
                            </input>
                          </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="itemDescription">Description</label>
                        <textarea className="form-control" name="description" rows="3" onChange={this.onChange}></textarea>
                      </div>
                      <div className="form-group">
                        <label hmtlfor="exampleFormControlFile1">Picture</label>
                        <input type="file" className="form-control-file" name="picture" onChange={this.onChange}>
                        </input>
                      </div>
                      <div className="pretty p-switch p-fill">
                          <input type="checkbox" defaultChecked/>
                          <div className="state">
                              <label type ="checkbox" name="in_stock" placeholder = {this.props.prefill.menu[1].in_stock} onChange={this.onChange}>In stock</label>
                          </div>
                      </div>
                      <br/>
                      <div className="row">
                            <button type ="submit" className="btn btn-primary  col m-5" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>*/}
                        </div>
                      
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
      {/*If editing a item prefill with values*/}
      return ( 
        <Container>
          <div>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div>
                    <form onSubmit = {this.handleSubmit}>
                      <div className="form-group row">
                        <label className="col ">Name </label>
                          <input className="form-control col" type="text" id = "itemName" defaultValue={this.props.prefill.menu[0]}>
                          </input>
                       </div>
                       <div className="form-group row">
                        <label className="col">Category </label>
                        <input className="form-control col" type="text" id = "itemCategory" defaultValue={this.props.prefill.menu[1].category}>
                        </input>
                       </div>
                        <div className="form-group row">
                          <label className="col">Calories</label>
                          <input className="form-control col" type="text" id = "itemCalories" defaultValue={this.props.prefill.menu[1].calories}>
                          </input>
                       </div>
                       <div className="form-group row">
                       <label className="col">Price</label>
                          <div className="col input-group mb-2 mr-sm-2">
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
                      <div className="pretty p-switch p-fill">
                          <input type="checkbox" defaultChecked/>
                          <div className="state">
                              <label placeholder = {this.props.prefill.menu[1].in_stock}>In stock</label>
                          </div>
                      </div>

                      <div className="row m-2">
                        <button  className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A'}}>Submit</button>
                      </div>
                      <div className="float-right m-2">
                        <button type="delete" className="btn btn-outline-danger">Delete</button>
                      </div>
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