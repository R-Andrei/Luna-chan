const MongoClient = require('mongodb').MongoClient;
const { cloud_token } = require('../config.json');

const uri = `mongodb+srv://luna_chan:${cloud_token}@luna-stats-pdqfb.mongodb.net/luna_storage?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
    if (!err) {
        const collection = client.db("luna_storage").collection("user_base");
        // perform actions on the collection object

    } else {
        console.log(err);
        client.close();
    }
});