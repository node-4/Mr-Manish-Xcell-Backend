const accountSid = 'ACbjffsh46fdh4bh5aga';
const authToken = 'jbajsjrg3jmn3nl2';
const client = require('twilio')(accountSid, authToken);

exports.sendSMSNotification = async (to, message) => {
    try {
        const response = await client.messages.create({ body: message, from: 'YOUR_TWILIO_NUMBER', to: to });
        console.log(`Notification sent to ${to} with message SID ${response.sid}`);
    } catch (error) {
        console.error(`Error sending notification to ${to}: ${error}`);
    }
}

// Usage
// sendNotification('+1234567890', 'Hello, this is a test notification from Twilio!');
