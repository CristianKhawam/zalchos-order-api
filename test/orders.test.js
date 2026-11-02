const assert = require("node:assert");

const {
    createOrder,
    updateOrderStatus,
    assignDriver
} = require("../src/orders");

// Test 1: Create order
const order1 = createOrder("John", ["Burger"]);

assert.strictEqual(order1.status, "placed");

console.log("Test 1 passed: Order created");

// Test 2: Reject invalid transition
const result = updateOrderStatus(order1.id, "delivered");

assert.strictEqual(result.error, "Invalid status transition");

console.log("Test 2 passed: Invalid transition rejected");

// Test 3: Assign driver
updateOrderStatus(order1.id, "accepted");

const assignedOrder = assignDriver(order1.id, "David");

assert.strictEqual(assignedOrder.driver, "David");

console.log("Test 3 passed: Driver assigned");

// Test 4: Prevent double assignment to same order
const secondAssignment = assignDriver(order1.id, "Michael");

assert.strictEqual(secondAssignment.error, "Order must be accepted first");

console.log("Test 4 passed: Double assignment rejected");

// Test 5: Prevent driver from having two active orders
const order2 = createOrder("Mary", ["Pizza"]);

updateOrderStatus(order2.id, "accepted");

const result2 = assignDriver(order2.id, "David");

assert.strictEqual(
    result2.error,
    "Driver is already assigned to another order"
);

console.log("Test 5 passed: Driver cannot have two active orders");