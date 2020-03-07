const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "http://fireship-lessons.firebaseio.com"
});

const { SessionsClient } = require('dialogflow');

exports.dialogflowGateway = functions.https.onRequest((request, responce) => {
    cors(request, responce, async () => {
        const { queryInput, sessionId } = request.body;

        const sessionClient = new SessionsClient({ credential: serviceAccount});
        const session = sessionClient.sessionPath('youtalkwithme', sessionId);

        const responces = await sessionClient.detectIntent({ session, queryInput });

        const result = responces[0].queryResult;


        responce.send(result);
    });
});
