import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiErrors.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const fetchRole = asyncHandler(async (req, res) =>{
    const roles = await Role.find().select("_id name")
    if(!roles){
        throw new apiError(404, "no role found during fetch")
    }
    res.status(200).json(new apiResponse(200, roles, "Roles fetched successfully"))
})

const assignRoleToUser = asyncHandler(async(req, res)=>{
    const {roleId} = req.body
    try {
        const role = await Role.findById(roleId)
        if(!role){
            throw new apiError(404, "Role not found")
        }
        const user = await User.findByIdAndUpdate(req.params.id, {role: roleId}, {new:true})
        if(!user){
            throw new apiError(404, "User not found")
            }
            res.status(200).json(new apiResponse(200, user, "Role assigned successfully"))
    } catch (error) {
        throw new apiError(500, error.message)
    }
})

const createRole = asyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  // Validate required fields
  if (!name || !Array.isArray(permissions)) {
    throw new apiError(400, "Role name and permissions are required");
  }

  // Find permissions by name
  const permissionDocs = await Permission.find({ name: { $in: permissions } });

   if (!name || !permissions || !Array.isArray(permissions) || permissions.length === 0) {
    throw new apiError(400, "Role name and permissions are required");
  }

  const role = await Role.create({
    name,
    permissions: permissionDocs.map(p => p._id)
  });

  res.status(201).json(new apiResponse(201, role, "Role created successfully"));
});

const removePermissionFromRole = asyncHandler(async (req, res) => {
  const { roleId } = req.params;
const { permissionIds } = req.body;

if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
  throw new apiError(400, "At least one permission ID is required");
}

const role = await Role.findByIdAndUpdate(
  roleId,
  { $pull: { permissions: { $in: permissionIds } } },
  { new: true }
);
  if (!role) {
    throw new apiError(404, "Role not found");
  }

  res.status(200).json(new apiResponse(200, role, "Permission removed successfully"));
});



const deleteRole = asyncHandler(async(req, res)=> {
    const {id} = req.params
    const role = await Role.findByIdAndDelete(id)
    if (!role) {
      throw new apiError(404, "role not found")
    }
    res.status(200).json(new apiResponse(200, {}, "role deleted successfull"))
})

export {fetchRole, assignRoleToUser,createRole, removePermissionFromRole, deleteRole}