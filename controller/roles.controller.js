const db = require('../config');

class RolesController {
    async createRole(req, res) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Role name is required' });
        }

        const checkSql = "SELECT * FROM roles WHERE name = ?";
        db.get(checkSql, [name], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'Role with this name already exists' });
            }

            const insertSql = "INSERT INTO roles (name) VALUES (?)";
            db.run(insertSql, [name], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create role' });
                }
                return res.status(201).json({ id: this.lastID, name });
            });
        });
    }

    async getAllRoles(req, res) {
        const sql = "SELECT * FROM roles";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getRoleById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        const sql = "SELECT * FROM roles WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Role not found' });
            }
            return res.json(row);
        });
    }

    async updateRole(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Role name is required' });
        }

        const checkSql = "SELECT * FROM roles WHERE id = ?";
        db.get(checkSql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Role not found' });
            }

            const updateSql = "UPDATE roles SET name = ? WHERE id = ?";
            db.run(updateSql, [name, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update role' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Role not found' });
                }
                return res.json({ id: parseInt(id), name });
            });
        });
    }

    async deleteRole(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid role ID' });
        }

        const checkRefSql = "SELECT 1 FROM users WHERE role = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete role: it is assigned to one or more users'
                });
            }

            const deleteSql = "DELETE FROM roles WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete role' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Role not found' });
                }
                return res.json({ message: 'Role deleted successfully' });
            });
        });
    }
}

module.exports = new RolesController();