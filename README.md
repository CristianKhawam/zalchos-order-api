# Zalchos Order API

A small order-management API built with Node.js and Express for the Zalchos backend assessment. Orders are saved in memory, and all data is fictional.

What it does:

- Creates an order with the status `placed`.
- Moves the order through `placed → accepted → assigned → picked_up → delivered`, one step at a time.
- Rejects invalid transitions, such as skipping a step or going back.
- Prevents double driver assignment:
  - An order cannot get a second driver.
  - A driver cannot take a new order while they still have one that is `assigned` or `picked_up`. Once that order is delivered, the driver is free again.

## How to run

You need Node.js 18 or newer.

```bash
npm install   # installs Express
npm start     # starts the API on http://localhost:3000
npm test      # runs the tests
```

## Endpoints

| Method | Path                 | Body example                                        | Description                          |
|--------|----------------------|-----------------------------------------------------|--------------------------------------|
| GET    | `/orders`            | none                                                | List all orders                      |
| POST   | `/orders`            | `{ "customer": "John", "items": ["Burger", "Fries"] }` | Create an order                   |
| PATCH  | `/orders/:id/status` | `{ "status": "accepted" }`                          | Move the order to the next status    |
| POST   | `/orders/:id/assign` | `{ "driver": "David" }`                             | Assign a driver (status → `assigned`) |

Errors return `{ "error": "message" }` with one of these status codes:

- **404:** the order does not exist.
- **400:** missing data, an invalid status transition, or a busy driver.

## Project structure

- `src/orders.js`: the order logic (create, change status, assign driver).
- `src/app.js`: the Express routes and the server.
- `test/orders.test.js`: 5 tests:
  1. Creating an order.
  2. Rejecting an invalid transition.
  3. Assigning a driver.
  4. Preventing a second driver on the same order.
  5. Preventing a driver from having two active orders.

An order only moves to `assigned` through `/assign`, because it needs a driver first.

## What I would add with more time

- A database, so orders are not lost when the server restarts.
- A 409 Conflict status for invalid transitions and busy drivers, instead of 400.
- A `cancelled` status.

## AI use disclosure

I used Claude (Anthropic) as an AI assistant while working on this task. It helped me plan the project structure, understand the requirements, and identify possible improvements. I wrote and tested my own implementation, using simple JavaScript and Express. Claude also reviewed my code and helped me identify issues, such as allowing the same driver to be assigned to multiple active orders and the API crashing when a request had an empty body. I reviewed these suggestions and made the necessary corrections myself. Claude also helped me organize the project files and prepare this README.
