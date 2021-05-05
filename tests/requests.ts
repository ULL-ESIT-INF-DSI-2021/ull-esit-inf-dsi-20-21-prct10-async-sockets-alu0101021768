import 'mocha';
import {expect} from 'chai';
import {execSync} from 'child_process';

const server = (args: string): string => {
  return execSync('node dist/server.js').toString();
};

const client = (args: string): string => {
  return execSync(`node dist/client.js ${args}`).toString();
};

describe('Client requests to the server - Tests', () => {
  it('', () => {
    expect('').to.equal('');
  });
});
