import 'mocha';
import {expect} from 'chai';
import {RequestType} from './../src/types';
import {EventEmitter} from 'events';
import {MessageEventEmitterServer} from '../src/eventEmitterServer';


describe('MessageEventEmitterserver Tests', () => {
  it('Should receive correctly a complete add request', () => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer();
    const request: RequestType = {
      type: 'add',
      user: "nestor",
      title: "Red note",
      body: 'This is a red note',
      color: 'red',
    };
    server.on('end', (message) => {
      expect(message).to.be.eql(request);
    });
    socket.emit('data', JSON.stringify(request));
  });
  it('Should receive correctly a complete modify request', () => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer();
    const request: RequestType = {
      type: 'modify',
      user: "nestor",
      title: "Red note",
      body: 'This is not a red note',
      color: 'green',
    };
    server.on('end', (message) => {
      expect(message).to.be.eql(request);
    });
    socket.emit('data', JSON.stringify(request));
  });
  it('Should receive correctly a complete list request', () => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer();
    const request: RequestType = {
      type: 'list',
      user: "nestor",
    };
    server.on('end', (message) => {
      expect(message).to.be.eql(request);
    });
    socket.emit('data', JSON.stringify(request));
  });
  it('Should receive correctly a complete read request', () => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer();
    const request: RequestType = {
      type: 'read',
      user: "nestor",
      title: "Green note",
    };
    server.on('end', (message) => {
      expect(message).to.be.eql(request);
    });
    socket.emit('data', JSON.stringify(request));
  });
  it('Should receive correctly a complete remove request', () => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer();
    const request: RequestType = {
      type: 'remove',
      user: "nestor",
      title: "Green note",
    };
    server.on('end', (message) => {
      expect(message).to.be.eql(request);
    });
    socket.emit('data', JSON.stringify(request));
  });
});