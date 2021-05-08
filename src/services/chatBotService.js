import request from "request";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getFacebookUsername = (sender_psid) => {
    return new Promise ((resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`;
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                //convert string to json object
                body = JSON.parse(body);
                let username = `${body.first_name} ${body.last_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
    });
});
};

let sendResponseWelcomeNewCustomer = (username, sender_psid) => {
    return new Promise( async (resolve, reject) => {
        let response_first = {"text": `Bienvenido ${username} a Estudio365`};
        let response_second = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Estudio 365",
                  "image_url": "https://miro.medium.com/max/1024/1*vxjAHkrXbGG6gOiPZgjeZA.jpeg",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Especializaciones",
                      "payload": "ESPECIALIZACIONES",
                    },
                  ],
                }]
              }
            }
        };
        // Enviar un mensaje de bienvenida
        await sendMessage(sender_psid, response_first);

        // Send a image with button view Especializaciones
        await sendMessage(sender_psid, response_second);  
    });
};

let sendMessage = (sender_psid, response) => {

    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    }); 
};

module.exports = {
    getFacebookUsername: getFacebookUsername,
    sendResponseWelcomeNewCustomer: sendResponseWelcomeNewCustomer
};