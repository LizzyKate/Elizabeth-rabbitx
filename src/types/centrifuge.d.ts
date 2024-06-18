declare module "centrifuge" {
  interface Subscription {
    on(
      event: "subscribe" | "error" | "publication",
      callback: (context: any) => void
    ): void;
    subscribe(): void;
  }

  interface CentrifugeOptions {
    token: string;
  }

  export class Centrifuge {
    constructor(url: string, options?: CentrifugeOptions);
    connect(): void;
    disconnect(): void;
    newSubscription(
      channel: string,
      callback: (message: any) => void
    ): Subscription;
    on(event: "disconnected", callback: (context: any) => void): void;
  }
}
