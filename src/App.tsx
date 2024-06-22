import React from "react";
import Orderbook from "./components/OrderTable";

const App: React.FC = () => {
  // console.log("Message received:", message);
  // if (message && message.data) {
  //   const { bids: newBids, asks: newAsks, sequence } = message.data;
  //   console.log("New bids:", newBids);
  //   console.log("New asks:", newAsks);

  //   if (lastBidSequence === null || sequence > lastBidSequence) {
  //     setLastBidSequence(sequence);
  //     setBids((prevBids) => mergeOrderbook(prevBids, newBids));
  //   } else {
  //     console.log("Out of sequence bid message received");
  //   }

  //   if (lastAskSequence === null || sequence > lastAskSequence) {
  //     setLastAskSequence(sequence);
  //     setAsks((prevAsks) => mergeOrderbook(prevAsks, newAsks));
  //   } else {
  //     console.log("Out of sequence ask message received");
  //   }
  // } else {
  //   console.error("Message format incorrect:", message);
  // }
  return <Orderbook />;
};

export default App;
