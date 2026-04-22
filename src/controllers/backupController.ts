import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Category } from '../models/Category.js';
import { Collection } from '../models/Collection.js';
import { Newsletter } from '../models/Newsletter.js';
import { Analytics } from '../models/Analytics.js';
import jwt from 'jsonwebtoken';

const models: { [key: string]: any } = {
  users: User,
  products: Product,
  orders: Order,
  categories: Category,
  collections: Collection,
  newsletter: Newsletter,
  analytics: Analytics
};

// Middleware to check admin role
const isAdmin = async (req: Request) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id);
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
};

export const getBackup = async (req: Request, res: Response) => {
  if (!(await isAdmin(req))) {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }

  try {
    const { collections } = req.query;
    const requestedCollections = collections ? (collections as string).split(',') : Object.keys(models);

    const wb = XLSX.utils.book_new();

    for (const modelName of requestedCollections) {
      if (models[modelName]) {
        const data = await models[modelName].find({}).lean();
        
        // Flatten data if needed (some fields might be objects)
        const flattenedData = data.map((item: any) => {
          const newItem: any = { ...item };
          // Convert complex objects to strings for Excel
          Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'object' && newItem[key] !== null) {
              newItem[key] = JSON.stringify(newItem[key]);
            }
          });
          return newItem;
        });

        const ws = XLSX.utils.json_to_sheet(flattenedData);
        XLSX.utils.book_append_sheet(wb, ws, modelName.charAt(0).toUpperCase() + modelName.slice(1));
      }
    }

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=backup_${Date.now()}.xlsx`);
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
