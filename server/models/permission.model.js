import mongoose from "mongoose";

const permissionSchema = mongoose.Schema({
    name: { 
        type: String, required: true, unique: true
     }, // e.g. "create_user"
  description: String,

},{
    timestamps: true
})

export const Permission = mongoose.model('Permission', permissionSchema);