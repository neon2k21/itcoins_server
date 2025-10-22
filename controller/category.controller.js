const db = require('../config');

class CategoryController {
    async createCategory(req, res) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const checkSql = "SELECT * FROM category WHERE name = ?";
        db.get(checkSql, [name], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'Category with this name already exists' });
            }

            const insertSql = "INSERT INTO category (name) VALUES (?)";
            db.run(insertSql, [name], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create category' });
                }
                return res.status(201).json({ id: this.lastID, name });
            });
        });
    }

    async getAllCategories(req, res) {
        const sql = "SELECT * FROM category";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getCategoryById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const sql = "SELECT * FROM category WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Category not found' });
            }
            return res.json(row);
        });
    }

    async updateCategory(req, res) {
        const { id } = req.params;
        const { name } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const checkSql = "SELECT * FROM category WHERE id = ?";
        db.get(checkSql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Category not found' });
            }

            const updateSql = "UPDATE category SET name = ? WHERE id = ?";
            db.run(updateSql, [name, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to update category' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                return res.json({ id: parseInt(id), name });
            });
        });
    }

    async deleteCategory(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const checkRefSql = "SELECT 1 FROM shop_items WHERE category = ? LIMIT 1";
        db.get(checkRefSql, [id], (err, refRow) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (refRow) {
                return res.status(409).json({
                    error: 'Cannot delete category: it is referenced by one or more shop items'
                });
            }

            const deleteSql = "DELETE FROM category WHERE id = ?";
            db.run(deleteSql, [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to delete category' });
                }
                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                return res.json({ message: 'Category deleted successfully' });
            });
        });
    }
}

module.exports = new CategoryController();