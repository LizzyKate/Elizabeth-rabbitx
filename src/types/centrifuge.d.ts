declare module "centrifuge" {
  interface Subscription {
    on(
      event:
        | "publication"
        | "subscribing"
        | "subscribed"
        | "unsubscribed"
        | "error",
      callback: (context: any) => void
    ): this;
    subscribe(): void;
    unsubscribe(): void;
  }

  interface CentrifugeOptions {
    token: string;
  }

  export class Centrifuge {
    constructor(url: string, options?: CentrifugeOptions);
    connect(): void;
    disconnect(): void;
    newSubscription(channel: string): // callback: (message: any) => void
    Subscription;
    on(
      event:
        | "connecting"
        | "connected"
        | "disconnected"
        | "reconnecting"
        | "reconnected",
      callback: (context: any) => void
    ): this;
  }
}
