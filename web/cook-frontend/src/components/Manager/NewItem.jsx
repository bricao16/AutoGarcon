import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

/* 
  This component is to allow the manager to 
  create a new item. It returns a form object that allows
  for several options and fields to be submitted.  
*/

class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.prefill.menu
    this.state.type = props.prefill.type
    this.state.item_id = props.prefill.item_id
    this.state.show = false
    this.state.cookies = new Cookies();
    this.state.user = this.state.cookies.get("mystaff")
    this.parseStock(props.prefill.in_stock)
    this.handleShow = this.handleShow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
	this.handleValidation = this.handleValidation.bind(this);
  }

  /* Used for handling changes to the input field */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "in_stock") {
      var val = this.parseStock(target.checked);
      this.setState({
        [name]: val
      });
    }
    else {
      this.setState({
        [name]: value
      });
    }
  }

  /* Used for connecting to Menu in database */
  handleSubmit(event){
	  event.preventDefault();
    
    let requestMethod;
    let endpoint;
    let body;
    let message;
	
		if(this.state.name.length > 40){
			this.handleValidation("Name field is too large. Please reduce to 40 characters or less.");
		} else if(this.state.category.length > 40) {
			this.handleValidation("Category field is too large.  Please reduce to 40 characters or less.");
		} else if(isNaN(this.state.calories)){
			this.handleValidation("Calorie field isn't a number.  Please set to a number.");
		} else if(this.state.calories > 20000){
			this.handleValidation("Calorie field is out of range.  Please try a value less than 20,000.");
		}	else if(isNaN(this.state.price)){
			this.handleValidation("Price field isn't a number.  Please set to a number.");	
		} else if(this.state.price > 100000){
			this.handleValidation("Price field is too large.  Please try a value less than 100,000.");
		} else {
			
			this.state.price = Number(this.state.price).toFixed(2);


			// Non existent so need to add item
			if (this.state.type === "default") {
				message = "added"
				requestMethod = "PUT"
				endpoint = process.env.REACT_APP_DB + "/menu/add"
				body = 'restaurant_id='+this.state.user.restaurant_id
					+'&item_name='+this.state.name
					+'&calorie_num='+this.state.calories
					+'&category='+this.state.category
					+'&price='+this.state.price
					+'&in_stock='+this.state.in_stock
			}
			// Item needs to be edited
			else {
				message = "updated"
				requestMethod = "POST"
				endpoint = process.env.REACT_APP_DB + "/menu/update"
				body = 'restaurant_id='+this.state.user.restaurant_id
					+'&item_id='+this.state.item_id
					+'&item_name='+this.state.name
					+'&calorie_num='+this.state.calories
					+'&category='+this.state.category
					+'&price='+this.state.price
					+'&in_stock='+this.state.in_stock
			}
			
			axios({
				method: requestMethod,
				url: endpoint,
				data: body,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Bearer ' + this.state.cookies.get('mytoken')
				},
				httpsAgent: new https.Agent({  
					rejectUnauthorized: false,
				}),
			})
			/* fetch(endpoint, requestOptions) and await response */
			.then(async response => {
				await response;

				if (response.status !== 200) {this.handleShow(false);}
				else {this.handleShow(true, message);}
			})
			.catch(error => {
				this.handleShow(false);
				console.error("There was an error!", error);
			});
		}
  }
  /* item needs to be deleted */
  handleDelete(event){
	  event.preventDefault();
    
    let requestMethod;
    let endpoint;
    let body;
    let message;

    requestMethod = "DELETE"
    endpoint = process.env.REACT_APP_DB + "/menu/delete"
    body = 'item_id='+this.state.item_id
    message = "deleted"
    
    axios({
      method: requestMethod,
      url: endpoint,
      data: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.state.cookies.get('mytoken')
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
      }),
    })
    /*fetch(endpoint, requestOptions) and await response */
		.then(async response => {
      await response;
	  /* Unsuccessfull deletion from database */
      if (response.status !== 200) {this.handleShow(false);}
	  /* Successfull deletion from database */
      else {this.handleShow(true, message);}
		})
		.catch(error => {
      this.handleShow(false);
			console.error("There was an error!", error);
		});
  }
  
  /* Used to show the correct alert after hitting save item */
  handleShow(success, message) {
    if (success) {
      this.setState({response: "Successfully "+message+" item!"});
      this.setState({alertVariant: 'success'});
    }
    else {
      this.setState({response: 'Failed to update item'})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({show: true});
		
		setTimeout(() => {
			this.setState({
			show:false
			});
		}, 1500)
  }
	
  handleValidation(message){
	  this.setState({response: message});
	  this.setState({alertVariant: 'danger'});
		
		this.setState({show: true});
		
		setTimeout(() => {
			this.setState({
			show:false
			});
		}, 1500)
  }
  

  /* Parsing stock to set correct value */
  parseStock(value) {
    if (value === false) {
      this.setState({in_stock: 0});
      return 0
    }
    else if (value === true) {
      this.setState({in_stock: 1});
      return 1
    }
  }

  render(){
    // Make sure stock is correctly represented as true or false in the component's state
    this.parseStock(this.state.in_stock)

    if(this.state.type === "default")
    {
      return ( 
        <Col className="pt-3 px-3">
          <Container>

            <Alert show={this.state.show} variant={this.state.alertVariant}>
              {this.state.response}
            </Alert>

            <div class="d-flex flex-row-reverse pb-3">
              <button onClick={this.handleDelete} type="delete" className="btn btn-outline-danger btn-sm">Delete Item</button>
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
                    <input type="checkbox" id="in_stock" name="in_stock" value={this.state.in_stock} onChange={this.handleInputChange} checked={this.state.in_stock}/> 
                    <label class="pl-2" for="in_stock">In stock</label>
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
      /*If editing a item prefill with values*/
      return(
        <Col className="pt-3 px-3">
          <Container>

          <Alert show={this.state.show} variant={this.state.alertVariant}>
            {this.state.response}
          </Alert>

            <div className="d-flex flex-row-reverse pb-3">
              <button onClick={this.handleDelete} type="delete" className="btn btn-outline-danger btn-sm">Delete Item</button>
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
                    <input type="checkbox" id="in_stock" name="in_stock" value={this.state.in_stock} onChange={this.handleInputChange} checked={this.state.in_stock}/> 
                    <label class="pl-2" for="in_stock">In stock</label>
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