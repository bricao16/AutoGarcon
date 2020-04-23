// Handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
//
// Currently our most functional version of Auto garcon . Consider testing in another skill before making
// significant changes here. 
//
const Alexa = require('ask-sdk-core');
const http = require('http');
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
    
      speakOutput = "Hi, Welcome to " + restaurantName + "! Thank you for using AutoGarcon Alexa to place your order. How can I help you?";

      handlerInput.responseBuilder
        .speak(speakOutput)
        
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`This Alexa isn't registered. Please add it by saying "register this device".`);
    }
    return handlerInput.responseBuilder
      .reprompt(`speakOutput`)
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
};

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
};

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
        return reject(new Error(`${res.statusCode}: ${res.req.getHeader('host')} ${res.req.path}`));
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
};

// helper function for get http calls
const getHttp = function(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(`${url}`, response => {
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
};//getHttp

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
          .reprompt("Please enter the restaurant ID and table num.")
          .getResponse();
        }
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while adding the Alexa. Please try again.`);
    }
  }//handle
}//addNewAlexaHandler

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
            item: itemID,
            quantity: quantityNum
          });

          await putHttp2('/alexa/order/update', body);
          speakOutput = quantityNum + " " + menuItem + " has been added to your order."
          
          
          
        }//if valid
                
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse()
      }//else
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while adding the item to the order. Please try again.`);
    }
  }//handle
}//AddItemToOrderHandler

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
        .getResponse()
        
    }catch(error){
      handlerInput.responseBuilder
        .speak(`There was an error while submitting the order. Please try again.`); 
    }
  }
};

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
      const response = await getHttp(apissl+'/restaurant/'+restaurantID);
      const responseJSON = JSON.parse(response);
      const closingTimeJSON = responseJSON.restaurant.closing%12;
      var ampm = "";
        
      if (responseJSON.restaurant.closing < 12){
        ampm = "am";
      }else{
        ampm = "pm";
      }
        
      const closingTimeOutput = "The closing time is " + JSON.stringify(closingTimeJSON) + ampm;
      speakOutput = closingTimeOutput;
            
      handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
            
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`I wasn't able to get the data`)
        .reprompt(repromptOutput)
    }
    return handlerInput.responseBuilder
      .getResponse();
  }//handle
};//ClosingTimeIntentHandler

//Intent that recites only requested category of the menu (ie. appetizer, entree, refillible drink, alcohol)
const MenuCategoryIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuCategoryIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    var repromptOutput = "What would you like?";
    //categorySlot grabs the name of the slot, not the synonyms, converts it to a string, and makes it all lowercase in order to compare to the key in the database
    //////////////////MIGHT NEED TO CHANGE IF MORE CATEGORIES ARE ADDED TO MENU/////////////////////////////
    let categorySlot = handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value.name.toString().toLowerCase();

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
        .reprompt(repromptOutput)
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`I wasn't able to get the data`)
        .reprompt(repromptOutput)
    }
    
    return handlerInput.responseBuilder
      .getResponse();
      
    }//handle
};//MenuCategoryIntentHandler

// intent that gets the menu using an http get request, checks it's in stock, then converts it to string for recitation
const MenuIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuIntent';
  },
  async handle(handlerInput) {
    var speakOutput = "";
    var repromptOutput = "What would you like?";
    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
                
      for (var key in responseJSON) {
        if(responseJSON[key].in_stock > 0){
          speakOutput += key + ", ";
        }//if menu item is in stock
      }//for each menu item in database
                
      handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`I wasn't able to get the data`)
        .reprompt(repromptOutput)
    }
      
    return handlerInput.responseBuilder
      .getResponse();
      
  }//handle
};//MenuIntentHandler

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
        }//if equal to selected menu item  
      }//for each menu item
                
      handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(repromptOutput)
                    
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`Sorry, I couldn't find ` + menuItemSlot + ` on the menu`)
        .reprompt(repromptOutput)
    }
    
    return handlerInput.responseBuilder
      .getResponse();
  }//handle
};//GetPriceIntentHandler

const GetCaloriesIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetCaloriesIntent';
    },
    async handle(handlerInput) {
        
        var speakOutput = "";
        var repromptOutput = "Which item do you want to know the calories of?";
        //let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.resolutions.resolutionsPerAuthority[0].values[0].value.name.toString();
        let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.value.toString().toLowerCase();
            try {
                const response = await getHttp(api+'/menu/'+restaurantID);
                
                const responseJSON = JSON.parse(response);
                
                for(var key in responseJSON){
                  if(key.toLowerCase() === menuItemSlot){
                    if(responseJSON[key].in_stock > 0){
                      speakOutput = menuItemSlot + " has " + responseJSON[key].calories + " calories";
                    }else if(responseJSON[key].in_stock <= 0){
                      speakOutput = "Sorry, we are out of " + menuItemSlot;
                    }
                  }//if equal to selected menu item
                }//for each menu item
                
                handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(repromptOutput)
                    
            } catch(error) {
                handlerInput.responseBuilder
                .speak(`Sorry, I couldn't find ` + menuItemSlot + ` on the menu`)
                .reprompt(repromptOutput)
            }
      return handlerInput.responseBuilder
        .getResponse();
    }//handle
};//GetCaloriesIntentHandler

// A basic intent to get help, it currently says a waiter will be by shortly and does nothing else
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'A waiter will be by shortly to help you (doesnt actually do anything yet).';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
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
    return handlerInput.responseBuilder.getResponse();
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
    //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
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
      .reprompt(speakOutput)
      .getResponse();
  }
};//ErrorHandler

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    MenuCategoryIntentHandler,
    MenuIntentHandler,
    GetPriceIntentHandler,
    GetCaloriesIntentHandler,
    addNewAlexaHandler,
    AddItemToOrderHandler,
    ClosingTimeIntentHandler,
    SubmitOrderIntentHandler,
    
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





