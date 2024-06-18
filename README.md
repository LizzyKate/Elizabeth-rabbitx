### Orderbook Synchronization Implementation

## Approach:

- Used ReactJS for building the UI component.
- Integrated Centrifuge-js SDK for websocket connection and orderbook updates.
- Implemented merging logic for bids and asks to ensure efficient memory management.
- Handled network disconnections with automatic reconnection logic.
- Verified sequence numbers to manage lost packages.

Challenges:

- Ensuring efficient memory usage while handling frequent websocket updates.
- Managing network disruptions and maintaining a consistent orderbook state.

Possible Improvements:

- Implement further optimizations in the merging logic.
- Enhance UI to display more detailed orderbook information.
- Add unit tests for the merging and websocket handling logic.
