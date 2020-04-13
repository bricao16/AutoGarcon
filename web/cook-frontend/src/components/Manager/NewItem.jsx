import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';


/* 
  This component is to allow the manager to 
  create a new item. It returns a form object that allows
  for several options and fields to be submitted.  There
  are no helper functions
*/
class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.prefill.menu
    this.state.type = props.prefill.type
    this.state.item_id = props.prefill.item_id
    this.state.show = false
    this.handleShow = this.handleShow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Used for handling changes to the input field */
  handleInputChange(event) {
    const target = event.target;

    const value = target.value;

    const name = target.name;

    this.setState({
      [name]: value
    });

    console.log('input after set state', this.state)
  }

  /* Used for connecting to Menu in database */
  handleSubmit(event){
	  event.preventDefault();
    
    let requestMethod;
    let endpoint;
    let body;

    // Non existent so need to add item
    if (this.state.type === "default") {
      requestMethod = "PUT"
      endpoint = "http://50.19.176.137:8000/menu/add"
      body = 'restaurant_id='+123
        +'&item_name='+this.state.name
        +'&calorie_num='+this.state.calories
        +'&category='+this.state.category
        +'&price='+this.state.price
    }
    // Item needs to be edited
    else {
      requestMethod = "POST"
      endpoint = "http://50.19.176.137:8000/menu/update"
      body = 'restaurant_id='+123
        +'&item_id='+this.state.item_id
        +'&item_name='+this.state.name
        +'&calorie_num='+this.state.calories
        +'&category='+this.state.category
        +'&price='+this.state.price
        +'&in_stock='+this.state.in_stock
    }
	  
	  const requestOptions = {
      method: requestMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    }
    
    fetch(endpoint, requestOptions)
		.then(async response => {
      await response;

      if (response.status !== 200) {this.handleShow(false);}
      else {this.handleShow(true);}
		})
		.catch(error =>{
      this.handleShow(false);
			console.error("There was an error!", error);
		});
  }

  /* Used to show the correct alert after hitting save item */
  handleShow(success) {
    if (success) {
      this.setState({response: 'Successfully updated item!'});
      this.setState({alertVariant: 'success'});
    }
    else {
      this.setState({response: 'Failed to update item'})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({show: true});
  }


  render(){
    if(this.state.type === "default")
    {
      return ( 
        <Col className="pt-3 px-3">
          <Container>

            <Alert show={this.state.show} variant={this.state.alertVariant}>
              {this.state.response}
            </Alert>

            <div class="d-flex flex-row-reverse pb-3">
              <button type="delete" className="btn btn-outline-danger btn-sm">Delete Item</button>
            </div>
            <div>
              <form class="pb-1">

                <div className="form-group row">
                  <label className="col ">Name </label>
                    <input className="form-control col" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} placeholder={this.state.name}>
                    </input>
                </div>

                <div className="form-group row">
                  <label className="col">Category </label>
                  <input className="form-control col" type="text" name="category" value={this.state.category} onChange={this.handleInputChange} placeholder={this.state.category}>
                  </input>
                </div>

                  <div className="form-group row">
                    <label className="col">Calories</label>
                    <input className="form-control col" type="text" name="calories" value={this.state.calories} onChange={this.handleInputChange} placeholder={this.state.calories}>
                    </input>
                </div>

                <div className="form-group row">
                <label className="col">Price</label>
                    <div className="col input-group mb-2 mr-sm-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">$</div>
                      </div>
                      <input type="text" className="form-control" name="price" value={this.state.price} onChange={this.handleInputChange} placeholder={this.state.price}>
                      </input>
                    </div>
                </div>

                <div class="pretty p-switch p-fill d-flex flex-row-reverse">
                  <div>
                    <input type="checkbox" defaultChecked/> 
                    <label class="pl-2" name="in_stock" value={this.state.in_stock} onChange={this.handleInputChange} placeholder={this.state.in_stock}>In stock</label>
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

                <div className="d-flex justify-content-center row p-2">
                  <button onClick={this.handleSubmit} className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A', width: '200px'}}>Submit</button>
                </div>
              </form>
            </div>
          </Container>
        </Col>
      );
    }
    else{
      {/*If editing a item prefill with values*/}
      return(
        <Col className="pt-3 px-3">
          <Container>

          <Alert show={this.state.show} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>

            <div class="d-flex flex-row-reverse pb-3">
              <button type="delete" className="btn btn-outline-danger btn-sm">Delete Item</button>
            </div>

            <div>
              <form class="pb-1">

                <div className="form-group row">
                  <label className="col ">Name </label>
                    <input className="form-control col" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} defaultValue={this.state.name}>
                    </input>
                </div>

                <div className="form-group row">
                  <label className="col">Category </label>
                  <input className="form-control col" type="text" name="category" value={this.state.category} onChange={this.handleInputChange} defaultValue={this.state.category}>
                  </input>
                </div>

                  <div className="form-group row">
                    <label className="col">Calories</label>
                    <input className="form-control col" type="text" name="calories" value={this.state.calories} onChange={this.handleInputChange} defaultValue={this.state.calories}>
                    </input>
                </div>

                <div className="form-group row">
                <label className="col">Price</label>
                    <div className="col input-group mb-2 mr-sm-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">$</div>
                      </div>
                      <input type="text" className="form-control" name="price" value={this.state.price} onChange={this.handleInputChange} defaultValue={this.state.price}>
                      </input>
                    </div>
                </div>

                <div class="pretty p-switch p-fill d-flex flex-row-reverse">
                  <div>
                    <input type="checkbox" defaultChecked/> 
                    <label class="pl-2" name="in_stock" value={this.state.in_stock} onChange={this.handleInputChange} placeholder={this.state.in_stock}>In stock</label>
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

                <div className="d-flex justify-content-center row p-2">
                  <button onClick={this.handleSubmit} className="btn btn-primary" style = {{backgroundColor: '#0B658A', border: '#0B658A', width: '200px'}}>Submit</button>
                </div>
            </form>
          </div>
        </Container>
      </Col>
      ); 
    }
  }

}

export default NewItem;