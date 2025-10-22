const db = require('../config');

class OrdersController {
    async createOrder(req, res) {
        const { user_id, item_id, qty, total_price, date, bill, status } = req.body;

        if (user_id === undefined || item_id === undefined || qty === undefined || total_price === undefined || status === undefined) {
            return res.status(400).json({ error: 'Required fields: user_id, item_id, qty, total_price, status' });
        }

        const insertSql = "INSERT INTO orders (user_id, item_id, qty, total_price, date, bill, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.run(insertSql, [user_id, item_id, qty, total_price, date || Math.floor(Date.now() / 1000), bill || null, status], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create order' });
            }
            return res.status(201).json({ id: this.lastID, user_id, item_id, qty, total_price, date, bill, status });
        });
    }

    async getAllOrders(req, res) {
        const sql = "SELECT * FROM orders";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getOrderByUserId(req, res) {
        const { user_id } = req.params;

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const sql = "SELECT * FROM orders WHERE user_id = ?";
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getOrderById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        const sql = "SELECT * FROM orders WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Order not found' });
            }
            return res.json(row);
        });
    }

    async updateOrder(req, res) {
        const { id } = req.params;
        const { user_id, item_id, qty, total_price, date, bill, status } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        const fields = [];
        const values = [];

        if (user_id !== undefined) { fields.push("user_id = ?"); values.push(user_id); }
        if (item_id !== undefined) { fields.push("item_id = ?"); values.push(item_id); }
        if (qty !== undefined) { fields.push("qty = ?"); values.push(qty); }
        if (total_price !== undefined) { fields.push("total_price = ?"); values.push(total_price); }
        if (date !== undefined) { fields.push("date = ?"); values.push(date); }
        if (bill !== undefined) { fields.push("bill = ?"); values.push(bill); }
        if (status !== undefined) { fields.push("status = ?"); values.push(status); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update order' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            return res.json({ id: parseInt(id), message: 'Order updated successfully' });
        });
    }

    async deleteOrder(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        const deleteSql = "DELETE FROM orders WHERE id = ?";
        db.run(deleteSql, [id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete order' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            return res.json({ message: 'Order deleted successfully' });
        });
    }
}

module.exports = new OrdersController();