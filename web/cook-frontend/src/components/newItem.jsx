import React from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

/* 
  This component is to allow the manager to 
  create a new item. It returns a form object that allows
  for several options and fields to be submitted.  There
  are no helper functions
*/
function NewItem(props){
    return ( 
        <Container>
          <div>
            <Container fluid>
              <Col className="pt-3 px-3">
                <Container fluid>
                  <div>
                    <form>
                      <div class="form-group">
                        <input class="form-control" type="text" id = "itemName" placeholder="Name">
                        </input>
                       </div>
                       <div class="form-group">
                        <input class="form-control" type="text" id = "itemCategory" placeholder="Category">
                        </input>
                       </div>
                        <div class="form-group">
                          <input class="form-control" type="text" id = "itemCalories" placeholder="Calories">
                          </input>
                       </div>
                       <div class="form-group">
                          <div class="input-group mb-2 mr-sm-2">
                            <div class="input-group-prepend">
                              <div class="input-group-text">$</div>
                            </div>
                            <input type="text" class="form-control" id="inlineFormInputGroupUsername2" placeholder="Price">
                            </input>
                          </div>
                      </div>
                      <div class="form-group">
                        <label for="itemDescription">Description</label>
                        <textarea class="form-control" id="itemDescription" rows="3"></textarea>
                      </div>
                      <div class="form-group">
                        <label for="exampleFormControlFile1">Picture</label>
                        <input type="file" class="form-control-file" id="exampleFormControlFile1">
                        </input>
                      </div>
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="itemInStock">
                        </input>
                        <label class="form-check-label" for="exampleCheck1">Currently in stock</label>
                      </div>
                      <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                  </div>
                </Container>
              </Col>
            </Container> 
          </div>
        </Container>
      ); 
}

export default NewItem;