import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Role} from '../models/role.model.js';
import {Permission} from '../models/permission.model.js';
import { DB_NAME } from '../constant.js';

dotenv.config();

const seedRoles = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    const allPermissions = await Permission.find();
    const permissionsMap = {};
    allPermissions.forEach((p) => {
      permissionsMap[p.name] = p._id;
    });

    await Role.deleteMany();

    const roles = [
      {
        name: 'admin',
        permissions: Object.values(permissionsMap), // All permissions
      },
      {
        name: 'co-admin',
        permissions: [
          permissionsMap['create_user'],
          permissionsMap['read_user'],
          permissionsMap['create_product'],
        ],
      },
      {
        name: 'manager',
        permissions: [
          permissionsMap['read_user'],
          permissionsMap['read_product'],
        ],
      },
    ];

    const result = await Role.insertMany(roles);
    console.log('Roles Seeded:', result);
    process.exit();
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
