import React, { useState, useEffect, useRef } from "react";
import { Centrifuge, Subscription } from "centrifuge";
import ReusableTable from "./Table";
import { toast } from "react-toastify";

interface Order {
  key: string;
  price: number;
  size: number;
}

const Orderbook: React.FC = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const centrifugeRef = useRef<Centrifuge | null>(null);
  const subRef = useRef<Subscription | null>(null);

  useEffect(() => {
    // Create a new Centrifuge instance
    const centrifuge = new Centrifuge(
      process.env.REACT_APP_CENTRIFUGE_URL as string,
      {
        token: process.env.REACT_APP_CENTRIFUGE_TOKEN as string,
      }
    );

    centrifugeRef.current = centrifuge;

    // Handle connection events
    const handleConnectionEvents = () => {
      centrifuge
        .on("connecting", () => toast.info("Connecting to network..."))
        .on("connected", () => toast.success("Connected to network"))
        .on("disconnected", () =>
          toast.error("Network disconnected. Reconnecting...")
        )
        .on("reconnecting", () => toast.info("Attempting to reconnect..."))
        .on("reconnected", () => {
          toast.success("Reconnected to network");
          resubscribe();
        })
        .connect();
    };

    // Subscribe to the orderbook channel
    const subscribe = () => {
      const sub = centrifuge.newSubscription("orderbook:BTC-USD");

      sub
        .on("publication", ({ data }) => {
          const { bids: newBids, asks: newAsks } = data;

          if (newBids.length > 0) {
            setBids((prevBids) => mergeOrderbook(prevBids, mapOrders(newBids)));
          }

          if (newAsks.length > 0) {
            setAsks((prevAsks) => mergeOrderbook(prevAsks, mapOrders(newAsks)));
          }
        })
        .on("subscribing", () => console.warn("subscribing"))
        .on("subscribed", () => console.warn("subscribed"))
        .on("unsubscribed", () => console.warn("unsubscribed"))
        .on("error", (ctx) => console.error("Error:", ctx))
        .subscribe();

      subRef.current = sub;
    };

    // Resubscribe to the orderbook channel
    const resubscribe = () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
      subscribe();
    };

    handleConnectionEvents();
    subscribe();

    // Cleanup
    return () => {
      if (centrifugeRef.current) {
        centrifugeRef.current.disconnect();
      }
    };
  }, []);

  // Map the order data to the Order type
  const mapOrders = (orders: [string, string][]): Order[] =>
    orders.map(([price, size]) => ({
      key: price,
      price: Number(price),
      size: Number(size),
    }));

  // Merge the current orderbook with the new orderbook data
  const mergeOrderbook = (
    currentOrders: Order[],
    newOrders: Order[]
  ): Order[] => {
    const orderMap = new Map(
      currentOrders.map((order) => [order.price, order])
    );

    newOrders.forEach((order) => {
      if (orderMap.has(order.price)) {
        orderMap.get(order.price)!.size = order.size;
      } else {
        orderMap.set(order.price, order);
      }
    });

    return Array.from(orderMap.values()).filter((order) => order.size > 0);
  };

  const bidColumns = [
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Size", dataIndex: "size", key: "size" },
  ];

  const askColumns = [
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Size", dataIndex: "size", key: "size" },
  ];

  return (
    <div className="orderbook">
      <h1>Orderbook</h1>
      <div className="orderbook-tables">
        <div className="orderbook-table">
          <h2>Bids</h2>
          <ReusableTable<Order> data={bids} columns={bidColumns} />
        </div>
        <div className="orderbook-table">
          <h2>Asks</h2>
          <ReusableTable<Order> data={asks} columns={askColumns} />
        </div>
      </div>
    </div>
  );
};

export default Orderbook;
