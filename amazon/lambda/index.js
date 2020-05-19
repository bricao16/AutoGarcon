// Handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
//
// Currently our most functional version of Auto garcon . Consider testing in another skill before making
// significant changes here. 
//
const Alexa = require('ask-sdk-core');
const http = require('http');
const https = require('https');
const api = 'http://50.19.176.137:8000';
const apissl = 'https://50.19.176.137:8001';
var AlexaID = '';
var restaurantID = null;
var tableNum = null;

// When skill is first invoked, need to find Alexa device ID here to determine which restaurant the Alexa device is currently at.
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    AlexaID = handlerInput.requestEnvelope.context.System.device.deviceId.toString();
    var speakOutput = '';
    try {
      // these will error and get caught if the Alexa device hasnt been registered
      const alexaResponse = await getHttp(api+'/alexa/'+AlexaID);
      const alexaResponseJSON = JSON.parse(alexaResponse);
      
      restaurantID = alexaResponseJSON[AlexaID].restaurant_id;
      tableNum = alexaResponseJSON[AlexaID].table_num;
      
      const restaurantResponse = await getHttp(api+'/restaurant/'+alexaResponseJSON[AlexaID].restaurant_id);
      const restaurantResponseJSON = JSON.parse(restaurantResponse);
      const restaurantName = restaurantResponseJSON['restaurant'].name;
    
      speakOutput = restaurantResponseJSON['restaurant'].greeting;

      handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
        
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`This Alexa isn't registered. Please add it by saying "register this device".`)
        //.withShouldEndSession(false)
        .getResponse();
    }
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
};//LaunchRequestHandler

// helper function for put http calls
const putHttp = function(path, data){
  const options = {
    hostname: '50.19.176.137',
    port: 8000,
    path: path,
    method: 'PUT',
    headers: {
     'Content-Type': 'application/json',
     'Content-Length': data.length
    }
  };
  const req = http.request(options, (res)=>{
    console.log(`statusCode: ${res.statusCode}`);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  req.on('error', (error)=>{
    console.error(error)
  });
  req.write(data);
  req.end();
};//putHttp

// helper function for put http calls
// this was created to eventually replace the other putHttp, it better handles request responses
const putHttp2 = function(path, data){
  let response = '';
  const options = {
    hostname: '50.19.176.137',
    port: 8000,
    path: path,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res)=>{
      res.setEncoding('utf8');
    //   if (res.statusCode < 200 || res.statusCode >= 300) {
    //     return reject(res.statusCode);
    //   }

      res.on('data', (d) => {
        response += d;
      });
      res.on('end', () => {
        resolve(response);
      });
      res.on('error', error => {
        reject(error);
      });
    });
    req.on('error', (error)=>{
      reject(error);
    });
    req.write(data);
    req.end();
  });
};//putHttp2

// helper function for post http calls
const postHttp = function(path, data){
  let response = '';
  const options = {
    hostname: '50.19.176.137',
    port: 8000,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res)=>{
      res.setEncoding('utf8');
      if (res.statusCode < 200 || res.statusCode >= 300) {
        //return reject(new Error(`${res.statusCode}: ${res.req.getHeader('host')} ${res.req.path}`));
        resolve(res.statusCode);
        //response += res.statusCode;
      }
      res.on('data', (d) => {
        response += d;
      });
      res.on('end', () => {
        resolve(response);
      });
      res.on('error', error => {
        reject(error);
      });
    });
    req.on('error', (error)=>{
      reject(error);
    });
    req.write(data);
    req.end();
  });
};//postHttp

// helper function for get http calls
const getHttp = function(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(`${url}`, response => {
      response.setEncoding('utf8');
           
      let returnData = '';
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
        //resolve(response.statusCode);
        //returnData += response.statusCode;
      }
          
      response.on('data', chunk => {
        returnData += chunk;
      });
           
      response.on('end', () => {
        resolve(returnData);
      });
           
      response.on('error', error => {
        reject(error);
      });
    });//request
    request.end();
  });//promise
};//getHttp

const getHttps = function(path) {
    const options = {
        hostname: '50.19.176.137',
        port: 8001,
        path: path,
        method: 'GET',
        rejectUnauthorized: false
    };
    
    return new Promise((resolve, reject) => {
        const request = https.request(options, response => {
            response.setEncoding('utf8');
               
            let returnData = '';
            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
            }
              
            response.on('data', chunk => {
                returnData += chunk;
            });
               
            response.on('end', () => {
                resolve(returnData);
            });
               
            response.on('error', error => {
                reject(error);
            });
        });//request
    request.end();
  });//promise
}

//Intent that will allow the restaurant to add a new Alexa device to the database
const addNewAlexaHandler = {
  canHandle(handlerInput)
  {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AddNewAlexaIntent'
  },
  async handle(handlerInput)
  {
    try{
      const request = handlerInput.requestEnvelope.request;
      const currentIntent = handlerInput.requestEnvelope.request.intent;
            
      //Checks to see if the Alexa has already been added
      if(await getHttp(api+'/alexa/'+AlexaID) !== "This alexa does not exist"){
        return handlerInput.responseBuilder
          .speak('This Alexa has already been added')
          .withShouldEndSession(false)
          .getResponse();
      }
        
      //TODO: Check to see if the restaurant ID is valid
        
      //if the dialog isn't complete, it will delegate to Alexa to collect all the required slots
      if (handlerInput.requestEnvelope.request.dialogState && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED') {
        return handlerInput.responseBuilder
          .addDelegateDirective(currentIntent)
          .getResponse();
      }
      //once the dialog is complete, it will grab all the slots collected and create a JSON object to send to the database
      else{
        const tableNum = handlerInput.requestEnvelope.request.intent.slots.TableNumberSlot.value;
        const restaurantID = handlerInput.requestEnvelope.request.intent.slots.RestaurantIDSlot.value;
                
        //Creates a JSON object with new device's information
        let newAlexa = JSON.stringify({
          alexa_id: AlexaID,
          restaurant_id: restaurantID,
          table_num: tableNum
        });
        
        //adds the new Alexa to the database        
        putHttp('/alexa/register', newAlexa);
        const speakOutput = 'The new Alexa has been added.';

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .getResponse();
        }
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while adding the Alexa. Please try again.`)
        .withShouldEndSession(false)
        .getResponse();
    }
  }//handle
}//addNewAlexaHandler

//Intent that lists off the items that are in a table's pending order
const GetPendingOrderHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPendingOrderIntent'
  },
  async handle(handlerInput) {
    try{
      //grabs message if there is a pending order
      let pendingResponse = await getHttp(api+'/alexa/pending/'+AlexaID);
      let pendingResponseJSON = JSON.parse(pendingResponse);
      let messageResponse = pendingResponseJSON.message;
            
      //If there's a pending order
      if(messageResponse === 'Pending order exists'){
        let speakOutput = 'Your pending order: ';
        const request = handlerInput.requestEnvelope.request;
        const currentIntent = handlerInput.requestEnvelope.request.intent;
                
        const response = await getHttp(api + '/alexa/order/' + AlexaID);
        const responseJSON = JSON.parse(response);
                
        //loops through each item in the order and grabs the quantity and name of the item
        for(let key in responseJSON){
          let item = responseJSON[key].item_name;
          if(responseJSON[key].quantity > 1){
              item = item + "s";
          }
          speakOutput += responseJSON[key].quantity + " " + item + "(" + responseJSON[key].customization + "), ";
        }
                
        speakOutput += "If you would like to add more items, please say 'add item'. If you would like to place your order, please say 'place order'";
                
        handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .getResponse();
      }else{//no pending order
        handlerInput.responseBuilder
          .speak("There are no items in your order.")
          .withShouldEndSession(false)
          .getResponse();
      }
    }catch(error){
      handlerInput.responseBuilder
        .speak("There was an error while getting your order. Please try again.")
        .withShouldEndSession(false)
        .getResponse();
    }
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
}//GetPendingOrderHandler

//Intent that allows customers to add to a pending order
const AddItemToOrderHandler = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AddItemToOrder'
  },
  async handle(handlerInput){
    try{
      const request = handlerInput.requestEnvelope.request;
      const currentIntent = handlerInput.requestEnvelope.request.intent;

      //Delegates to Alexa until all the slots are grabbed
      if (handlerInput.requestEnvelope.request.dialogState && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED') {
        return handlerInput.responseBuilder
          .addDelegateDirective(currentIntent)
          .getResponse();
      }else{
        //grabs message if there is a pending order
        let pendingResponse = await getHttp(api+'/alexa/pending/'+AlexaID);
        let pendingResponseJSON = JSON.parse(pendingResponse);
        let messageResponse = pendingResponseJSON.message;
                
        //Sets the info needed for an order
        let orderNum = null;
        let menuItem = handlerInput.requestEnvelope.request.intent.slots.menuItem.value.toLowerCase();
        let quantityNum = handlerInput.requestEnvelope.request.intent.slots.quantity.value;
        let customizeSlot = handlerInput.requestEnvelope.request.intent.slots.customizations.value;
        let customize = "";
        //if the customer doesn't want any customizations, it will set the variable to a blank string;
        if(customizeSlot === 'no customizations')
        {
          customize = '';
        }else{
          for(let i = 0; i < quantityNum; i++){
            customize = customize + customizeSlot + ";";      
          }
        }//else there are customizations
                
        let menuItemValid = false;
        let quantityNumValid = true;
        let itemID;
                
        let speakOutput = "";
                
        //Checks to see if the menuItem the customer said is an actual item on the menu
        const response = await getHttp(api+'/menu/'+restaurantID);
        const responseJSON = JSON.parse(response);
        for (var key in responseJSON) {
          if(responseJSON[key].in_stock > 0){
            if(key.toLowerCase() === menuItem){
              itemID = responseJSON[key].item_id;
              menuItem = key;
              menuItemValid = true;
            }
          }
        }//for each key in the menu
                
        //Checks if the quantity and menu item are valid
        if(quantityNum <= 0){
          quantityNumValid = false;
          speakOutput = "The quantity has to be at least one. "
        }
        if(menuItemValid === false){
          speakOutput = speakOutput + "The item you are trying to add isn't valid."
        }
                
        //if there's already a pending order, the alexa will add to that order
        if(messageResponse === 'Pending order exists'){
          orderNum = pendingResponseJSON.order_num;
        }else{ //if there isn't a pending order, it will create a new one 
          //Creates a new order
          const newOrder = JSON.stringify({
            restaurant_id: restaurantID,
            alexa_id: AlexaID,
            table_num: tableNum
          });
          await putHttp('/alexa/order/new', newOrder);
             
          //Gets the new order's order number
          pendingResponse = await getHttp(api+'/alexa/pending/'+AlexaID);
          pendingResponseJSON = JSON.parse(pendingResponse);
          orderNum = pendingResponseJSON.order_num;
        }//else no pending order
                
        //if the quantity and menu item are valid, the menu item will be added
        if(quantityNumValid === true && menuItemValid === true){
          const body = JSON.stringify({
            order_num: orderNum,
            item_id: itemID,
            quantity: quantityNum,
            customization: customize
          });//body

          await putHttp('/alexa/order/update', body);
          
          if(quantityNum > 1){
            menuItem = menuItem + "s have";
          }else{
            menuItem = menuItem + "has"
          }
          
          if(customize === ''){
            speakOutput = quantityNum + " " + menuItem + " been added to your order.";
          }else{
            speakOutput = quantityNum + " " + menuItem + " been added to your order with customizations, " + customizeSlot;
          }
        }//if valid
                
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .getResponse();
      }//else
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while adding the item to the order. Please try again.`)
        .withShouldEndSession(false)
        .getResponse();
    }
  }//handle
}//AddItemToOrderHandler

//Intent that allows customers to remove from a pending order
const RemoveItemFromOrderHandler = {
  canHandle(handlerInput){
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'RemoveItemFromOrder'
  },
  async handle(handlerInput){
    try{
      const request = handlerInput.requestEnvelope.request;
      const currentIntent = handlerInput.requestEnvelope.request.intent;

      //Delegates to Alexa until all the slots are grabbed
      if (handlerInput.requestEnvelope.request.dialogState && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED') {
        return handlerInput.responseBuilder
          .addDelegateDirective(currentIntent)
          .getResponse();
      }else{
          
        let menuItem = handlerInput.requestEnvelope.request.intent.slots.menuItem.value.toLowerCase();
        let itemID;

        // sets the itemID 
        const response = await getHttp(api+'/menu/'+restaurantID);
        const responseJSON = JSON.parse(response);
        for (var key in responseJSON) {
            if(key.toLowerCase() === menuItem){
              itemID = responseJSON[key].item_id;
              menuItem = key;
            }
        }//for each key in the menu
          
        let speakOutput = '';
      
        // sets the orderiD for the current pending order set with this Alexa
        let pendingResponse = await getHttp(api+'/alexa/pending/'+AlexaID);
        let pendingResponseJSON = JSON.parse(pendingResponse);
        let orderNum = pendingResponseJSON.order_num;
        let quantityNum = 0;
      
        // creates body for post update http
        let body = JSON.stringify({
          order_num: orderNum,
          item_id: itemID,
          quantity: quantityNum
        });
      
        let submittingResponse = '';
        //speakOutput += orderNum +' '+itemID+' '+quantityNum;
        //speakOutput += body;
        try{
          submittingResponse = await postHttp('/alexa/order/remove', body);
        }catch(error){
          submittingResponse = 'There was a problem connecting to the Database';
          // submittingResponse will fail the success check 
        }
        //speakOutput += submittingResponse;
  
        // could be revamped with the other status codes but this is the only one ive been able to receive. 
        if (submittingResponse !== 'Successfully updated order!'){
          speakOutput += 'There was a problem changing your order.'
        }else{
          speakOutput = 'Removed '+menuItem+' from your order.'
        }
      
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .getResponse();
      }//else
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while removing the item from the order. Please try again.`)
        .withShouldEndSession(false)
        .getResponse();
    }
  }//handle
}//RemoveItemFromOrderHandler

// Intent for changing the current pending order assoc with this Alexa ID to In Progress
const SubmitOrderIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MakeOrderInProgressIntent';
  },
  async handle(handlerInput) {
    try{
      let speakOutput = '';

      // gathers information required to update order status
      let status = 'In Progress';
      let pendingResponse = await getHttp(api+'/alexa/pending/'+AlexaID);
      let pendingResponseJSON = JSON.parse(pendingResponse);
      let orderNum = pendingResponseJSON.order_num;
      
      // creates body for post update http
      let body = JSON.stringify({
        order_num: orderNum,
        order_status: status
      });
      
      let submittingResponse = '';

      try{
        submittingResponse = await postHttp('/orders/update', body);
      }catch(error){
        // submittingResponse will fail the success check 
      }

      // could be revamped with the order order codes but this is the only one ive been able to receive. 
      if (submittingResponse !== 'Successfully updated order!'){
        speakOutput += 'There was a problem sending your order to the kitchen.'
      }else{
        speakOutput = 'Successfully sent order number ' + orderNum + ' to the kitchen.'
      }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
        
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while submitting the order. Please try again.`)
        .withShouldEndSession(false)
        .getResponse();        
    }
  }
};

// Intent for changing the current pending order assoc with this Alexa ID to Cancelled
const CancelOrderIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CancelOrderIntent';
  },
  async handle(handlerInput) {
    if (handlerInput.requestEnvelope.request.intent.confirmationStatus === "DENIED") {
      return handlerInput.responseBuilder
        .speak('Okay. We did not cancel your order.')
        .withShouldEndSession(false)
        .getResponse(); 
    }
      
    try{
      let speakOutput = '';

      // gathers information required to update order status
      let status = 'Cancelled';
      let pendingResponse = await getHttp(api+'/alexa/pending/'+AlexaID);
      let pendingResponseJSON = JSON.parse(pendingResponse);
      let orderNum = pendingResponseJSON.order_num;
      
      if(pendingResponseJSON.message === 'No pending order exists'){
        speakOutput = 'There is no order to cancel.';
      }else{

        // creates body for post update http
        let body = JSON.stringify({
          order_num: orderNum,
          order_status: status
        });
      
        let submittingResponse = '';

        try{
          submittingResponse += await postHttp('/orders/update', body);
        }catch(error){
          // submittingResponse will fail the success check 
        }

        // could be revamped with the order order codes but this is the only one ive been able to receive. 
        if (submittingResponse !== 'Successfully updated order!'){
          speakOutput += 'There was a problem cancelling your order.'
        }else{
          speakOutput += 'Okay. We cancelled order number ' + orderNum;
        }
      }
      
      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse(); 
      
        
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while cancelling the order. Please try again.`)
        .withShouldEndSession(false)
        .getResponse();        
    }
  }
};

//Intent that recites only requested allergens items (gluten, peanuts, etc.)
const AllergensMenuHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AllergensMenuIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    let allergensSlot = handlerInput.requestEnvelope.request.intent.slots.allergen.value.toLowerCase();
    let count = 0;

    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
      for (var key in responseJSON) {
        var allAllergens = responseJSON[key].allergens;

        for(var i = 0; i < allAllergens.length; i++){
          if(allAllergens[i].toLowerCase() === allergensSlot){
            if(responseJSON[key].in_stock > 0){
              speakOutput += key +", ";
            }//if in stock
          }//if equal to selected allergen
        }//for each items allergens
      }//for each menu item

      handlerInput.responseBuilder
        .speak(speakOutput+" contain "+allergensSlot)
        .withShouldEndSession(false)
        .getResponse();
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`I wasn't able to get the data`)
        //.speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
    }
    
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
      
    }//handle
};//AllergensMenuHandler

//intent that gets the closing time using an http get request and converts it to a string
const ClosingTimeIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ClosingTimeIntent';
  }, 
  async handle(handlerInput){
    var speakOutput = '';
    var repromptOutput = 'reprompt';
    try {
      const response = await getHttp(api+'/restaurant/'+restaurantID);
      const responseJSON = JSON.parse(response);
      const closingTimeJSON = ((responseJSON['restaurant'].closing)+11)%12 +1;
      var ampm = "";
        
      if (responseJSON['restaurant'].closing > 11){
        ampm = "pm";
      }else{
        ampm = "am";
      }
        
      const closingTimeOutput = "The closing time is " + closingTimeJSON + ampm;
      speakOutput = closingTimeOutput;
            
      handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
            
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`I wasn't able to get the data`)
        .withShouldEndSession(false)
        .getResponse();
    }
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
};//ClosingTimeIntentHandler

//Intent that, when the customer asks to hear the menu, will ask them which category of menu they would like to hear, or will recite the entire menu
const MenuDialogHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuDialogIntent'
  }, 
  async handle(handlerInput) {
    try{
      let speakOutput = '';
      const request = handlerInput.requestEnvelope.request;
      const currentIntent = handlerInput.requestEnvelope.request.intent;
            
      if (handlerInput.requestEnvelope.request.dialogState && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED') {
        return handlerInput.responseBuilder
          .addDelegateDirective(currentIntent)
          .getResponse();
      }else{
        let categorySlot = handlerInput.requestEnvelope.request.intent.slots.category.value.toString().toLowerCase();
        const response = await getHttp(api+'/menu/'+restaurantID);
        const responseJSON = JSON.parse(response);
        if(categorySlot === 'full menu'){
          for(let key in responseJSON){
            if(responseJSON[key].in_stock > 0){
              speakOutput += key + ", ";
            }
          }//for
        }else{
          for (let key in responseJSON) {
            if(responseJSON[key].in_stock > 0){
              if(responseJSON[key].category.toLowerCase() === categorySlot){
                speakOutput += key +", ";
              }
            }
          }//for   
        }//else
                
        handlerInput.responseBuilder
          .speak(speakOutput)
          .withShouldEndSession(false)
          .getResponse();
      }//else
    }catch(error){
      handlerInput.responseBuilder
        .speak("There was an error while getting the menu. Please try again.")
        .withShouldEndSession(false)
        .getResponse();
    }//catch
        
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
}//MenuDialogHandler


//Intent that recites only requested category of the menu (ie. appetizer, entree, refillible drink, alcohol)
const MenuCategoryIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuCategoryIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    var repromptOutput = "What would you like?";
    let categorySlot = handlerInput.requestEnvelope.request.intent.slots.category.value.toString().toLowerCase();

    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
                
      for (var key in responseJSON) {
        if(responseJSON[key].category.toLowerCase() === categorySlot){
          if(responseJSON[key].in_stock > 0){
            speakOutput += key +", ";
          }//if in stock
        }//if item is equal to selected category
      }//for each menu item
                
      handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`I wasn't able to get the data`)
        .withShouldEndSession(false)
        .getResponse();
    }
    
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
      
    }//handle
};//MenuCategoryIntentHandler

//Intent that gets the description of the requested menu item
const GetDescriptionHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetDescriptionIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    var repromptOutput = "Which item do you want the description of?";
    //let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.resolutions.resolutionsPerAuthority[0].values[0].value.name.toString().toLowerCase();
    let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.value.toString().toLowerCase();

    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
      var isItem = false;
      
      for(var key in responseJSON){
        if(key.toLowerCase() === menuItemSlot){
          //Checks if the requested menu item is in stock. If it is, it will tell the description of the item. It it isn't, it tells the customer we're out            
          if(responseJSON[key].in_stock > 0){
            speakOutput = menuItemSlot + " description: " + responseJSON[key].description;
          }else if(responseJSON[key].in_stock <= 0){
            speakOutput = "Sorry, we are out of " + menuItemSlot;
          }
          isItem = true;
        }//if equal to selected menu item  
      }//for each menu item
      
      if(isItem === false){
          speakOutput = "The item you requested isn't a valid item. Please try again."
      }
                
      handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`Sorry, I couldn't find ` + menuItemSlot + ` on the menu`)
        .withShouldEndSession(false)
        .getResponse();
    }
    
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
};//GetDescriptionHandler

//Intent that gets the price of the requested menu item
const GetPriceIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPriceIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    var repromptOutput = "Which item do you want the price of?";
    //let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.resolutions.resolutionsPerAuthority[0].values[0].value.name.toString().toLowerCase();
    let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.value.toString().toLowerCase();
    var isItem = false;

    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
      
      for(var key in responseJSON){
        if(key.toLowerCase() === menuItemSlot){
          //Checks if the requested menu item is in stock. If it is, it will tell the price of the item. It it isn't, it tells the customer we're out            
          if(responseJSON[key].in_stock > 0){
            speakOutput = menuItemSlot + " costs $" + responseJSON[key].price;
          }else if(responseJSON[key].in_stock <= 0){
            speakOutput = "Sorry, we are out of " + menuItemSlot;
          }
          isItem = true;
        }//if equal to selected menu item  
      }//for each menu item
               
      if(isItem === false){
          speakOutput = "The item you requested isn't a valid item. Please try again."
      }               
                
      handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`Sorry, I couldn't find ` + menuItemSlot + ` on the menu`)
        .withShouldEndSession(false)
        .getResponse();
    }
    
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
};//GetPriceIntentHandler

//Intent that, when given a valid menu item, will return the number of calories in it
const GetCaloriesIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetCaloriesIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    var repromptOutput = "Which item do you want to know the calories of?";
    let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.value.toString().toLowerCase();
    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
      var isItem = false;
                
      for(var key in responseJSON){
        if(key.toLowerCase() === menuItemSlot){
          if(responseJSON[key].in_stock > 0){
            speakOutput = menuItemSlot + " has " + responseJSON[key].calories + " calories";
          }else if(responseJSON[key].in_stock <= 0){
            speakOutput = "Sorry, we are out of " + menuItemSlot;
          }
          isItem = true;
        }//if equal to selected menu item
      }//for each menu item
                
      if(isItem === false){
          speakOutput = "The item you requested isn't a valid item. Please try again."
      }                
                
      handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`Sorry, I couldn't find ` + menuItemSlot + ` on the menu`)
        .withShouldEndSession(false)
        .getResponse();
    }
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }//handle
};//GetCaloriesIntentHandler

//Requests server assistance
const ServerAssistanceIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ServerAssistanceIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    try {
      let body = JSON.stringify({
        restaurant_id: restaurantID,
        table_num: tableNum,
        status: "Help"
      });

      let submittingResponse = '';
      try{
        submittingResponse = await postHttp('/services/update/', body);
      }catch(error){
        submittingResponse = 'There was a problem connecting to the Database';
      }

      // could be revamped with the other status codes but this is the only one ive been able to receive. 
      if (submittingResponse !== 'Successfully updated status!'){
        speakOutput = 'There was a problem while requesting for a server. Please try again.';
      }else{
        speakOutput = "The restaurant has been notified and a server will be with you shortly."
      }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
                
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`Sorry, I couldn't request assistance from a server.`)
        .withShouldEndSession(false)
        .getResponse();
    }
  }//handle
};

//Requests server assistance
const RequestBillIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RequestBillIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    try {
      let body = JSON.stringify({
        restaurant_id: restaurantID,
        table_num: tableNum,
        status: 'Bill'
      });
        
      let submittingResponse = '';
      try{
        submittingResponse = await postHttp('/services/update/', body);
      }catch(error){
        submittingResponse = 'There was a problem connecting to the Database';
      }

      // could be revamped with the other status codes but this is the only one ive been able to receive. 
      if (submittingResponse !== 'Successfully updated status!'){
        speakOutput = 'There was a problem while requesting the bill. Please try again.';
      }else{
        speakOutput = "The restaurant has been notified and you will receive your bill shortly.";
      }

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withShouldEndSession(false)
        .getResponse();
                
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`Sorry, there was a problem while requesting the bill. Please try again.`)
        .withShouldEndSession(false)
        .getResponse();
    }
  }//handle
};

// An intent that lists off all the commands a customer can ask Alexa
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = "Some commands you can ask me are: read menu, order, remove item from order, add item to order, start the order over, what's in my order, how many calories are in an item, what's the price of an item, decription of an item, allergen menu, and when is closing time";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .getResponse();
  }
};//HelpIntentHandler

// exits the skill entirely with words like stop, exit, etc.
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .getResponse();
  }
};//CancelAndStopIntentHandler

// I dont think a user can call this, i beleive its called automatically when skill ends
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder
      .withShouldEndSession(false)
      .getResponse();
  }
};//SessionEndedRequestHandler

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .getResponse();
  }
};//IntentReflectorHandler

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false)
      .getResponse();
  }
};//ErrorHandler

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    MenuDialogHandler,
    MenuCategoryIntentHandler,
    GetPriceIntentHandler,
    GetCaloriesIntentHandler,
    GetDescriptionHandler,
    addNewAlexaHandler,
    AddItemToOrderHandler,
    CancelOrderIntentHandler,
    ClosingTimeIntentHandler,
    SubmitOrderIntentHandler,
    RemoveItemFromOrderHandler,
    GetPendingOrderHandler,
    AllergensMenuHandler,
    ServerAssistanceIntentHandler,
    RequestBillIntentHandler,

    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler, 
    // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  )
  .addErrorHandlers(
    ErrorHandler,
  )
  .lambda();





