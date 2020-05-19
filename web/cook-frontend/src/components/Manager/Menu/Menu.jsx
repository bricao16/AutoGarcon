import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import MenuItem from './MenuItem';
import NewItem from './NewItem';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

/*
  This component is used to render menu information which
  is pulled from the database in Manager. 

  The menu and unique categories are put into arrays.
  If we are on the main menu we just display the categories.
  
  If a category is click then we render the menu items with
  that category assigned. If the edit button is clicked on a 
	particular item then the new form will render with prefilled 
	info from the item.

  If the "create new" button is clicked then a new form with
  no prefilled information will render in the state renderCategory
	is what component we are on. Render() checks if the database 
	was properly loaded then it will map the returned menu to a 2d array.

  RenderMenu() will create the call the MenuProp for each 
  item making a Card for each to display.
*/
class Menu extends React.Component {

  constructor(props) {
    super(props);

    this.cookies = new Cookies();
    this.state = {
      menu:[],
      categories: [],
      renderCategory: "main",
      newItem: false,
      showNewCategory: false,
      imageUrls :[],
      showAlert: false,
      token: this.cookies.get("mytoken"),
      newItemPrefill: {
        type: "default",
        item_id: null,
        menu: {
          "name": "Name",
          "category":"Category",
          "price" : "Price",
          "calories": "Calories",
          "in_stock": 0
        },
      }              
    };
    this.updateImageUrl = this.updateImageUrl.bind(this);
    this.getImageBuf = this.getImageBuf.bind(this);
    this.handleAlertShow = this.handleAlertShow.bind(this);
  }

  //convert blob to base 64
  arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;

    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa( binary );
  }

  /* From http://stackoverflow.com/questions/14967647/
     encode-decode-image-with-base64-breaks-image (2013-04-21) */
  fixBinary (bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }

  updateImageUrl(item_id, category) {
    //pull down image if it hasnt been already
    var images = this.state.imageUrls;

    if(images.hasOwnProperty(category))
    {
      return;
    }
    return this.getImageBuf(item_id)
      .then((res) => {
        if (res == null) 
          {
            throw new Error('404')
          }
        /* get logo image data from binary */
        const imageData = this.arrayBufferToBase64(res);
        var binary = this.fixBinary(atob(imageData));
        const blob = new Blob([binary], {type : 'image/png'});
        const blobUrl = URL.createObjectURL(blob);
        
        var joined = this.state.imageUrls;
        if(!this.state.imageUrls.hasOwnProperty(category))
        {
          joined[category] = blobUrl;
          this.setState({ imageUrls: joined });
        }
        this.setState({
          ModalLoading: false,
          blobUrl : blobUrl
        });
      })
      .catch((error) => {
        this.setState({
          imageLoadFailed: true
        })
      });
  }

  async getImageBuf(id) {
    var res = await axios({
      method: 'get',
      url: process.env.REACT_APP_DB + '/menu/image/' + id,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
      .then(async response => {
        await response;

        if (response.status !== 200) { this.handleAlertShow(false, ""); }
        else if (response.data.image == null) throw new Error('404');
        else {
          return response.data.image.data
        }
      })
      .catch(error => {
        this.setState({     
          blobUrl: "https://image.shutterstock.com/z/stock-vector-page-not-found-error-a-hand-drawn-vector-layout-template-of-a-broken-robot-for-your-website-479042983.jpg"
        });
        /* console.error("There was an error!", error); */
      });

    return res
  }

  /* change the category of menu to render */
  changeCategory = (category) => {
      this.setState({
        renderCategory: category
    })
  }

  /* change the newItem state.  Mainly for going back to the main menu page */
  setNewItem = (state) => {
      this.setState({
        newItem: state
    })
  }
  
  /* toggle between creating a new menu item and not */
  toggleNewItem = (itemProperties) => {

      this.setState({
        newItem: !this.state.newItem,
        newItemPrefill: itemProperties
    })
    /* if the new item prefill is default set to default prefill */
    if(itemProperties === "default")
    {
      this.resetNewItem();
    }  
  }

  /* Loading spinner while image is loading */
  loadingImage(item) {
    if (!this.state.imageUrls[item]) {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    }
    else return (<></>)
  }

  /* Aggregate all the menu categories onto cards and call the change which menu to display is clicked */
  renderMenuCategories() {

    const secondary = this.props.secondary;
    const font = this.props.font;

    return this.state.categories.map((item) =>
      <Col key={item} sm={6} className="p-3" style={{'minWidth':'225px'}}>
        <Card className="text-center" >
          <div onClick={() => this.changeCategory(item) }>                     
            <Card.Header style ={{'fontFamily' :font, 'backgroundColor': secondary, 'textAlign' : 'center', 'fontWeight': 'bold'}}>{item}</Card.Header>
             <Card.Body>
                <img src={this.state.imageUrls[item]} alt = "category"  style = {{  'maxHeight': '250px'}} className="img-fluid rounded "></img>
                {this.loadingImage(item)}
              </Card.Body>          
          </div>
        </Card>
      </Col>  
    );
  }

  /* creates default placeholders for the new item */
  resetNewItem() {

    this.setState({
      newItemPrefill: {
        type: "default",
        item_id: null,
        menu: {
          "name": "Name",
          "category":"Category",
          "price" : "Price",
          "calories": "Calories",
          "in_stock": 0,
          "description": ""
        }
      }
    })
  }

  /* render the menu prop of the current category  */
  renderMenu() {
    /* onNew is a callback passed to call the new item form if it is edit is clicked */
    return this.state.menu.map((item, key) =>
      <MenuItem key={item} menu={item} category={this.state.renderCategory} onNew={this.toggleNewItem.bind(this)} primary ={this.props.primary}  secondary ={this.props.secondary}  teritary ={this.props.teritary}  font_color = {this.props.font_color} font ={this.props.font}/>
    );
  };
  
  /* generate form for new item with prefilled of whats already on the menu for this item */
  newItemForm() {
    return <NewItem prefill = {this.state.newItemPrefill}/>
  };

  handleModalClose = () => this.setState({ModalShow: false});
  handleModalShow = () => this.setState({ModalShow: true});

  handleSubmit = (event) => {

    event.preventDefault();
    event.stopPropagation();
    this.setState({
      newCategoryLoading: true
		}); 
		console.log(this.state.token)

		axios({
			method: 'PUT',
			url:  process.env.REACT_APP_DB +'/categories/new',
			data:
				'category_name=' + this.state.newCategory,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Bearer ' + this.state.token
			},
			timeout: 8000,
			httpsAgent: new https.Agent({  
				rejectUnauthorized: false,
			}),
		})
		.then(async response => {
			await response;

			if (response.status !== 200) {this.handleAlertShow(false, response.data);}
			/* The account was successfully updated so the cookies and internal state need to be updated
			 and the edit buttons need to be hidden */
			else {
				this.handleAlertShow(true, "New category added!");
				setTimeout(function(){
					window.location.reload();
				}, 3000);
			}
		})
		.catch(error => {
			if (error.response) {this.handleAlertShow(false, error.response.data);}
			else {this.handleAlertShow(false, "Unknown error!");}
			console.error("There was an error!", error);
		});
		
		this.setState({
			newCategoryLoading: false
		});
	};

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  isLoadingCategory = () => {
    if (this.newCategoryLoading) {
      return (
        <span>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </span>
      )
    } else {
      return (
        <></>
      )
    }
  }

  /* Used to show the correct alert after hitting create category */
  handleAlertShow(success, message) {
    if (success) {
      this.setState({alertResponse: message});
      this.setState({alertVariant: 'success'});
    }
    else {
      this.setState({alertResponse: message})
      this.setState({alertVariant: 'danger'});
    }

    this.setState({showAlert: true});
    setTimeout(() => {
      if (this.state.showAlert) this.setState({showAlert:false});
    }, 5000)
  }

  /*  Default render method */
  render() {
    /* clear the menu each time we load */
    this.state.menu = [];

    const {menu,categories,renderCategory, newItem} = this.state;
    const menuJSON = this.props.menu;
    /* get the styles */
    const primary = this.props.primary;
    const font = this.props.font;
    const font_color = this.props.font_color;
    const name = this.props.name.name;
    /* map the menu json from Mtasks to an array */
    Object.keys(menuJSON).forEach(function(key) {
      menu.push([key ,menuJSON[key]]);
    });

    this.state.menu.map((item) =>
      this.updateImageUrl(item[1].item_id, item[1].category)
    );
    /* create a list of all unique categories of food/drink */
    const values = menu.values();
    for (const value of values) {
        if(categories.indexOf(value[1].category) === -1){
          categories.push( value[1].category)
        }
    }
    /* if the render category is main then render all the categories of food/drink of this resturant */
    if(renderCategory === "main" && newItem === false)
    {
      return (
      <>
			<Modal show={this.state.ModalShow} onHide={this.handleModalClose} style={{"left": "200px"}} centered>
				<Modal.Header closeButton>
					<Modal.Title>Create new category</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="container">
						<Alert show={this.state.showAlert} variant={this.state.alertVariant}>
								{this.state.alertResponse}
						</Alert>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Category name</Form.Label>
								<Form.Control type="input" placeholder="Category" name="newCategory" onChange={e => this.handleChange(e)}/>
							</Form.Group>
							<Button variant="primary" type="submit">
								Create
							</Button>
							{this.isLoadingCategory}
						</Form>
					</div>
				</Modal.Body>
			</Modal>

			<Container>
				<div style={backgroundStyle}>
					<h2  style={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color, 'textAlign' : 'center','height':'54px', 'paddingTop':'8px'}}>
						{name } Menu
					</h2>
					<Container fluid style={{'minHeight': '70vh'}}>
						<div className="d-flex flex-wrap">
							{this.renderMenuCategories()}
              </div>
              <div className="d-flex flex-wrap">
							<Col sm={6} className="p-3">
								<Card className="text-center" >
									<div onClick={() => this.toggleNewItem("default") }>                     
										<Card.Header style={createNewStyle}>Create New Item</Card.Header>
									</div>
								</Card>
							</Col>
							<Col sm={6} className="p-3">
								<Card className="text-center" >
									<div onClick={this.handleModalShow}>                     
										<Card.Header style={createNewStyle}>Create New Category</Card.Header>
									</div>
								</Card>
							</Col>  
						</div>
					</Container>
				</div>
			</Container>
			</>
		);
	}
    else if (renderCategory !== "main" && newItem === false){
      /* render the proper menu based on the current category */
      return ( 
        <Container>
          <div style={backgroundStyle}>
            <h2 style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color, 'textAlign' : 'center','display': 'flex'}}>
              <button type="button" onClick={() => window.location.href="/menu" } className="btn btn-outline-light m-2">Back</button>
              <div style={menuTextStyle}>{renderCategory}</div>
            </h2>

            <Container fluid style={{'minHeight': '70vh'}}>
              <div className="d-flex flex-wrap">
                {this.renderMenu()}                
              </div>
              <Col sm={12} className="p-3"> {/*add a create new item option*/}
                <Card className="text-center" >
                  <button className="btn btn-link m-2" onClick={() =>  this.toggleNewItem("default") }>                     
                    Create New
                  </button>
                </Card>
              </Col> 
            </Container> 
          </div>
        </Container>
      );
    }
    else{
      /* render a form for the new menu item(s) */
      return (
        <div style={backgroundStyle}>
          <h2 style ={{'fontFamily' :font, 'backgroundColor': primary, 'color': font_color, 'textAlign' : 'center','display': 'flex'}}>
            <button type="button" onClick={() => window.location.href="/menu"} className="btn btn-outline-light m-2">Back</button>
            <div style={menuTextStyle}>Menu Item</div>
          </h2>
          {this.newItemForm()}
        </div>
      );
    }
  }
}

const backgroundStyle = {
  'backgroundColor': '#f1f1f1',
  'minWidth': '70vw'
};
const createNewStyle = {
  'opacity' : '.9'
};
const menuTextStyle = {
  'flex': '1',
  'fontWeight': 'bold',
  'paddingRight': '69px',
  'paddingTop': '8px'
};

export default Menu;
