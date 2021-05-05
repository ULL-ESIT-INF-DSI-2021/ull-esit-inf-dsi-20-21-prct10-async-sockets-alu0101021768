import {createServer} from 'net';
import {RequestType, ResponseType} from './types';
import {Notes} from './notes';

/**
 * @description Notes instance, used to work with all the notes
 */
const notesInstance = Notes.getNotesInstance();

const server = createServer({allowHalfOpen: true}, (connection) => {
  console.log('Client connected');

  let data = '';
  connection.on('data', (chunk) => {
    data += chunk;
  });

  connection.on('end', () => {
    console.log('Request received from client');

    const request: RequestType = JSON.parse(data);

    let output = '';
    let error = '';
    switch (request.type) {
      case 'add':
        output = notesInstance.addNote(request.user as string,
          request.title as string,
          request.body as string,
          request.color as string);
        if (output !== "New note added!") {
          error = output;
        }
        break;
      case 'modify':
        output = notesInstance.modifyNote(request.user as string,
          request.title as string,
          request.body as string,
          request.color as string);
        if (output !== "Note modified succesfully!") {
          error = output;
        }
        break;
      case 'remove':
        output = notesInstance.removeNote(request.user as string,
          request.title as string);
        if (output !== "Note removed!") {
          error = output;
        }
        break;
      case 'read':
        output = notesInstance.readNote(request.user as string,
          request.title as string);
        if (output === "Note not found!") {
          error = output;
        }
        break;
      case 'list':
        output = notesInstance.listNotes(request.user as string);
        break;
    }
    const response: ResponseType = {
      type: request.type,
      success: error.length > 1 ? false : true,
      output: output,
    };

    console.log('Response sent to client');
    connection.write(JSON.stringify(response));
    connection.end();
  });

  connection.on('error', (err) => {
    if (err) {
      console.log(`Connection could not be established: ${err.message}`);
    }
  });

  connection.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(60300, () => {
  console.log('Waiting for clients to connect');
});
