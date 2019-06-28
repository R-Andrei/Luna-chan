const MongoClient = require('mongodb').MongoClient;
const { cloud } = require('../config.json');

class StorageSlave{
    constructor(address, database, collection, user, token){
        this.address = address;
        this.database = database;
        this.collection = collection;
        this.client = new MongoClient(`mongodb+srv://${user}:${token}@${address}/${database}/${collection}?retryWrites=true&w=majority`, { useNewUrlParser: true });
        this.open_connection()
            .then(console.log(`Connected to '${this.database}/${this.collection}' at '${this.address}'`))
            .catch(err => {
                console.log(err);
            });
    }

    async open_connection () {
        return new Promise((resolve, reject) => {
            this.client.connect()
                .then(result => resolve(result))
                .catch(err => {reject(err); });
        });
    }

    async update_user (message, args) {
        return new Promise((resolve, reject) => {
            const collection = this.client.db(this.database).collection(this.collection);
            const data_set = {
                user: message.author.tag,
                user_id: Number(message.author.id),
                channel: message.channel.name,
                server: message.guild.name,
                server_id: Number(message.guild.id),
                command: args[0].name,
                timestamp: message.createdTimestamp
            };
            collection.insertOne(data_set)
                .then(_result => {
                    resolve(`Transaction finished. Inserted data set (${Object.values(data_set).join(', ')})'.`);
                })
                .catch(err => {reject(err);});
        })
    }

    async close_connection() {
        return new Promise((resolve, reject) => {
            this.client.close()
                .then(resolve(`Killed connection to database '${this.database}' of '${this.address}'`))
                .catch(err => reject(err));
        })
        
    }
}

const luna_slave = new StorageSlave(cloud.address, cloud.database, cloud.collection, cloud.user, cloud.key);

module.exports = {
    worker: luna_slave
}
