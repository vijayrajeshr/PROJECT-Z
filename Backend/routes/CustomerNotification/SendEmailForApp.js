require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const { sendApp } = require("./DiningEmailNotify");

const app = express.Router();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);


app.post('/send-sms', async (req, res) => {
  const { mobile, message } = req.body;
console.log('Twilio Account SID:', accountSid);
console.log('Twilio Auth Token:', authToken);
console.log('Twilio Phone Number (From):', twilioPhoneNumber);
console.log(mobile,message);
  if (!mobile || !message) {
    return res.status(400).json({ success: false, message: 'Recipient number and message are required.' });
  }

  if (!mobile.startsWith('+')) {
    return res.status(400).json({ success: false, message: 'Recipient number must be in E.164 format (e.g., +1234567890).' });
  }

  try {
    const smsResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: mobile,
    });

    console.log('SMS sent successfully:', smsResponse.sid);
    res.status(200).json({ success: true, message: 'SMS sent successfully!', sid: smsResponse.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ success: false, message: 'Failed to send SMS.', error: error.message });
  }
});

app.post('/send-app', async (req, res) => {
  const { email, mobile } = req.body;

  if (email) {
    try {
      await sendApp(email);
      return res.status(200).json({ message: "App link sent via email successfully!" });
    } catch (error) {
      console.error('Error sending app link email:', error);
      return res.status(500).json({ message: "Failed to send app link email." });
    }
  } else if (mobile) {
    const smsMessage = req.body.message || "Here's your app link: [Your App Download Link Here]";

    if (!mobile.startsWith('+')) {
      return res.status(400).json({ success: false, message: 'Recipient mobile number must be in E.164 format (e.g., +1234567890).' });
    }

    try {
      const smsResponse = await client.messages.create({
        body: smsMessage,
        from: twilioPhoneNumber,
        to: mobile,
      });

      console.log('SMS sent successfully:', smsResponse.sid);
      return res.status(200).json({ success: true, message: 'App link sent via SMS successfully!', sid: smsResponse.sid });
    } catch (error) {
      console.error('Error sending app link SMS:', error);
      return res.status(500).json({ success: false, message: 'Failed to send app link SMS.', error: error.message });
    }
  } else {
    return res.status(400).json({ message: 'Please provide either an email address or a mobile number.' });
  }
});


module.exports=app;