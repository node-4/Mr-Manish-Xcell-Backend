const messaging = admin.messaging();

async function sendReminderNotification(reminder) {
    const { text, user } = reminder;
    const { fcmToken } = user;
    const message = {notification: {title: "Reminder",body: text,},token: fcmToken,};
    try {
        const response = await messaging.send(message);
        console.log("Successfully sent reminder notification:", response);
    } catch (error) {
        console.error("Error sending reminder notification:", error);
    }
}

module.exports = { sendReminderNotification };
