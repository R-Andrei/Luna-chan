const MongoClient = require('mongodb').MongoClient;
const { cloud } = require('../config.json');

class StorageWorker {
    constructor(address, database, collections, user, token){
        this.address = address;
        this.database = database;
        this.collections = {
            user_base: collections.user_base,
            server_base: collections.server_base,
            server_experience: collections.server_experience
        };
        this.client = new MongoClient(`mongodb+srv://${user}:${token}@${address}/${database}/?retryWrites=true&w=majority`, { useNewUrlParser: true });
        this.open_connection()
            .then(console.log(`Connected to '${this.database}' at '${this.address}'`))
            .catch(err => console.log(err));
    }

    async open_connection () {
        return new Promise((resolve, reject) => {
            this.client.connect()
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }

    async push_row (message, ability) {
        return new Promise((resolve, reject) => {
            const collection = this.client.db(this.database).collection(this.collections.user_base);
            const data_set = {
                user: message.author.tag,
                user_id: Number(message.author.id),
                channel: message.channel.name,
                server: message.guild.name,
                server_id: Number(message.guild.id),
                command: ability.name,
                timestamp: message.createdTimestamp
            };
            collection.insertOne(data_set)
                .then(resolve(`Transaction finished. Inserted data set (${Object.values(data_set).join(', ')})'.`))
                .catch(err => reject(err));
        });
    }

    async close_connection() {
        return new Promise((resolve, reject) => {
            this.client.close()
                .then(resolve(`Killed connection to database '${this.database}' of '${this.address}'`))
                .catch(err => reject(err));
        });
    }
}

const luna_worker = new StorageWorker(cloud.address, cloud.database, cloud.collections, cloud.user, cloud.key);

module.exports = {
    worker: luna_worker
};
