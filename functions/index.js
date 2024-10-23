const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const twilioPhoneNumber = functions.config().twilio.phone_number;

const client = twilio(accountSid, authToken);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

function isValidPhoneNumber(number) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
}

app.post('/make-call', (req, res) => {
    const { phoneNumber } = req.body;

    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    const callUrl = `${functions.config().app.base_url}/twiml?dialNumber=${encodeURIComponent(phoneNumber)}`;

    client.calls
        .create({
            url: callUrl,
            to: phoneNumber,
            from: twilioPhoneNumber,
            statusCallback: `${functions.config().app.base_url}/call-status`,
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST'
        })
        .then(call => {
            console.log(`Call initiated. Call SID: ${call.sid}`);
            res.json({ message: 'Call initiated successfully', callSid: call.sid });
        })
        .catch(err => {
            console.error(`Failed to initiate call: ${err.message}`);
            res.status(500).json({ error: 'Failed to initiate call', message: err.message });
        });
});

app.get('/twiml', (req, res) => {
    const dialNumber = req.query.dialNumber;
    res.type('text/xml');
    res.send(`
        <Response>
            <Dial>${dialNumber}</Dial>
        </Response>
    `);
});

app.post('/call-status', (req, res) => {
    const callStatus = req.body.CallStatus;
    const callSid = req.body.CallSid;
    console.log(`Call ${callSid} status updated to: ${callStatus}`);
    res.sendStatus(200);
});

exports.app = functions.https.onRequest(app);
