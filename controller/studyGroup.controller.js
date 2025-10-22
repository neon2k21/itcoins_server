const db = require('../config');

class StudyGroupController {
    async createStudyGroup(req, res) {
        const { program_id, time } = req.body;

        if (program_id === undefined || time === undefined) {
            return res.status(400).json({ error: 'Required fields: program_id, time' });
        }

        const insertSql = "INSERT INTO study_group (program_id, time) VALUES (?, ?)";
        db.run(insertSql, [program_id, time], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create study group' });
            }
            return res.status(201).json({ id: this.lastID, program_id, time });
        });
    }

    async getAllStudyGroups(req, res) {
        const sql = "SELECT * FROM study_group";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getStudyGroupById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid study group ID' });
        }

        const sql = "SELECT * FROM study_group WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Study group not found' });
            }
            return res.json(row);
        });
    }

    async getStudyGroupsByProgramId(req, res) {
        const { program_id } = req.params;

        if (!program_id || isNaN(program_id)) {
            return res.status(400).json({ error: 'Invalid program ID' });
        }

        const sql = "SELECT * FROM study_group WHERE program_id = ?";
        db.all(sql, [program_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async updateStudyGroup(req, res) {
        const { id } = req.params;
        const { program_id, time } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid study group ID' });
        }

        const fields = [];
        const values = [];

        if (program_id !== undefined) { fields.push("program_id = ?"); values.push(program_id); }
        if (time !== undefined) { fields.push("time = ?"); values.push(time); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE study_group SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update study group' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Study group not found' });
            }
            return res.json({ id: parseInt(id), message: 'Study group updated successfully' });
        });
    }

    async deleteStudyGroup(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid study group ID' });
        }

        const checkRefSql = "SELECT 1 FROM users WHERE `group` = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete study group: it is assigned to one or more users'
                });
            }

            const deleteSql = "DELETE FROM study_group WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete study group' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Study group not found' });
                }
                return res.json({ message: 'Study group deleted successfully' });
            });
        });
    }
}

module.exports = new StudyGroupController();