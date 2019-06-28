
const { luna } = require('./core/luna.js')
const fs = require('fs');
const listeners = fs.readdirSync('./core/listeners').filter(file => file.endsWith('.js'));

for (const listener_file of listeners) {
    const listener = require(`./core/listeners/${listener_file}`);
    luna.add_event_listener(listener.body(luna));
}