import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Permission} from '../models/permission.model.js';
import {DB_NAME} from '../constant.js'

dotenv.config();

console.log('Mongo URI:', process.env.MONGODB_URI); // Debug check

const permissions = [
  { name: 'create_user', description: 'Can create a new user' },
  { name: 'read_user', description: 'Can read user data' },
  { name: 'update_user', description: 'Can update user data' },
  { name: 'delete_user', description: 'Can delete a user' },
  { name: 'create_product', description: 'Can create a product' },
  { name: 'read_product', description: 'Can read product' },
  { name: 'update_product', description: 'Can update product' },
  { name: 'delete_product', description: 'Can delete product' },
  { name: 'create_role', description: 'Can create a role' },
  { name: 'read_role', description: 'Can read role' },
  { name: 'update_role', description: 'Can update role' },
  { name: 'delete_role', description: 'Can delete role' },
];

const seedPermissions = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    await Permission.deleteMany();
    const result = await Permission.insertMany(permissions);
    console.log('Permissions Seeded:', result);
    process.exit();
  } catch (error) {
    console.error('Error seeding permissions:', error);
    process.exit(1);
  }
};

seedPermissions();
