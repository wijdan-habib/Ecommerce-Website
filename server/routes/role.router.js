import { Router } from "express";
import { createRole, fetchRole, updateRole } from "../controllers/role.controller.js";
import { checkPermission } from "../middleware/checkPermission.middleware.js";


const router = Router()

router.route("/get-roles").get(checkPermission('read_role'),fetchRole)
router.route("/create-role").post(checkPermission('create_role'),createRole)
router.route("/update-role/:id").post(checkPermission('update_role'),updateRole)
router.delete('/delete-role/:id', verifyJWT, checkPermission('delete_role'), deleteRole);

export default router