import {EventEmitter} from 'events';

/**
 * @description Class that inherits from EventEmitter and emits a 'message' event
 */
export class MessageEventEmitterClient extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let data = '';
    connection.on('data', (chunk) => {
      data += chunk;
      this.emit('message', JSON.parse(data));
    });
  }
}