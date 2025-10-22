const db = require('../config');

class StatusController {
    async createStatus(req, res) {
        const { name, max_days } = req.body;

        if (name === undefined) {
            return res.status(400).json({ error: 'Status name is required' });
        }

        const insertSql = "INSERT INTO status (name, max_days) VALUES (?, ?)";
        db.run(insertSql, [name, max_days ?? null], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create status' });
            }
            return res.status(201).json({ id: this.lastID, name, max_days });
        });
    }

    async getAllStatuses(req, res) {
        const sql = "SELECT * FROM status";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getStatusById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid status ID' });
        }

        const sql = "SELECT * FROM status WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Status not found' });
            }
            return res.json(row);
        });
    }

    async updateStatus(req, res) {
        const { id } = req.params;
        const { name, max_days } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid status ID' });
        }

        const fields = [];
        const values = [];

        if (name !== undefined) { fields.push("name = ?"); values.push(name); }
        if (max_days !== undefined) { fields.push("max_days = ?"); values.push(max_days); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE status SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update status' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Status not found' });
            }
            return res.json({ id: parseInt(id), message: 'Status updated successfully' });
        });
    }

    async deleteStatus(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid status ID' });
        }

        const checkRefSql = "SELECT 1 FROM orders WHERE status = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete status: it is referenced by one or more orders'
                });
            }

            const deleteSql = "DELETE FROM status WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete status' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Status not found' });
                }
                return res.json({ message: 'Status deleted successfully' });
            });
        });
    }
}

module.exports = new StatusController();