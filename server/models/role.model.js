import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId, // ✅ correct usage
      ref: 'Permission',                    // ✅ should match model name
    },
  ],
},{
    timestamps: true
}
);
export const Role = mongoose.model('Role', roleSchema);
