import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { emitUpdate } from '../lib/socket.js';

// Gestão de Produtos
export const getProducts = async (req, res) => {
  try {
    const { category, collection, minPrice, maxPrice } = req.query;
    const query: any = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    if (collection) {
      const trimmedCollection = collection.toString().trim();
      query.collection = { $regex: new RegExp(`^${trimmedCollection}$`, 'i') };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const topPaid = await Order.aggregate([
      { $match: { status_pagamento: 'paid' } },
      { $unwind: '$items' },
      { 
        $group: { 
          _id: '$items.productId', 
          total: { $sum: '$items.quantidade' } 
        } 
      },
      { $sort: { total: -1 } },
      { $limit: 15 }
    ]);

    const productIds = topPaid.map(p => p._id);
    const products = await Product.find({ _id: { $in: productIds }, active: { $ne: false } });
    
    // Sort them back to match the aggregated order and attach the aggregated totalSold
    const sortedProducts = topPaid
      .map(tp => {
        const product = products.find(p => p._id.toString() === tp._id.toString());
        if (product) {
          const pObj = product.toObject() as any;
          pObj.totalSold = tp.total;
          pObj.id = pObj._id;
          return pObj;
        }
        return null;
      })
      .filter(Boolean);

    // If we have fewer than 15 products sold, fill with rest of products
    if (sortedProducts.length < 15) {
      const remainingCount = 15 - sortedProducts.length;
      const alreadyIncludedIds = sortedProducts.map(p => p._id.toString());
      const others = await Product.find({ 
        _id: { $nin: alreadyIncludedIds },
        active: { $ne: false }
      }).limit(remainingCount);
      
      sortedProducts.push(...others.map(p => {
        const pObj = p.toObject() as any;
        pObj.totalSold = 0;
        pObj.id = pObj._id;
        return pObj;
      }));
    }

    res.json(sortedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    emitUpdate('products', createdProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
      emitUpdate('products', product);
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      emitUpdate('products', { _id: req.params.id, deleted: true });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
