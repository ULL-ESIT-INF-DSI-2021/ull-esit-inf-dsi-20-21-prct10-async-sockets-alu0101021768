# Práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto

## Tareas previas

Como tareas previas para el desarrollo de esta aplicación he estudiado la documentación correspondiente a la clase [EventEmitter](https://nodejs.org/dist/latest-v16.x/docs/api/net.html) y también el módulo [net](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter).

## Resolución

Considerando el código proporcionado para visualizar la ejecución del cliente, podemos ver que es exactamente igual a la implementada en prácticas anteriores. En este caso vemos como el cliente tras recibir la respuesta a su petición por parte del servidor la procesa y automáticamente se cierra su lado de la conexión gracias a que tenemos activada la opción en el servidor llamada `allowHalfOpen`. Aquí es donde podemos notar el patrón **petición-respuesta**.

Tal y como se indica en las recomendaciones del desarrollo los pasos de mensajes se hacen serializando objetos con las peticiones o las respuestas mediante el método `stringify`, así como al recibirlos, se usa el método `parse` para obtener el objeto a partir del string serializado.

### Cliente

Para la el cliente he creado una clase heredera de `EventEmitter` llamada `eventEmitterClient`, en la cual paso por parámetro un objeto `EventEmitter` que representa la conexión. Dentro de la clase acumulo todos los datos recibidos a través de un evento `data` y luego emito un evento `message` con los datos parseados.

De esta manera, desde el fichero **client.ts** trabajo mediante `yargs` todas las posibles tipos de peticiones que puede hacer el cliente, y creando las correspondientes peticiones ayudándome de los tipos de datos diseñados tanto para las peticiones como para las respuestas.

```typescript
/**
 * @description Type that represents a client request , where we
 * specify a type of the request and a bunch of values related to
 * the note the user wants to add
 */
export type RequestType = {
  type: "add" | "modify" | "remove" | "read" | "list";
  user?: string;
  title?: string;
  body?: string;
  color?: string;
};

/**
 * @description Type that represents a server response, where we
 * expect a type of the response, a boolean success variable, and
 * an output strign
 */
export type ResponseType = {
  type: "add" | "modify" | "remove" | "read" | "list";
  success: boolean;
  output?: string;
};
```

Por último, cuando se procesa un comando, una vez el evento `message` se ha emitido, sabemos que hemos obtenido una respuesta del servidor y se trata de manera que, si hay un error se muestra y de lo contrario, mostramos la respuesta de una manera u otra dependiendo del tipo.

```typescript
/**
 * @description Socket event 'message' where we process the information
 * incoming from the server
 */
client.on("message", (message) => {
  const res: ResponseType = message;
  if (!res.success) {
    console.log(chalk.red(res.output));
  } else if (res.type !== "read" && res.type !== "list") {
    console.log(chalk.green(res.output));
  } else {
    console.log(res.output);
  }
});
```

### Servidor

Para la el servidor he creado una clase heredera de `EventEmitter` llamada `eventEmitterServer`, en la cual tengo dos atributos, uno correspondiente al servidor y otro correspondiente a la instancia de la clase `Notes`, la cual contiene todas las operaciones a realizar con el sistema de ficheros. Dentro de la clase creo el server, y sobre de la conexión asociada al server creado, registro una serie de eventos. En un evento `data`, acumulo todos los datos y luego en el evento `end` planteo toda la lógica asociada a la petición recibida, para poder formatear la respuesta a enviar al cliente de vuelta.

Por último planteo también eventos para cuando suceda algún error en la creación del servidor, y otro para cuando se cierra la conexión del lado del servidor, además de plantear una función `listen` a través de la cual indico el puerto sobre el que va a escuchar el server creado.

## Decisiones generales de Diseño | Conclusiones y Problemas

Respecto al diseño, estoy algo descontento porque no he logrado plantear un diseño de manera que sea fácilmente testeable y por lo tanto he tenido que hacer diversos wrappers que me permitieran mínimamente emitir eventos y probar la funcionalidad de mi cliente y mi servidor.

Nuevamente, he tenido muchos problemas al intentar integrar todo el código desarrollado con los workflows de github, puesto que muchas de las funciones utilizadas para el desarrollo de esta práctica no estaban en la mayor parte de las versione de node. Asimismo, también he tenido problemas con el badge de Coveralls ya que no actualizaba correctamente el porcentaje de cobertura del código.

Por último reincidir en los problemas a nivel de testing con la práctica ya que he dedicado muchísimo más tiempo a intentar hacer la práctica testeable que en hacerla funcional, lo cual me ha desagradado bastante porque implica que si queremos desarrollar un servidor y un cliente propios, deberemos también gestionarnos nuestros propios eventos y errores, lo cual hace todo un proceso bastante más tedioso.

- [Enlace al informe con la explicación de las resoluciones](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101021768/)
- [Enlace al código fuente en typescript](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101021768/tree/main/src)
- [Enlace a la documentación](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101021768/tree/main/docs)
- [Enlace a los tests](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101021768/tree/main/tests)
