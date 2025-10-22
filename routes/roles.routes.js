const Router = require('express');
const router = new Router();
const rolesController = require('../controller/roles.controller');

router.post('/createRole', rolesController.createRole);
router.get('/getAllRoles', rolesController.getAllRoles);
router.get('/getRoleById/:id', rolesController.getRoleById);
router.put('/updateRole/:id', rolesController.updateRole);
router.delete('/deleteRole/:id', rolesController.deleteRole);

module.exports = router;