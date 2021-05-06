import 'mocha';
import {expect} from 'chai';
import {ResponseType} from './../src/types';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../src/eventEmitterClient';
import * as chalk from 'chalk';


describe('MessageEventEmitterClient Tests', () => {
  it('Success: Should emit a message event once it gets a complete message',
      () => {
        const socket = new EventEmitter();
        const client = new MessageEventEmitterClient(socket);
        const response: ResponseType = {
          type: 'add',
          success: true,
          output: chalk.green('New note added!'),
        };
        client.on('message', (message) => {
          expect(message).to.be.eql(response);
        });
        socket.emit('data', JSON.stringify(response));
      });
  it('Error: Should emit a message event once it gets a complete message',
      () => {
        const socket = new EventEmitter();
        const client = new MessageEventEmitterClient(socket);
        const response: ResponseType = {
          type: 'add',
          success: true,
          output: chalk.red('Note not found!'),
        };
        client.on('message', (message) => {
          expect(message).to.be.eql(response);
        });
        socket.emit('data', JSON.stringify(response));
      });
});