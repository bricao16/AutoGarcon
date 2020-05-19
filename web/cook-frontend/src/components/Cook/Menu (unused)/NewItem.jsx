import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
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
    this.state.user = this.state.cookies.get("mystaff");
    this.parseStock(props.prefill.in_stock);
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
		} else if(this.state.calories < 0){
			this.handleValidation("Calorie field must be greater than zero.");
		}	else if(isNaN(this.state.price)){
			this.handleValidation("Price field isn't a number.  Please set to a number.");	
		} else if(this.state.price > 100000){
			this.handleValidation("Price field is too large.  Please try a value less than 100,000.");
		} else if(this.state.description.length > 300){
      this.handleValidation("Description field is too large.  Please reduce to 300 characters or less.");
    } else if(this.state.description.length < 1){
      this.handleValidation("Description field is required.");
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
          +'&description='+this.state.description
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
          +'&description='+this.state.description
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
				this.handleShow(false, error.response.data);
				console.error("There was an error!", error);
			});
		}
  }

  getCategories() {
    return (
      this.state.cookies.get('categories').map(category => 
        <option key={category} value={category}>{category}</option>
      )
    )
  }

  /* item needs to be deleted */
  handleDelete(event){
	  event.preventDefault();
    this.setState({ModalShow: false});

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
      this.handleShow(false, error.response.data);
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
      this.setState({response: message})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({show: true});
		console.log("here")
		setTimeout(() => {
			if (this.state.show) this.setState({show:false});
		}, 5000)
  }
	
  handleValidation(message){
	  this.setState({response: message});
	  this.setState({alertVariant: 'danger'});
		
		this.setState({show: true});
		
		setTimeout(() => {
			if (this.state.show) this.setState({show:false});
		}, 5000)
  }
  

  handleModalClose = () => this.setState({ModalShow: false});
  handleModalShow = () => this.setState({ModalShow: true});

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

            <Modal show={this.state.ModalShow} onHide={this.handleModalClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>Delete Item</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleModalClose}>
                  Close
                </Button>
                <Button variant="danger" onClick={this.handleDelete}>
                  Delete item
                </Button>
              </Modal.Footer>
            </Modal>

            <div>
              <form className="pb-1">

                <div className="form-group row">
                  <label className="col ">Name </label>
                    <input className="form-control col" type="text" name="name" onChange={this.handleInputChange} placeholder={this.state.name}>
                    </input>
                </div>

                <div className="form-group row">
                  <label className="col">Category </label>
                  <select name="category" className="form-control col" onChange={this.handleInputChange} placeholder={this.state.category}>
                    {this.getCategories()}
                    <option value="New Category">New Category</option>
                  </select>
                </div>

                  <div className="form-group row">
                    <label className="col">Calories</label>
                    <input className="form-control col" type="text" name="calories" onChange={this.handleInputChange} placeholder={this.state.calories}>
                    </input>
                </div>

                <div className="form-group row">
                <label className="col">Price</label>
                    <div className="col input-group mb-2 mr-sm-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">$</div>
                      </div>
                      <input type="text" className="form-control" name="price" onChange={this.handleInputChange} placeholder={this.state.price}>
                      </input>
                    </div>
                </div>

                <div className="pretty p-switch p-fill d-flex flex-row-reverse">
                  <div>
                    <input type="checkbox" id="in_stock" name="in_stock" onChange={this.handleInputChange} checked={this.state.in_stock}/> 
                    <label className="pl-2" htmlFor="in_stock">In stock</label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="itemDescription">Description</label>
                  <textarea className="form-control" id="itemDescription" rows="3" name="description" onChange={this.handleInputChange} placeholder="300 Character limit"></textarea>
                </div>

                {/* <div class="custom-file">
                  <input type="file" class="custom-file-input" id="customFile"></input>
                  <label class="custom-file-label" for="customFile">Choose file</label>
                </div> */}

                <Form>
                  <label htmlFor="custom-file">Picture</label>
                  <Form.File 
                    id="custom-file"
                    label="Choose file"
                    custom
                    isValid={this.state.show} // needs to be representative of internal state
                    onChange  // needs to update internal state
                    //onClick={(t) => {console.log(this)}}
                  />
                </Form>

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

          <Modal show={this.state.ModalShow} onHide={this.handleModalClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleModalClose}>
                Close
              </Button>
              <Button variant="danger" onClick={this.handleDelete}>
                Delete item
              </Button>
            </Modal.Footer>
          </Modal>

            <div className="d-flex flex-row-reverse pb-3">
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={this.handleModalShow}>Delete Item</button>
            </div>

            <div>
              <form className="pb-1">

                <div className="form-group row">
                  <label className="col ">Name </label>
                    <input className="form-control col" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} defaultValue={this.state.name}>
                    </input>
                </div>

                <div className="form-group row">
                  <label className="col">Category </label>
                  <select name="category" className="form-control col" value={this.state.category} onChange={this.handleInputChange} placeholder={this.state.category}>
                    {this.getCategories()}
                    <option value="New Category">New Category</option>
                  </select>
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

                <div className="pretty p-switch p-fill d-flex flex-row-reverse">
                  <div>
                    <input type="checkbox" id="in_stock" name="in_stock" value={this.state.in_stock} onChange={this.handleInputChange} checked={this.state.in_stock}/> 
                    <label className="pl-2" htmlFor="in_stock">In stock</label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="itemDescription">Description</label>
                  <textarea className="form-control" id="itemDescription" rows="3" name="description" onChange={this.handleInputChange} defaultValue={this.state.description} placeholder="300 Character limit"></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="exampleFormControlFile1">Picture</label>
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