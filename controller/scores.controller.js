const db = require('../config');

class ScoresController {
    async createScore(req, res) {
        const { user_id, total_count, date } = req.body;

        if (user_id === undefined || total_count === undefined) {
            return res.status(400).json({ error: 'Required fields: user_id, total_count' });
        }

        const insertSql = "INSERT INTO scores (user_id, total_count, date) VALUES (?, ?, ?)";
        db.run(insertSql, [user_id, total_count, date || new Date().toISOString()], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create score' });
            }
            return res.status(201).json({ id: this.lastID, user_id, total_count, date });
        });
    }

    async getAllScores(req, res) {
        const sql = "SELECT * FROM scores";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getScoresByUserId(req, res) {
        const { user_id } = req.params;

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const sql = "SELECT * FROM scores WHERE user_id = ?";
        db.all(sql, [user_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getScoreById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid score ID' });
        }

        const sql = "SELECT * FROM scores WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Score not found' });
            }
            return res.json(row);
        });
    }

    async updateScore(req, res) {
        const { id } = req.params;
        const { user_id, total_count, date } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid score ID' });
        }

        const fields = [];
        const values = [];

        if (user_id !== undefined) { fields.push("user_id = ?"); values.push(user_id); }
        if (total_count !== undefined) { fields.push("total_count = ?"); values.push(total_count); }
        if (date !== undefined) { fields.push("date = ?"); values.push(date); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE scores SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update score' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Score not found' });
            }
            return res.json({ id: parseInt(id), message: 'Score updated successfully' });
        });
    }

    async deleteScore(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid score ID' });
        }

        const deleteSql = "DELETE FROM scores WHERE id = ?";
        db.run(deleteSql, [id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete score' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Score not found' });
            }
            return res.json({ message: 'Score deleted successfully' });
        });
    }
}

module.exports = new ScoresController();