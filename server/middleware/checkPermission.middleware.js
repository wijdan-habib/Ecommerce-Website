// middleware/checkPermission.js
import {asyncHandler} from '../utils/asyncHandler.js';
import { Role } from '../models/role.model.js';
// import { Permission } from '../models/permission.model.js';
import {apiError} from '../utils/apiErrors.js';

export const checkPermission = (requiredPermission) =>
  asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new apiError(401, "User not authenticated");
    }

    const roleId = user.role._id || user.role;

    const userRole = await Role.findById(roleId).populate('permissions');
    if (!userRole) {
      throw new apiError(403, "User role not found during permission check");
    }

    const hasPermission = userRole.permissions.some(
      (perm) => perm.name === requiredPermission
    );

    if (!hasPermission) {
      throw new apiError(403, "You do not have permission to perform this action");
    }

    next(); // ✅ Permission granted
  });
