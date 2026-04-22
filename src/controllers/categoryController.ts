import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { emitUpdate } from '../lib/socket.js';

// Gestão de Categorias
export const categoryController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const newCategory = new Category({ name: name.trim(), description });
      await newCategory.save();
      emitUpdate('categories', newCategory);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ message: 'Error creating category' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, active } = req.body;
      
      const oldCategory = await Category.findById(id);
      if (!oldCategory) return res.status(404).json({ message: 'Category not found' });

      const oldName = oldCategory.name;
      const newName = name ? name.trim() : oldName;

      const updated = await Category.findByIdAndUpdate(
        id, 
        { name: newName, description, active }, 
        { new: true }
      );

      // If name changed, update all products in this category
      if (updated && oldName !== newName) {
        await Product.updateMany(
          { category: oldName },
          { category: newName }
        );
        emitUpdate('products'); // Notify that products might have changed categories
      }

      if (updated) {
        emitUpdate('categories', updated);
      }

      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Error updating category' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Category not found' });
      emitUpdate('categories', { _id: id, deleted: true });
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting category' });
    }
  }
};
