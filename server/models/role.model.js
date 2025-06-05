import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
   permission:{
    type: mongoose.Schema.Types.objectId,
    ref:'Permission'
   }
},{
    timestamps: true
}
);
export const Role = mongoose.model('Role', roleSchema);
