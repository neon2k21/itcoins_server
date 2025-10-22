const db = require('../config');

class AgeGroupController {
    async createAgeGroup(req, res) {
        const { age_min, age_max } = req.body;

        if (age_min === undefined || age_max === undefined) {
            return res.status(400).json({ error: 'Both age_min and age_max are required' });
        }

        if (age_min > age_max) {
            return res.status(400).json({ error: 'age_min must be less than or equal to age_max' });
        }

        const checkSql = "SELECT * FROM age_group WHERE age_min = ? AND age_max = ?";
        db.get(checkSql, [age_min, age_max], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'Age group with these bounds already exists' });
            }

            const insertSql = "INSERT INTO age_group (age_min, age_max) VALUES (?, ?)";
            db.run(insertSql, [age_min, age_max], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create age group' });
                }
                return res.status(201).json({ id: this.lastID, age_min, age_max });
            });
        });
    }

    async getAllAgeGroups(req, res) {
        const sql = "SELECT * FROM age_group";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getAgeGroupById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid age group ID' });
        }

        const sql = "SELECT * FROM age_group WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Age group not found' });
            }
            return res.json(row);
        });
    }

    async updateAgeGroup(req, res) {
        const { id } = req.params;
        const { age_min, age_max } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid age group ID' });
        }

        if (age_min === undefined || age_max === undefined) {
            return res.status(400).json({ error: 'Both age_min and age_max are required' });
        }

        if (age_min > age_max) {
            return res.status(400).json({ error: 'age_min must be less than or equal to age_max' });
        }

        const checkSql = "SELECT * FROM age_group WHERE id = ?";
        db.get(checkSql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Age group not found' });
            }

            const updateSql = "UPDATE age_group SET age_min = ?, age_max = ? WHERE id = ?";
            db.run(updateSql, [age_min, age_max, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update age group' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Age group not found' });
                }
                return res.json({ id: parseInt(id), age_min, age_max });
            });
        });
    }

    async deleteAgeGroup(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid age group ID' });
        }

        const checkRefSql = "SELECT 1 FROM study_program WHERE age_group = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete age group: it is referenced by one or more study programs'
                });
            }

            const deleteSql = "DELETE FROM age_group WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete age group' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Age group not found' });
                }
                return res.json({ message: 'Age group deleted successfully' });
            });
        });
    }
}

module.exports = new AgeGroupController();
