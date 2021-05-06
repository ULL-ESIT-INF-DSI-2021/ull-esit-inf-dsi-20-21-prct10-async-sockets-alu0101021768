import {MessageEventEmitterServer} from './eventEmitterServer';

/**
 * @description MessageEventEmitterServer object that we're going to use to connect to it
 */
const server = new MessageEventEmitterServer();

/**
 * @description Call to the listen function on a specific port
 */
server.listen(60300);