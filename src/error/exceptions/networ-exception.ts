export class NetworkException extends Error {
  constructor(message = "network error") {
    super(message);
    this.name = "network error";
  }
}
