const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  https = require('https'),
  request = require('request'),
  ApiAiApp = require('actions-on-google').ApiAiApp;
var app = express();

const WELCOME_INTENT = 'input.welcome';
const PRINTER = 'ProductPrinter';
const PRINTER_FALLBACK = 'ProductPrinter.fallback';
const USETYPE = 'BuyPrinter.PrinterUseTypeSelection';
const USETYPE_FALLBACK = 'BuyPrinter.PrinterUseTypeSelection.fallback';
const LOADTYPE = 'BuyPrinter.PrinterLoadTypeSelection';
const LOADTYPE_FALLBACK = 'BuyPrinter.PrinterLoadTypeSelection.fallback';
const SCANTYPE = 'BuyPrinter.PrinterScanTypeSelection';
const SCANTYPE_FALLBACK = 'BuyPrinter.PrinterScanTypeSelection.fallback';
const WIFITYPE = 'BuyPrinter.PrinterWiFiTypeSelection';
const WIFITYPE_FALLBACK = 'BuyPrinter.PrinterWiFiTypeSelection.fallback';
const ADD_TO_CART = 'BuyPrinter.PrinterAddtoCart';
const ADD_TO_CART_FALLBACK = 'BuyPrinter.PrinterAddtoCart.fallback';
const CHECKOUT = 'BuyPrinter.PrinterCheckOut';
const CHECKOUT_FALLBACK = 'BuyPrinter.PrinterCheckOut.fallback';
const END_CHAT = 'BuyPrinter.PrinterEndChat';
const GET_LOCATION = 'GetLocation';
const RETRIEVE_LOCATION = 'RetrieveLocation';
const GET_TOP_RATED_PRODUCT = 'GetTopRatedProduct';
const CHATBOT_RATING_YES = 'ChatBotRatingYes';
const CHATBOT_RATING_YES_FALLBACK = 'ChatBotRatingYes.fallback';
const RETRIEVE_RATING = 'RetrieveRating';
const GET_REVIEW_COMMENTS = 'getReviewComments';
const DEAL_OF_THE_DAY = 'DealOfTheDay';

const PAGE_ACCESS_TOKEN = 'EAATUwU1ZCGx4BALJL70bQ01OqDYjc4JR3NZBRqu8PpCjGLDQl074UB31R6wNrSUBm7ZBoS4yZBecqNT9tZAJc2xLkCNZAZBQRrTg1tN9b1F8Ulhdz5CyLdKI80IChMJxiY2OLFcV8wlpHuzO9BdeQLQaW0FBu2aGQ9YxMmAMSDe4AZDZD';
var senderID = '';
var data = '';
var url = 'https://graph.facebook.com/v2.6/me/messages';

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

/*
* HTTP Cloud Function.
*/
app.post('/helloHttp', function(request, response) {
  console.log("Inside /helloHttp");
  var req = request.body;
  console.log("\nReq: \n", req);

  data = req.originalRequest.data;
  console.log("\ndata: \n", data);
  var result = req.result;
  //console.log("result", result);
  for(var i=0; i<result.contexts.length; i++) {
    console.log("Context: ", result.contexts[i]);
  }
  senderID = data.sender.id;
  console.log("SenderID: ", senderID);

  const appAi = new ApiAiApp({request: request, response: response});
  const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(PRINTER, productPrinter);
  actionMap.set(PRINTER_FALLBACK, productPrinterFallback);
  actionMap.set(USETYPE, chooseUseType);
  actionMap.set(USETYPE_FALLBACK, chooseUseTypeFallback);
  actionMap.set(LOADTYPE, chooseModerateUse);
  actionMap.set(LOADTYPE_FALLBACK, chooseModerateUseFallback);
  actionMap.set(SCANTYPE, chooseScanType);
  actionMap.set(SCANTYPE_FALLBACK, chooseScanTypeFallback);
  actionMap.set(WIFITYPE, chooseWiFiType);
  actionMap.set(WIFITYPE_FALLBACK, chooseWiFiTypeFallback);
  actionMap.set(ADD_TO_CART, productSelected);
  actionMap.set(ADD_TO_CART_FALLBACK, productSelectedFallback);
  actionMap.set(CHECKOUT, checkOut);
  actionMap.set(CHECKOUT_FALLBACK, checkOutFallback);
  actionMap.set(END_CHAT, endIntent);
  actionMap.set(GET_LOCATION, getLocation);
  actionMap.set(RETRIEVE_LOCATION, retrieveLocation);
  actionMap.set(GET_TOP_RATED_PRODUCT, getTopRatedProduct);
  actionMap.set(CHATBOT_RATING_YES, askChatBotRating);
  actionMap.set(CHATBOT_RATING_YES_FALLBACK, askChatBotRatingFallback);
  actionMap.set(GET_REVIEW_COMMENTS, getReviewComments);
  actionMap.set(DEAL_OF_THE_DAY, dealOfTheDay);

  appAi.handleRequest(actionMap);
});

app.get('/', function(request, response) {
	console.log("Inside get");
  console.log("New deployment method")
  res.sendStatus(200);
});

app.get('/setupGetStartedButton',function(req,res){
    setupGetStartedButton(res);
});

app.get('/whitelisting',function(req,res){
    var messageData = {
      "setting_type" : "domain_whitelisting",
      "whitelisted_domains":[
        "https://bbyshoppingassistant.herokuapp.com",
        "https://pisces.bbystatic.com",
        "https://www.bestbuy.com"
      ],
      "domain_action_type": "add"
    };
    url = 'https://graph.facebook.com/v2.6/me/messenger_profile';
    callSendAPI(messageData);
    console.log('whitelisting');
});

app.get('/fallback',function(req,res){
    console.log('Fallback');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function welcomeIntent (appAi) {
  console.log("Inside welcomeIntent");
  appAi.tell('I am your Best Buy In-Home Assistant. \nYou can ask me about: '
            + '\n1. Buying any electronic gadget'
            + '\n2. Deals of the day'
            + '\n3. Locate your nearest Best Buy store'
            + '\n4. Get to know the store timings'
            + '\n5. About the trending products by category'
            + '\nFor example, you can say, I would like to buy a printer.');
}

function productPrinter (appAi) {
  console.log("Inside productPrinter");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sure. I can help you with that. \nHow do you plan on using it?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Personal",
          "payload":"PRINTER_USE_TYPE_PERSONAL"
        },
        {
          "content_type":"text",
          "title":"Professional",
          "payload":"PRINTER_USE_TYPE_PROFESSIONAL"
        }]
    }
  };

  callSendAPI(messageData);
}

function productPrinterFallback (appAi) {
  console.log("Inside productPrinterFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nHow do you plan on using it?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Personal",
          "payload":"PRINTER_USE_TYPE_PERSONAL"
        },
        {
          "content_type":"text",
          "title":"Professional",
          "payload":"PRINTER_USE_TYPE_PROFESSIONAL"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseUseType (appAi) {
  console.log("Inside chooseUseType");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Cool.. :) \nHow many pages would you print every day?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Less than 10",
          "payload":"PRINTER_PAPER_LESS_THAN_10"
        },
        {
          "content_type":"text",
          "title":"Less than 100",
          "payload":"PRINTER_PAPER_LESS_THAN_100"
        },
        {
          "content_type":"text",
          "title":"More than 100",
          "payload":"PRINTER_PAPER_MORE_THAN_100"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseUseTypeFallback (appAi) {
  console.log("Inside chooseUseTypeFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nHow many pages would you print every day?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Less than 10",
          "payload":"PRINTER_PAPER_LESS_THAN_10"
        },
        {
          "content_type":"text",
          "title":"Less than 100",
          "payload":"PRINTER_PAPER_LESS_THAN_100"
        },
        {
          "content_type":"text",
          "title":"More than 100",
          "payload":"PRINTER_PAPER_MORE_THAN_100"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseModerateUse (appAi) {
  console.log("Inside chooseModerateUse");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Would you require a printer with built-in scanner?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_SCAN_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_SCAN_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseModerateUseFallback (appAi) {
  console.log("Inside chooseModerateUseFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nWould you require a printer with built-in scanner?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_SCAN_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_SCAN_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseScanType (appAi) {
  console.log("Inside chooseScanType");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Do you need the printer to print over the WiFi?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_WIFI_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_WIFI_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseScanTypeFallback (appAi) {
  console.log("Inside chooseScanTypeFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nDo you need the printer to print over the WiFi?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_WIFI_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_WIFI_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseWiFiType (appAi) {
  console.log("Inside chooseWiFiType");
  sendPrinterDetails(senderID);
  setTimeout(sendPrinterSelectButton, 3000);
}

function chooseWiFiTypeFallback (appAi) {
  console.log("Inside chooseWiFiTypeFallback");
  messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nCan I add it to your cart?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"ADD_TO_CART_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"ADD_TO_CART_NO"
        },
        {
          "content_type":"text",
          "title":"Show More",
          "payload":"PRINTER_SELECT_SHOW_MORE"
        }]
    }
  };
  callSendAPI(messageData);
}

function productSelected (appAi) {
  console.log("Inside productSelected");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Great! Product added to your BestBuy cart. \nCan I checkout this item for you?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_CHECKOUT_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_CHECKOUT_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function productSelectedFallback (appAi) {
  console.log("Inside productSelected");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nCan I checkout this item for you?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_CHECKOUT_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_CHECKOUT_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function checkOut (appAi) {
  console.log("Inside checkOut");
  appAi.tell('Item checked out. \nIs there anything else I can help you with?');
}

function checkOutFallback (appAi) {
  console.log("Inside checkOut");
  appAi.tell('Sorry, I didnt get that. \nIs there anything else I can help you with?');
}

function askChatBotRating (appAi) {
  console.log("Inside askChatBotRating");
  appAi.tell('Please let us know how likely are you to recommend BestBuy to one of your Friend or Colleague. \nRate in scale of 1 to 10, with 1 being the worst and 10 being the best.');
}

function askChatBotRatingFallback (appAi) {
  console.log("Inside askChatBotRatingFallback");
  appAi.tell('Sorry, I didnt get that. \nPlease let us know how likely are you to recommend BestBuy to one of your Friend or Colleague. \nRate in scale of 1 to 10, with 1 being the worst and 10 being the best.');
}

function getReviewComments (appAi) {
  console.log("Inside getReviewComments");
  appAi.tell('Thanks For the review. :) \n Have a great day. :)');
}

function endIntent (appAi) {
  console.log("Inside endIntent");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Thanks for shopping with Best Buy.:) \nCan you please spare a minute to rate our service?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"CHATBOT_RATING_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"CHATBOT_RATING_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function sendPrinterDetails(recipientId) {
  console.log("RecipientID: ", recipientId);
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "HP pro 6978 printer",
            subtitle: "Printer",
            item_url: "https://www.bestbuy.com/site/hp-officejet-pro-6978-wireless-all-in-one-instant-ink-ready-printer/5119600.p?skuId=5119600",
            image_url: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5119/5119600_sd.jpg;maxHeight=550;maxWidth=642",
            buttons: [{
              type: "web_url",
              url: "https://www.bestbuy.com/site/hp-officejet-pro-6978-wireless-all-in-one-instant-ink-ready-printer/5119600.p?skuId=5119600",
              title: "Open Web URL"
            }],
          }]
        }
      }
    }
  };
  callSendAPI(messageData);
  }

  function sendPrinterSelectButton(recipientId) {
    messageData = {
      recipient: {
        id: senderID
      },
      "message":{
        "text": "I found the above for you. \nCan I add it to your cart?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"YES",
            "payload":"ADD_TO_CART_YES"
          },
          {
            "content_type":"text",
            "title":"NO",
            "payload":"ADD_TO_CART_NO"
          },
          {
            "content_type":"text",
            "title":"Show More",
            "payload":"PRINTER_SELECT_SHOW_MORE"
          }]
      }
    };
    callSendAPI(messageData);
  }

  function getLocation(appAi) {
    console.log("Inside getLocation");
    messageData = {
      recipient: {
        id: senderID
      },
      "message":{
          "text": "Sure, I can help you with that. \nPlease share your location to show the nearest Best Buy stores",
          "quick_replies":[
            {
              "content_type":"location",
              "payload":"GET_USER_LOCATION"
            }
          ]
        }
      };
      callSendAPI(messageData);
    }

  function retrieveLocation(appAi) {
    console.log("Inside retrieveLocation");
    var lat = data.postback.data.lat;
    var long = data.postback.data.long;
    console.log('Provided Lat and long are: ',lat, long);
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
              + "location=" + lat + "," + long
              + "&radius=10000&type=Retail&keyword=Best%20Buy"
              + "&key=AIzaSyDHyBBKhH-CKIvxiwPIfEMA9wUvVShq5F0";
    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200 && body != undefined && body.results.length > 0) {
          //console.log(body) // Print the json response
          for(var i=0; i<body.results.length; i++) {
            console.log("Open Now: ", body.results[i].opening_hours.open_now);
            var storeOpenStatus = 'Closed Now';
            if(body.results[i].opening_hours.open_now) {
                storeOpenStatus = 'Open Now';
            }
            console.log("Store Address: ", body.results[i].vicinity);
            var storeTitle = body.results[i].name + ' \n :- ' + body.results[i].vicinity;
            var messageData = {
              recipient: {
                id: senderID
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: storeTitle,
                      subtitle: storeOpenStatus
                    }]
                  }
                }
              }
            };
            callSendAPI(messageData);
            if( i == 5) {
              break;
            }
          }
          //
      } else {
        appAi.tell("Sorry, no stores near by. \nIs there anything else I can help you with?");
      }
    });
  }

  function getTopRatedProduct(appAi) {
    console.log("Inside getTopFiveItems");
    messageData = {
      recipient: {
        id: senderID
      },
      "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "large",
              "elements": [
                {
                  "title": "Brother - HL-L2380DW Wireless Black-and-White 3-in-1 Laser Printer - Black",
                  "subtitle": "Model: HL-L2380DW   \nSKU: 8161037  \nPrice: $99.99",
                  "image_url": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/8161/8161037_sa.jpg;maxHeight=1000;maxWidth=1000",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.bestbuy.com/site/brother-hl-l2380dw-wireless-black-and-white-3-in-1-laser-printer-black/8161037.p?skuId=8161037",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://www.bestbuy.com/site/brother-hl-l2380dw-wireless-black-and-white-3-in-1-laser-printer-black/8161037.p?skuId=8161037"
                  }
                },
                {
                  "title": "HP - LaserJet Pro m452dn Color Printer - White",
                  "subtitle": "Model: CF389A#BGJ  \nSKU: 4420800  \nPrice: $299.99",
                  "image_url": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/4420/4420800_sd.jpg;maxHeight=1000;maxWidth=1000",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.bestbuy.com/site/hp-laserjet-pro-m452dn-color-printer-white/4420800.p?skuId=4420800",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://www.bestbuy.com/site/hp-laserjet-pro-m452dn-color-printer-white/4420800.p?skuId=4420800"
                  }
                },
                {
                  "title": "Epson - Expression Photo XP-8500 Small-in-One Wireless All-In-One Printer",
                  "subtitle": "Model: EPSON EXPRESSION XP-8500 C11CG \nSKU: 6083603 \nPrice: $249.99",
                  "image_url": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6083/6083603_sd.jpg;maxHeight=1000;maxWidth=1000",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.bestbuy.com/site/epson-expression-photo-xp-8500-small-in-one-wireless-all-in-one-printer/6083603.p?skuId=6083603",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://www.bestbuy.com/site/epson-expression-photo-xp-8500-small-in-one-wireless-all-in-one-printer/6083603.p?skuId=6083603"
                  }
                }
                ,
                {
                  "title": "Brother - DCP-L2540DW Wireless Black-and-White All-In-One Printer - Black",
                  "subtitle": "Model: DCP-L2540DW  \nSKU: 9093201 \nPrice: $124.99",
                  "image_url": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/9093/9093201_sa.jpg;maxHeight=1000;maxWidth=1000",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://www.bestbuy.com/site/brother-dcp-l2540dw-wireless-black-and-white-all-in-one-printer-black/9093201.p?skuId=9093201",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://www.bestbuy.com/site/brother-dcp-l2540dw-wireless-black-and-white-all-in-one-printer-black/9093201.p?skuId=9093201"
                  }
                }
              ],
               "buttons": [
                {
                  "title": "Show More",
                  "type": "postback",
                  "payload": "Show_More_Product"
                }
              ]
            }
          }
        }
      };
      callSendAPI(messageData);
    }

  function dealOfTheDay(appAi) {
    console.log("Inside dealOfTheDay");
    messageData = {
      recipient: {
        id: senderID
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [{
              title: "Dyson - Ball Multi Floor Bagless Upright Vacuum - Iron/Yellow",
              subtitle: "Price: $199.99 \nSAVE $200 Was $399.99",
              item_url: "https://www.bestbuy.com/site/dyson-ball-multi-floor-bagless-upright-vacuum-iron-yellow/2498029.p?skuId=2498029",
              image_url: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/2498/2498029_sd.jpg;maxHeight=1000;maxWidth=1000",
              buttons: [{
                type: "web_url",
                url: "https://www.bestbuy.com/site/dyson-ball-multi-floor-bagless-upright-vacuum-iron-yellow/2498029.p?skuId=2498029",
                title: "Open Web URL"
              }],
            }]
          }
        }
      }
    };
    callSendAPI(messageData);
  }

  function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s",
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });
  }

  function setupGetStartedButton(res){
          var messageData = {
                  "get_started"://[
                  {
                      "payload":"Get Started with Home Electronic Assistance"
                      }
                  //]
          };

          // Start the request
          request({
              url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              form: messageData
          },
          function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  // Print out the response body
                  res.send(body);

              } else {
                  // TODO: Handle errors
                  res.send(body);
              }
          });
      }

module.exports = app;
