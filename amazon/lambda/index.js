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
var restaurant = '123'; // we will change this when we add functionality that automatically determines what restaurant
                        // the current device ID is in from the database

// When skill is first invoked, need to find Alexa device ID here to determine which restaurant the Alexa device is currently at.
const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
  const speakOutput = 'Welcome to Auto Garcon, you can say Hello, Menu, or Help.'; // the first thing a user is greeted with
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

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
      });
      request.end();
  });
}

// Intent to test retrieving the database's fake json 
const TestDataIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TestDataIntent';
  },
  async handle(handlerInput) {
    var speakOutput = '';
    var repromptOutput = 'More data?';
    try {
      const response = await getHttp(api+'/menu/'+restaurant);
    
      speakOutput += " " + response;
    
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
  }
}

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
      const response = await getHttp(api+'/restaurant/'+restaurant);
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
  }
};

// intent that gets the menu using an http get request, then converts it to string for recitation
const MenuIntentHandler = {
  canHandle(handlerInput){
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MenuIntent';
  },
  async handle(handlerInput) {
        
      var speakOutput = '';
      var repromptOutput = 'What would you like?';
      try {
        const response = await getHttp(api+'/menu/'+restaurant);
                    
        const responseJSON = JSON.parse(response);
                    
        for (var key in responseJSON) {
          speakOutput += JSON.stringify(key)+', ';
        }
                    
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
  }
};

// base initial default intent for reference and saying hello
const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
  },
  handle(handlerInput) {
      const speakOutput = 'Hello, how may I help you today?';
      return handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse();
  }
};

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
};

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
};

// I dont think a user can call this, i beleive its called automatically when skill ends
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

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
};

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
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    TestDataIntentHandler,
    HelloWorldIntentHandler,
    MenuIntentHandler,
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





