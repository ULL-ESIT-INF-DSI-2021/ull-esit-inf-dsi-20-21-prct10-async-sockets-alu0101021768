import {EventEmitter} from 'events';

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