export class ClientException extends Error {
  constructor(message = "client error") {
    super(message);
    this.name = "client error";
  }
}
