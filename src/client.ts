import {connect} from 'net';
import {RequestType, ResponseType} from './types';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {MessageEventEmitterClient} from './eventEmitterClient';

/**
 * @description Socket representing the client, that is connected to
 * the port 60300
 */
const socket = connect({port: 60300});
const client = new MessageEventEmitterClient(socket);

/**
 * @description Yargs command snippet for the add option. This command expects
 * the user, title, body and color of the note. Then it calls the ```addNote```
 * method from ```Notes``` class passing all the arguments.
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' &&
      typeof argv.user === 'string' &&
      typeof argv.body === 'string' &&
      typeof argv.color === 'string') {
      const req: RequestType = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };

      socket.write(JSON.stringify(req), (err) => {
        if (err) {
          console.log(`Request could not be made: ${err.message}`);
        } else {
          socket.end();
        }
      });
    }
  },
});
/**
 * @description Yargs command snippet for the modify option.
 * This command expects the user and title of the note.
 * The body and color of the note are optional parameters.
 * Then it calls the ```modifyNote``` method from ```Notes``` class passing
 * all the arguments.
 */
yargs.command({
  command: 'modify',
  describe: 'Modifies an existing note',
  builder: {
    user: {
      describe: 'Note owner',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'New body',
      demandOption: false,
      type: 'string',
    },
    color: {
      describe: 'New color',
      demandOption: false,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' &&
      typeof argv.user === 'string' &&
      typeof argv.body === 'string' &&
      typeof argv.color === 'string') {
      const req: RequestType = {
        type: 'modify',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };

      socket.write(JSON.stringify(req), (err) => {
        if (err) {
          console.log(`Request could not be made: ${err.message}`);
        } else {
          socket.end();
        }
      });
    }
  },
});

/**
 * @description Yargs command snippet for the remove option.
 * This command expects the user and title of the note.
 * Then it calls the ```removeNote``` method from ```Notes``` class passing
 * all the arguments.
 */
yargs.command({
  command: 'remove',
  describe: 'Removes a note',
  builder: {
    user: {
      describe: `Note's list owner`,
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const req: RequestType = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };

      socket.write(JSON.stringify(req), (err) => {
        if (err) {
          console.log(`Request could not be made: ${err.message}`);
        } else {
          socket.end();
        }
      });
    }
  },
});

/**
 * @description Yargs command snippet for the read option. This command expects
 * the user and the title of the note. Then it calls the ```readNote```
 * method from ```Notes``` class passing all the arguments.
 */
yargs.command({
  command: 'read',
  describe: 'Reads a note',
  builder: {
    user: {
      describe: `Note's list owner`,
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const req: RequestType = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };

      socket.write(JSON.stringify(req), (err) => {
        if (err) {
          console.log(`Request could not be made: ${err.message}`);
        } else {
          socket.end();
        }
      });
    }
  },
});

/**
 * @description Yargs command snippet for the list option. This command expects
 * the user. Then it calls the ```listNotes``` method from ```Notes``` class
 * passing all the arguments.
 */
yargs.command({
  command: 'list',
  describe: 'Lists all the user notes',
  builder: {
    user: {
      describe: `Note's list owner`,
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const req: RequestType = {
        type: 'list',
        user: argv.user,
      };

      socket.write(JSON.stringify(req), (err) => {
        if (err) {
          console.log(`Request could not be made: ${err.message}`);
        } else {
          socket.end();
        }
      });
    }
  },
});

/**
 * @description Socket event 'end' where we process the information
 * incoming from the server
 */
client.on('message', (message) => {
  const res: ResponseType = message;
  if (!res.success) {
    console.log(chalk.red(res.output));
  } else if (res.type !== 'read' && res.type !== 'list') {
    console.log(chalk.green(res.output));
  } else {
    console.log(res.output);
  }
});

/**
 * @description Socket event 'error' where we notify when an error has occurred
 */
client.on('error', (err) => {
  console.log(`Connection could not be established: ${err.message}`);
});

yargs.parse();