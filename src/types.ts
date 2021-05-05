/**
 * @description Type that represents a client request , where we
 * specify a type of the request and a bunch of values related to
 * the note the user wants to add
 */
export type RequestType = {
  type: 'add' | 'modify' | 'remove' | 'read' | 'list';
  user?: string;
  title?: string;
  body?: string;
  color?: string;
}

/**
 * @description Type that represents a server response, where we
 * expect a type of the response, a boolean success variable, and
 * an output strign
 */
export type ResponseType = {
  type: 'add' | 'modify' | 'remove' | 'read' | 'list';
  success: boolean;
  output?: string;
}
