const db = require('../config');

class StudyProgramController {
    async createStudyProgram(req, res) {
        const { age_group, cube, name } = req.body;

        if (age_group === undefined || cube === undefined || !name) {
            return res.status(400).json({ error: 'Required fields: age_group, cube, name' });
        }

        const insertSql = "INSERT INTO study_program (age_group, cube, name) VALUES (?, ?, ?)";
        db.run(insertSql, [age_group, cube, name], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create study program' });
            }
            return res.status(201).json({ id: this.lastID, age_group, cube, name });
        });
    }

    async getAllStudyPrograms(req, res) {
        const sql = "SELECT * FROM study_program";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getStudyProgramById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid study program ID' });
        }

        const sql = "SELECT * FROM study_program WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Study program not found' });
            }
            return res.json(row);
        });
    }

    async getStudyProgramsByAgeGroup(req, res) {
        const { age_group_id } = req.params;

        if (!age_group_id || isNaN(age_group_id)) {
            return res.status(400).json({ error: 'Invalid age group ID' });
        }

        const sql = "SELECT * FROM study_program WHERE age_group = ?";
        db.all(sql, [age_group_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getStudyProgramsByCube(req, res) {
        const { cube_id } = req.params;

        if (!cube_id || isNaN(cube_id)) {
            return res.status(400).json({ error: 'Invalid program cube ID' });
        }

        const sql = "SELECT * FROM study_program WHERE cube = ?";
        db.all(sql, [cube_id], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async updateStudyProgram(req, res) {
        const { id } = req.params;
        const { age_group, cube, name } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid study program ID' });
        }

        const fields = [];
        const values = [];

        if (age_group !== undefined) { fields.push("age_group = ?"); values.push(age_group); }
        if (cube !== undefined) { fields.push("cube = ?"); values.push(cube); }
        if (name !== undefined) { fields.push("name = ?"); values.push(name); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE study_program SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update study program' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Study program not found' });
            }
            return res.json({ id: parseInt(id), message: 'Study program updated successfully' });
        });
    }

    async deleteStudyProgram(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid study program ID' });
        }

        const checkRefSql = "SELECT 1 FROM study_group WHERE program_id = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete study program: it is referenced by one or more study groups'
                });
            }

            const deleteSql = "DELETE FROM study_program WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete study program' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Study program not found' });
                }
                return res.json({ message: 'Study program deleted successfully' });
            });
        });
    }
}

module.exports = new StudyProgramController();