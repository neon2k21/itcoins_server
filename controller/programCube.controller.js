const db = require('../config');

class ProgramCubeController {
    async createProgramCube(req, res) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Program cube name is required' });
        }

        const checkSql = "SELECT * FROM program_cube WHERE name = ?";
        db.get(checkSql, [name], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'Program cube with this name already exists' });
            }

            const insertSql = "INSERT INTO program_cube (name) VALUES (?)";
            db.run(insertSql, [name], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create program cube' });
                }
                return res.status(201).json({ id: this.lastID, name });
            });
        });
    }

    async getAllProgramCubes(req, res) {
        const sql = "SELECT * FROM program_cube";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getProgramCubeById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid program cube ID' });
        }

        const sql = "SELECT * FROM program_cube WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Program cube not found' });
            }
            return res.json(row);
        });
    }

    async updateProgramCube(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid program cube ID' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Program cube name is required' });
        }

        const checkSql = "SELECT * FROM program_cube WHERE id = ?";
        db.get(checkSql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Program cube not found' });
            }

            const updateSql = "UPDATE program_cube SET name = ? WHERE id = ?";
            db.run(updateSql, [name, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update program cube' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Program cube not found' });
                }
                return res.json({ id: parseInt(id), name });
            });
        });
    }

    async deleteProgramCube(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid program cube ID' });
        }

        const checkRefSql = "SELECT 1 FROM study_program WHERE cube = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete program cube: it is referenced by one or more study programs'
                });
            }

            const deleteSql = "DELETE FROM program_cube WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete program cube' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Program cube not found' });
                }
                return res.json({ message: 'Program cube deleted successfully' });
            });
        });
    }
}

module.exports = new ProgramCubeController();