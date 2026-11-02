let orders = [];

let nextId = 1;

// Create a new order
function createOrder(customer, items) {

    const order = {
        id: nextId++,
        customer: customer,
        items: items,
        status: "placed",
        driver: null
    };

    orders.push(order);

    return order;
}

// Change order status
function updateOrderStatus(id, newStatus) {

    const order = orders.find(order => order.id === id);

    if (!order) {
        return { error: "Order not found" };
    }

    const validTransitions = {
        placed: "accepted",
        accepted: "assigned",
        assigned: "picked_up",
        picked_up: "delivered"
    };

    if (validTransitions[order.status] !== newStatus) {
        return { error: "Invalid status transition" };
    }

    // Driver must be assigned before moving to assigned
    if (newStatus === "assigned" && !order.driver) {
        return { error: "A driver must be assigned first" };
    }

    order.status = newStatus;

    return order;
}

// Assign a driver
function assignDriver(id, driverName) {

    const order = orders.find(order => order.id === id);

    if (!order) {
        return { error: "Order not found" };
    }

    if (order.status !== "accepted") {
        return { error: "Order must be accepted first" };
    }

    if (order.driver !== null) {
        return { error: "A driver is already assigned" };
    }

    // Check if driver is already working on another order
    const driverBusy = orders.some(order =>
        order.driver === driverName &&
        (order.status === "assigned" || order.status === "picked_up")
    );

    if (driverBusy) {
        return { error: "Driver is already assigned to another order" };
    }

    order.driver = driverName;

    return updateOrderStatus(id, "assigned");
}

// Get all orders
function getOrders() {
    return orders;
}

module.exports = {
    createOrder,
    updateOrderStatus,
    assignDriver,
    getOrders
};