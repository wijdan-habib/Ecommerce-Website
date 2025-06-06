import { Router } from "express";
import { createRole, deleteRole, fetchRole, removePermissionFromRole,  } from "../controllers/role.controller.js";
import { checkPermission } from "../middleware/checkPermission.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/get-roles").get(verifyJWT,checkPermission('read_role'),fetchRole)
router.route("/create-role").post(verifyJWT,checkPermission('create_role'),createRole)
router.route("/update-role/:roleId").put(verifyJWT,checkPermission('update_role'),removePermissionFromRole)
router.route('/delete-role/:id').delete( verifyJWT, checkPermission('delete_role'), deleteRole);

export default router