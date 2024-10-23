const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
require('dotenv').config();

// Use environment variables for Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const app = express();

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML) from the public folder
app.use(express.static('public'));

// Helper function to validate phone numbers
function isValidPhoneNumber(number) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number);
}

// Route to handle the form submission and place the call
app.post('/make-call', (req, res) => {
    const { phoneNumber } = req.body;

    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    const callUrl = `${process.env.BASE_URL}/twiml?dialNumber=${encodeURIComponent(phoneNumber)}`;

    client.calls
        .create({
            url: callUrl,
            to: phoneNumber,
            from: twilioPhoneNumber,
            statusCallback: `${process.env.BASE_URL}/call-status`,
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

// Route to dynamically generate TwiML for dialing the number
app.get('/twiml', (req, res) => {
    const dialNumber = req.query.dialNumber;

    // Dynamically generate TwiML to connect the call to the entered phone number
    res.type('text/xml');
    res.send(`
        <Response>
            <Dial>${dialNumber}</Dial>
        </Response>
    `);
});

// New route to handle call status updates
app.post('/call-status', (req, res) => {
    const callStatus = req.body.CallStatus;
    const callSid = req.body.CallSid;
    console.log(`Call ${callSid} status updated to: ${callStatus}`);
    // Here you can add logic to update your database or perform other actions based on call status
    res.sendStatus(200);
});

// Add routes for new HTML pages
app.get('/manage-agents', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage-agents.html'));
});

app.get('/agent-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agent-profile.html'));
});

app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notifications.html'));
});

app.get('/recents', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recents.html'));
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
