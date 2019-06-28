const MongoClient = require('mongodb').MongoClient;
const { cloud } = require('../config.json');

class StorageSlave{
    constructor(address, database, collection, user, token){
        this.address = address;
        this.database = database;
        this.collection = collection;
        this.client = new MongoClient(`mongodb+srv://${user}:${token}@${address}/${database}/${collection}?retryWrites=true&w=majority`, { useNewUrlParser: true });
    }

    async update_user (message, args) {
        return new Promise((resolve, reject) => {
            this.client.connect()
                .then(result => {
                    console.log(`Connected to '${this.database}/${this.collection}' at '${this.address}'`);

                    const collection = result.db(this.database).collection(this.collection);
                    collection.insertOne({
                        user: message.author.tag,
                        user_id: Number(message.author.id),
                        channel: message.channel.name,
                        server: message.guild.name,
                        server_id: Number(message.guild.id),
                        command: args[0].name,
                        timestamp: message.createdTimestamp
                    });

                    this.client.close();
                    resolve(`Transaction finished. Logging out of databse '${this.database}' at '${this.address}'.`);
                })
                .catch(err => { this.client.close(); reject(err); });
        });
    }
}

const luna_slave = new StorageSlave(cloud.address, cloud.database, cloud.collection, cloud.user, cloud.key);

module.exports = {
    worker: luna_slave
}
