const MongoClient = require('mongodb').MongoClient;


module.exports = class StorageWorker {
    constructor (user, token, address, database, collections) {
        this.address = address;
        this.database_name = database;
        this.collections = collections;
        this.client = new MongoClient(`mongodb+srv://${user}:${token}@${address}/${database}/?retryWrites=true&w=majority`, { useNewUrlParser: true });
    }

    async open_connection () {
        return new Promise((resolve, reject) => {
            this.client.connect()
                .then(_result => {
                    this.database = this.client.db(this.database_name);
                    resolve(`Connected to '${this.database_name}' at '${this.address}'`);
                })
                .catch(err => reject(err));
        });
    }

    async record_cast (message, ability) {
        return new Promise((resolve, reject) => {
            const collection = this.database.collection(this.collections.abilities);
            collection.countDocuments({ "_id": { $ne: null } })
                .then(result => {
                    const data_set = {
                        _id: ++result,
                        user: message.author.tag,
                        user_id: Number(message.author.id),
                        channel: message.channel.name,
                        server: message.guild.name,
                        server_id: Number(message.guild.id),
                        ability: ability.name,
                        timestamp: message.createdTimestamp
                    };
                    collection.insertOne(data_set)
                        .then(_result => resolve(`Transaction finished. Inserted data set (${Object.values(data_set).join(', ')}) into collection ${this.collections.abilities}'.`))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }

    async update_server (server, record_type) {
        const collection = this.database.collection(this.collections.servers);
        return new Promise((resolve, reject) => {
            const data_set = { $set :{
                _id: Number(server.id),
                type: record_type,
                name: server.name,
                members: Number(server.memberCount),
                owner_name: server.owner.displayName,
                owner_tag: server.owner.user.tag,
                created: server.createdTimestamp,
                joined: server.joinedTimestamp
            }};
            collection.findOneAndUpdate(
                {"server_id": server.id, "type": record_type},
                data_set,
                { upsert: true }
            )
            .then(_result => 
                resolve(`Transaction finished. Inserted data set (${Object.values(data_set['$set']).join(', ')}) into collection ${this.collections.servers}'.`)
            )
            .catch(err => reject(err));

        });
    }

    async close_connection () {
        return new Promise((resolve, reject) => {
            this.client.close()
                .then(resolve(`\nKilled connection to database '${this.database_name}' of '${this.address}'`))
                .catch(err => reject(err));
        });
    }
}

