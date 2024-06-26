### Orderbook Synchronization Implementation

## Start Project

- Install the required dependencies using npm.

* npm install

- Start the application.

* npm start

## Approach:

- Used ReactJS for building the UI component.
- Used AntDesign framework for building table
- Integrated Centrifuge-js SDK for websocket connection and orderbook updates.
- Implemented merging logic for bids and asks to ensure efficient memory management.
- Handled network disconnections with automatic reconnection logic.

## Challenges:

- Ensuring efficient memory usage while handling frequent websocket updates.
- Managing network disruptions and maintaining a consistent orderbook state.
- Verified sequence numbers to manage lost packages

## Possible Improvements:

- Implement further optimizations in the merging logic.
- Enhance UI to display more detailed orderbook information.
- Add unit tests for the merging and websocket handling logic.
