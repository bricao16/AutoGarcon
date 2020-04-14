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
//Gets the AlexaID, restaurant ID, and table number automatically in the launch request
var AlexaID = '';
var restaurantID = '';
var tableNum = '';


// When skill is first invoked, need to find Alexa device ID here to determine which restaurant the Alexa device is currently at.
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    AlexaID = handlerInput.requestEnvelope.context.System.device.deviceId.toString();
    var speakOutput = '';
    try {
      const alexaResponse = await getHttp(api+'/alexa/'+AlexaID);
      const alexaResponseJSON = JSON.parse(alexaResponse);
      
      restaurantID = JSON.stringify(alexaResponseJSON[AlexaID].restaurant_id);
      tableNum = alexaResponseJSON[AlexaID].table_num;
      
      const restaurantResponse = await getHttp(api+'/restaurant/'+alexaResponseJSON[AlexaID].restaurant_id);
      const restaurantResponseJSON = JSON.parse(restaurantResponse);
      const restaurantName = restaurantResponseJSON['restaurant'].name;
    
      speakOutput = "Hi, Welcome to " + restaurantName + "! Thank you for using AutoGarcon Alexa to place your order. How can I help you?";
    
      handlerInput.responseBuilder
        .speak(speakOutput)
        
    } catch(error) {
      handlerInput.responseBuilder
        .speak(`This Alexa isn't registered. Please add it by saying "add a new device".`);
    }
    return handlerInput.responseBuilder
      .reprompt(`speakOutput`)
      .getResponse();
  }//handle
};//LaunchRequestHandler

// helper function for http calls
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
}//getHttp

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
        .speak(speakOutput + repromptOutput)
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
        .speak(speakOutput + repromptOutput)
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
    let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.resolutions.resolutionsPerAuthority[0].values[0].value.name.toString();

    try {
      const response = await getHttp(api+'/menu/'+restaurantID);
      const responseJSON = JSON.parse(response);
      
      //Checks if the requested menu item is in stock. If it is, it will tell the price of the item. It it isn't, it tells the customer we're out            
      if(responseJSON[menuItemSlot].in_stock > 0){
        speakOutput = menuItemSlot + " costs $" + responseJSON[menuItemSlot].price;
      }else if(responseJSON[menuItemSlot].in_stock <= 0){
        speakOutput = "Sorry, we are out of " + menuItemSlot;
      }
                
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
        let menuItemSlot = handlerInput.requestEnvelope.request.intent.slots.menuItem.resolutions.resolutionsPerAuthority[0].values[0].value.name.toString();

            try {
                const response = await getHttp(api+'/menu/'+restaurantID);
                
                const responseJSON = JSON.parse(response);
                
                if(responseJSON[menuItemSlot].in_stock > 0){
                    speakOutput = menuItemSlot + " has " + responseJSON[menuItemSlot].calories + " calories";
                }else if(responseJSON[menuItemSlot].in_stock <= 0){
                    speakOutput = "Sorry, we are out of " + menuItemSlot;
                }
                
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
    const speakOutput = 'A waiter will be by shortly to help you.';

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
    ClosingTimeIntentHandler,
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





