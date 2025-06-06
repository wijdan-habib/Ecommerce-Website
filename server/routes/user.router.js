import { Router } from "express";
import { changeUserPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {checkPermission} from "../middleware/checkPermission.middleware.js";

const router = Router()

router.route("/register").post(verifyJWT,checkPermission('create_user'),upload.fields([
    {name:"profilePicture", maxCount: 1},
]),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeUserPassword)
router.route("/get-user").get(verifyJWT,getCurrentUser)
router.route("/update-user").put(verifyJWT,updateAccountDetails)

router.route("/update-avatar").put(
    verifyJWT,
    upload.single("profilePicture"), // single file upload for avatar
    updateUserAvatar
)



export default router