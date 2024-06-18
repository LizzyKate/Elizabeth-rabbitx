import React, { useState, useEffect, useRef } from "react";
import { Centrifuge } from "centrifuge";
import ReusableTable from "./Table";

interface Order {
  key: string;
  price: number;
  size: number;
}

const Orderbook: React.FC = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [lastBidSequence, setLastBidSequence] = useState<number | null>(null);
  const [lastAskSequence, setLastAskSequence] = useState<number | null>(null);
  const centrifugeRef = useRef<Centrifuge | null>(null);

  useEffect(() => {
    // Create a new Centrifuge instance
    const centrifuge = new Centrifuge(
      process.env.REACT_APP_CENTRIFUGE_URL ?? "",
      {
        token: process.env.REACT_APP_CENTRIFUGE_TOKEN ?? "",
      }
    );

    centrifugeRef.current = centrifuge;

    // Create a new subscription to the orderbook channel
    const subscription = centrifuge.newSubscription("orderbook", (message) => {
      const { bids: newBids, asks: newAsks, sequence } = message.data;

      console.log("New bids:", newBids);
      console.log("New asks:", newAsks);

      if (lastBidSequence === null || sequence > lastBidSequence) {
        setLastBidSequence(sequence);
        setBids((prevBids) => mergeOrderbook(prevBids, newBids));
      } else {
        console.warn("Out of sequence bid message received");
      }

      if (lastAskSequence === null || sequence > lastAskSequence) {
        setLastAskSequence(sequence);
        setAsks((prevAsks) => mergeOrderbook(prevAsks, newAsks));
      } else {
        console.warn("Out of sequence ask message received");
      }
    });

    subscription.on("publication", (ctx) => {
      console.log("Subscribed to orderbook");
      console.log(ctx.data);
    });

    subscription.on("error", (error) => {
      console.error("Subscription error:", error);
    });

    subscription.subscribe();

    centrifuge.connect();

    // Reconnect if disconnected
    centrifuge.on("disconnected", (context) => {
      console.warn("Disconnected:", context);
      centrifuge.connect();
    });

    // Cleanup function
    return () => {
      centrifuge.disconnect();
    };
  }, []);

  // Merge the current orderbook with the new orders
  const mergeOrderbook = (
    currentOrders: Order[],
    newOrders: Order[]
  ): Order[] => {
    const orderMap = new Map<number, Order>(
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

  // Define the columns for the bid and ask tables
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
