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

  useEffect(() => {
    const centrifuge = new Centrifuge(
      process.env.REACT_APP_CENTRIFUGE_URL as string,
      {
        token: process.env.REACT_APP_CENTRIFUGE_TOKEN as string,
      }
    );

    centrifuge
      .on("connecting", function (ctx) {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on("connected", function (ctx) {
        console.log(`connected over ${ctx.transport}`);
      })
      .on("disconnected", function (ctx) {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
      })
      .connect();

    const sub = centrifuge.newSubscription("orderbook:BTC-USD"); // Change 'BTC-USD' to your desired market symbol

    sub
      .on("publication", function (ctx) {
        const data = ctx.data;

        const { bids: newBids, asks: newAsks, sequence } = data;
        console.log("New bids:", newBids);

        if (newBids.length > 0) {
          setBids((prevBids) =>
            mergeOrderbook(
              prevBids,
              newBids.map(([price, size]: [string, string]) => ({
                key: price,
                price: Number(price),
                size: Number(size),
              }))
            )
          );
        }

        if (newAsks.length > 0) {
          setAsks((prevAsks) =>
            mergeOrderbook(
              prevAsks,
              newAsks.map(([price, size]: [string, string]) => ({
                key: price,
                price: Number(price),
                size: Number(size),
              }))
            )
          );
        }
      })
      .on("subscribing", function (ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
      })
      .on("subscribed", function (ctx) {
        console.log("subscribed", ctx);
      })
      .on("unsubscribed", function (ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
      })
      .on("error", function (ctx) {
        console.log(`error: ${ctx.code}, ${ctx.message}`);
      })
      .subscribe();

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
