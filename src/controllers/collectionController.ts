import { Request, Response } from 'express';
import { Collection } from '../models/Collection';
import { Product } from '../models/Product';
import { emitUpdate } from '../lib/socket.js';

// Gestão de Coleções
export const collectionController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const collections = await Collection.find();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching collections' });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const newCollection = new Collection({ name: name.trim(), description });
      await newCollection.save();
      emitUpdate('collections', newCollection);
      res.status(201).json(newCollection);
    } catch (error) {
      res.status(400).json({ message: 'Error creating collection' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, active } = req.body;
      
      const oldCollection = await Collection.findById(id);
      if (!oldCollection) return res.status(404).json({ message: 'Collection not found' });

      const oldName = oldCollection.name;
      const newName = name ? name.trim() : oldName;

      const updated = await Collection.findByIdAndUpdate(
        id, 
        { name: newName, description, active }, 
        { new: true }
      );

      // If name changed, update all products in this collection
      if (updated && oldName !== newName) {
        await Product.updateMany(
          { collection: oldName },
          { collection: newName }
        );
        emitUpdate('products');
      }

      if (updated) {
        emitUpdate('collections', updated);
      }

      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Error updating collection' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await Collection.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Collection not found' });
      emitUpdate('collections', { _id: id, deleted: true });
      res.json({ message: 'Collection deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting collection' });
    }
  }
};
