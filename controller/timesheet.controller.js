const db = require('../config');

class TimesheetController {
    async createTimeSlot(req, res) {
        const { time_start, time_end } = req.body;

        if (time_start === undefined || time_end === undefined) {
            return res.status(400).json({ error: 'Required fields: time_start, time_end' });
        }

        const insertSql = "INSERT INTO timesheet (time_start, time_end) VALUES (?, ?)";
        db.run(insertSql, [time_start, time_end], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create time slot' });
            }
            return res.status(201).json({ id: this.lastID, time_start, time_end });
        });
    }

    async getAllTimeSlots(req, res) {
        const sql = "SELECT * FROM timesheet";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getTimeSlotById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid time slot ID' });
        }

        const sql = "SELECT * FROM timesheet WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Time slot not found' });
            }
            return res.json(row);
        });
    }

    async updateTimeSlot(req, res) {
        const { id } = req.params;
        const { time_start, time_end } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid time slot ID' });
        }

        const fields = [];
        const values = [];

        if (time_start !== undefined) { fields.push("time_start = ?"); values.push(time_start); }
        if (time_end !== undefined) { fields.push("time_end = ?"); values.push(time_end); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE timesheet SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update time slot' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Time slot not found' });
            }
            return res.json({ id: parseInt(id), message: 'Time slot updated successfully' });
        });
    }

    async deleteTimeSlot(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid time slot ID' });
        }

        const checkRefSql = "SELECT 1 FROM study_group WHERE time = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete time slot: it is referenced by one or more study groups'
                });
            }

            const deleteSql = "DELETE FROM timesheet WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete time slot' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Time slot not found' });
                }
                return res.json({ message: 'Time slot deleted successfully' });
            });
        });
    }
}

module.exports = new TimesheetController();