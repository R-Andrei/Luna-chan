/*****************************************************/
/*          LUNA WILL INCORPORATE ELECTRON           */
/*          MOST OF THAT WILL END UP HERE            */
/*****************************************************/

const { token } = require('./core/config.json');
const Luna = require('./core/luna.js');

luna = new Luna();
luna.wake_up(token);