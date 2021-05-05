import * as chalk from 'chalk';
import {existsSync} from 'fs';
import {mkdirSync} from 'fs';
import {writeFileSync} from 'fs';
import {readdirSync} from 'fs';
import {readFileSync} from 'fs';
import { rmSync } from 'fs';
import { rmdirSync } from 'fs';

/**
 * @description Const used to store a repeated message
 * and not have to write it everytime it's needed
 */
const noteNotFound = "Note not found!";

/**
 * @description Class Notes that represents multiple operations working with
 * the node filesystem utilities to create, modify, remove, read and list notes
 * from multiple users
 */
export class Notes {
  private static NotesInstance: Notes;
  /**
   * @description Class Notes constructor, in this case, it does nothing
   */
  constructor() {
    // This is intentional
  }
  /**
   * @description Static getter method that returns the instance of the notes
   * class and creates it if doesn't exist
   * @returns Returns a Notes instance
   */
  public static getNotesInstance(): Notes {
    if (!Notes.NotesInstance) {
      Notes.NotesInstance = new Notes();
    }
    return Notes.NotesInstance;
  }

  /**
   * @description Method that adds a new note in a file to an users directory,
   * creating the directory if it doesn't exist.
   * @param user Consists of a string representing user's name
   * @param title Consists of a string representing the user's note title
   * @param body Consists of a string representing the user's note body
   * @param color Consists of a string representing the user's note color
   * @returns Returns a string with the result of adding the note,
   * or an error
   */
  public addNote(user: string, title: string, body: string, color: string) {
    const data =
      `{ "title": "${title}", "body": "${body}", "color": "${color}" }`;
    const dir = this.getRoute(user);
    const fileRoute = dir + `${title}`;
    if (existsSync(fileRoute)) {
      return "Note title taken!";
    }
    writeFileSync(fileRoute, data);
    return "New note added!";
  }

  /**
   * @description Method that modifies an existing note by specifying the user
   * and the title of the note, rest of parameters are optional but if some are
   * provided, the existing data will be overwritten by the new data
   * @param user Consists of a string representing user's name
   * @param title Consists of a string representing the user's note title
   * @param body Consists of a string representing the user's note body
   * @param color Consists of a string representing the user's note color
   * @returns Returns a string with the result of modifying the note,
   * or an error
   */
  public modifyNote(user: string, title: string, body?: string,
      color?: string) {
    const dir = this.getRoute(user);
    const fileRoute = dir + `${title}`;
    if (!existsSync(fileRoute)) {
      return noteNotFound;
    }
    const fileData = readFileSync(fileRoute);
    const dataToJson = JSON.parse(fileData.toString());
    let newBody = body;
    let newColor = color;
    if (body === undefined) {
      newBody = dataToJson.body;
    }
    if (color === undefined) {
      newColor = dataToJson.color;
    }
    const data =
      `{ "title": "${title}", "body": "${newBody}", "color": "${newColor}" }`;
    writeFileSync(fileRoute, data);
    return "Note modified succesfully!";
  }

  /**
   * @description Method that removes an existing note by specifying the user
   * and the title of the note
   * @param user Consists of a string representing user's name
   * @param title Consists of a string representing the user's note title
   * @returns Returns a string with the result of removing the note, or an error
   */
  public removeNote(user: string, title: string) {
    const dir = this.getRoute(user);
    const fileRoute = dir + `${title}`;
    if (!existsSync(fileRoute)) {
      return noteNotFound;
    }
    rmSync(fileRoute);
    if (readdirSync(dir).length === 0) {
        rmdirSync(dir);
    }
    return "Note removed!";
  }

  /**
   * @description Method for reading a specific user note
   * @param user Consists of a string representing user's name
   * @param title Consists of a string representing the user's note title
   * @returns Returns a string with the result of reading the note, or an error
   */
  public readNote(user: string, title: string) {
    const dir = this.getRoute(user);
    const fileRoute = dir + `${title}`;
    if (!existsSync(fileRoute)) {
      return noteNotFound;
    }
    const fileData = readFileSync(fileRoute);
    const dataToJson = JSON.parse(fileData.toString());
    let result = dataToJson.title + "\n" + chalk[dataToJson.color](dataToJson.body);
    return result;
  }

  /**
   * @description Method that lists all the notes from the user's directory.
   * @param user Consists of a string representing user's name
   * @returns Returns a string with the result of listing all the user notes
   */
  public listNotes(user: string) {
    const dir = this.getRoute(user);
    let list = "Your notes";
    readdirSync(dir).forEach((file) => {
      const fileData = readFileSync(dir + file);
      const dataToJson = JSON.parse(fileData.toString());
      const color: string = dataToJson.color;
      list += chalk[color]("\n" + dataToJson.title);
    });
    return list;
  }

  /**
   * @description Getter method for checking if a route exists, creating it
   * if doesn't exist
   * @param user Consists of a string
   * @returns Returns a string
   */
  private getRoute(user: string) {
    const route = `./db/${user}/`;
    if (!existsSync(route)) {
      mkdirSync(route);
    }
    return route;
  }
}