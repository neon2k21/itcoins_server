const db = require('../config');

class ShopItemsController {
    async createShopItem(req, res) {
        const { name, category, price, qty, avaliablity, photo } = req.body;

        if (name === undefined || category === undefined || price === undefined || qty === undefined) {
            return res.status(400).json({ error: 'Required fields: name, category, price, qty' });
        }

        const insertSql = "INSERT INTO shop_items (name, category, price, qty, avaliablity, photo) VALUES (?, ?, ?, ?, ?, ?)";
        db.run(insertSql, [name, category, price, qty, avaliablity ?? true, photo ?? null], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create shop item' });
            }
            return res.status(201).json({ id: this.lastID, name, category, price, qty, avaliablity, photo });
        });
    }

    async getAllShopItems(req, res) {
        const sql = "SELECT * FROM shop_items";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getShopItemById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid shop item ID' });
        }

        const sql = "SELECT * FROM shop_items WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Shop item not found' });
            }
            return res.json(row);
        });
    }

    async getShopItemsByCategory(req, res) {
        const { category_id } = req.params;

        if (!category_id || isNaN(category_id)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const sql = "SELECT * FROM shop_items WHERE category = ?";
        db.all(sql, [category_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async updateShopItem(req, res) {
        const { id } = req.params;
        const { name, category, price, qty, avaliablity, photo } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid shop item ID' });
        }

        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push("name = ?"); values.push(name); }
        if (category !== undefined) { fields.push("category = ?"); values.push(category); }
        if (price !== undefined) { fields.push("price = ?"); values.push(price); }
        if (qty !== undefined) { fields.push("qty = ?"); values.push(qty); }
        if (avaliablity !== undefined) { fields.push("avaliablity = ?"); values.push(avaliablity); }
        if (photo !== undefined) { fields.push("photo = ?"); values.push(photo); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE shop_items SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update shop item' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Shop item not found' });
            }
            return res.json({ id: parseInt(id), message: 'Shop item updated successfully' });
        });
    }

    async deleteShopItem(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid shop item ID' });
        }

        const checkRefSql = "SELECT 1 FROM orders WHERE item_id = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete shop item: it is referenced by one or more orders'
                });
            }

            const deleteSql = "DELETE FROM shop_items WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete shop item' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Shop item not found' });
                }
                return res.json({ message: 'Shop item deleted successfully' });
            });
        });
    }
}

module.exports = new ShopItemsController();