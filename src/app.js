const express = require("express");

const app = express();

app.use(express.json());

const {
createOrder,
updateOrderStatus,
assignDriver,
getOrders
} = require("./orders");

// Get all orders
app.get("/orders", (req, res) => {

res.json(getOrders());

});

// Create an order
app.post("/orders", (req, res) => {


const { customer, items } = req.body || {};

if (!customer || !items) {
    return res.status(400).json({
        error: "Customer and items are required"
    });
}

const order = createOrder(customer, items);

res.status(201).json(order);


});

// Update order status
app.patch("/orders/:id/status", (req, res) => {


const id = Number(req.params.id);

const { status } = req.body || {};

const result = updateOrderStatus(id, status);

if (result.error) {

    if (result.error === "Order not found") {
        return res.status(404).json(result);
    }

    return res.status(400).json(result);
}

res.json(result);


});

// Assign a driver
app.post("/orders/:id/assign", (req, res) => {


const id = Number(req.params.id);

const { driver } = req.body || {};

if (!driver) {
    return res.status(400).json({
        error: "Driver name is required"
    });
}

const result = assignDriver(id, driver);

if (result.error) {

    if (result.error === "Order not found") {
        return res.status(404).json(result);
    }

    return res.status(400).json(result);
}

res.json(result);


});

// Start server
if (require.main === module) {


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
}

module.exports = app;
