const db = require('../config');

class UsersController {
    async createUser(req, res) {
        const { first_name, last_name, otchestvo, contact_number, e_mail, avatar, date_of_birth, role, group } = req.body;

        if (!first_name || !last_name || !contact_number || !e_mail || !avatar || !date_of_birth || role === undefined) {
            return res.status(400).json({ error: 'Required fields: first_name, last_name, contact_number, e-mail, avatar, date_of_birth, role' });
        }

        const checkUserSql = "SELECT * FROM users WHERE `e-mail` = ?";
        db.get(checkUserSql, [e_mail], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'User with this e-mail already exists' });
            }

            const insertUserSql = "INSERT INTO users (first_name, last_name, otchestvo, contact_number, `e-mail`, avatar, date_of_birth, role, `group`, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.run(insertUserSql, [first_name, last_name, otchestvo, contact_number, e_mail, avatar, date_of_birth, role, group || null, 0], function (err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create user' });
                }
                return res.status(201).json({ id: this.lastID, first_name, last_name, e_mail });
            });
        });
    }

    async getAllUsers(req, res) {
        const sql = "SELECT * FROM users";
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.json(rows);
        });
    }

    async getUserById(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const sql = "SELECT * FROM users WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(row);
        });
    }

    async getUserByEmail(req, res) {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const sql = "SELECT * FROM users WHERE `e-mail` = ?";
        db.get(sql, [email], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json(row);
        });
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { first_name, last_name, otchestvo, contact_number, e_mail, avatar, date_of_birth, role, group, balance } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const fields = [];
        const values = [];

        if (first_name !== undefined) fields.push("first_name = ?"), values.push(first_name);
        if (last_name !== undefined) fields.push("last_name = ?"), values.push(last_name);
        if (otchestvo !== undefined) fields.push("otchestvo = ?"), values.push(otchestvo);
        if (contact_number !== undefined) fields.push("contact_number = ?"), values.push(contact_number);
        if (e_mail !== undefined) fields.push("`e-mail` = ?"), values.push(e_mail);
        if (avatar !== undefined) fields.push("avatar = ?"), values.push(avatar);
        if (date_of_birth !== undefined) fields.push("date_of_birth = ?"), values.push(date_of_birth);
        if (role !== undefined) fields.push("role = ?"), values.push(role);
        if (group !== undefined) fields.push("`group` = ?"), values.push(group);
        if (balance !== undefined) fields.push("balance = ?"), values.push(balance);

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        const updateSql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

        db.run(updateSql, values, function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update user' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({ id: parseInt(id), message: 'User updated successfully' });
        });
    }

    async deleteUser(req, res) {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const deleteSql = "DELETE FROM users WHERE id = ?";
        db.run(deleteSql, [id], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete user' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({ message: 'User deleted successfully' });
        });
    }
}

module.exports = new UsersController();