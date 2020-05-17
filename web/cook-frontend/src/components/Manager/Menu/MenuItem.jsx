import React from "react";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import https from 'https';
import axios from 'axios';

/*
    This Prop is used to render the cards of the Manager Menu page.
    The menu is a 2d array with the first array containing only
    the title of the food item. The second array contains the category,
    price, calories, picture and whether the item is in stock.

    getStockState is a helper function which takes in_stock property
    which is either 0 or 1 and creates the appropriate text to display.

    NewItemForm is a callback to create a new item form when the edit 
    button is click for a particular item
*/
class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageLoadFailed: false
    };
  }

  /* Parsing stock data for internal state consumption */
  getStockState(in_stock){
    if(in_stock === 0) {
      return "Out of Stock";
    }
    else {
      return "In Stock";
    }
  }

  handleModalClose = () => this.setState({ModalShow: false});
  handleModalShow = async (event) => {
    this.setState({
      ModalShow: true,
      ModalLoading: true
    });
    await this.updateImageUrl();
    if (this.state.imageLoadFailed) {
      this.setState({
        ModalLoading: false,
        blobUrl: "https://image.shutterstock.com/z/stock-vector-page-not-found-error-a-hand-drawn-vector-layout-template-of-a-broken-robot-for-your-website-479042983.jpg"
      })
    }
  }

  /* callback to newitemform when clicked edit button */
  NewItemForm(e) {
    if (typeof this.props.onNew === 'function') {
      var props = {
        type: "existing",
        item_id: this.props.menu[1].item_id,
        menu: {
          "name": this.props.menu[0],
          "category": this.props.menu[1].category,
          "price" : this.props.menu[1].price,
          "calories": this.props.menu[1].calories,
          "in_stock": this.props.menu[1].in_stock,
          "description": this.props.menu[1].description
        }
      }
      this.props.onNew(props);
    }
  }

  /* convert blob to base 64 */
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

  updateImageUrl() {
    /* pull down image because modal is showing */
    return this.getImageBuf(this.props.menu[1].item_id)
		.then((res) => {
			if (res == null) throw new Error('404')

			/* get logo image data from binary */
			const imageData = this.arrayBufferToBase64(res);
			var binary = this.fixBinary(atob(imageData));
			const blob = new Blob([binary], {type : 'image/png'});
			const blobUrl = URL.createObjectURL(blob);
	
			this.setState({
				ModalLoading: false,
				blobUrl: blobUrl
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

        if (response.status !== 200) { this.handleShow(false, ""); }
        else if (response.data.image == null) throw new Error('404');
        else {
          return response.data.image.data
        }
      })
      .catch(error => {
        this.setState({ imageLoadFailed: true });
        console.error("There was an error!", error);
      });

    return res
  }

  loading() {
    if (this.state.ModalLoading) {
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

  render(){
    //get the styles

    const secondary = this.props.secondary;

    const font = this.props.font;

    if(this.props.menu[1].category === this.props.category)
    {
        return(
        <>
          <Modal show={this.state.ModalShow} onHide={this.handleModalClose} style={{"left": "200px"}}centered>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.menu[0]}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  <div className="col">
                    <div style={modalImageStyle}>
                      <img src={this.state.blobUrl} alt = "food item" className="img-fluid rounded float-left"></img>
                      {this.loading()}
                    </div>
                  </div>
                  <div className="col">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">{this.getStockState(this.props.menu[1].in_stock)}</li>
                      <li className="list-group-item">${this.props.menu[1].price}</li>
                      <li className="list-group-item">Calories: {this.props.menu[1].calories}</li>
                      <li className="list-group-item">{this.props.menu[1].description}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          
          <Card className="text-center m-2" style={itemStyle}>

              <Card.Header onClick={this.handleModalShow} style ={{'fontFamily' :font, 'backgroundColor': secondary,  'textAlign' : 'center','display': 'flex'}}>
                {this.props.menu[0]}
              </Card.Header>
              <div onClick={() => this.NewItemForm()} style={editButtonStyle} className='p-1'>
                 <i className='fas fa-edit'></i> 
              </div>
              <Card.Body onClick={this.handleModalShow} style={{'cursor':'pointer'}}>
                <p style={{margin: "0", padding: "0.3em"}}>${this.props.menu[1].price} </p>
                <p style={{margin: "0", padding: "0.3em"}}>Calories: {this.props.menu[1].calories} </p>
                <i> <p style={{margin: "0", padding: "0.3em"}}>{this.getStockState(this.props.menu[1].in_stock)} </p></i>
              </Card.Body>
          </Card>
        </>
      ) 
    }
    else{
      return (
        <p></p>
      )
    }
  }
}

const itemStyle = {
  'width':'200px'
};
const modalImageStyle = {
  'maxWidth': '200px',
  'maxHeight': '200px'
}
const editButtonStyle = {
  'cursor':'pointer',
  'color': 'white',
  'position': 'absolute',
  'right': '0'
};

export default MenuItem;