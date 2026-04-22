import { Product } from '../models/Product.js';
import { Collection } from '../models/Collection.js';
import { Category } from '../models/Category.js';
import { Analytics } from '../models/Analytics.js';
import { Order } from '../models/Order.js';
import { PRODUCTS } from '../types.js';

export const runSeed = async () => {
  // Clear existing data (optional, but keep it for a clean seed)
  // await Product.deleteMany(); // We might not want to delete products if the user has custom ones
  // await Collection.deleteMany();
  
  // Alternative: Keep products, but ensure collections and categories exist
  const products = await Product.find();
  const productCollections = [...new Set(products.map(p => p.collection))];
  const productCategories = [...new Set(products.map(p => p.category))];
  
  // Ensure all collections mentioned in products exist in the Collection model
  for (const colName of productCollections) {
    await Collection.findOneAndUpdate(
      { name: colName },
      { name: colName, description: `A coleção ${colName} para seus produtos`, active: true },
      { upsert: true }
    );
  }

  // Ensure all categories mentioned in products exist in the Category model
  for (const catName of productCategories) {
    await Category.findOneAndUpdate(
      { name: catName },
      { name: catName, description: `A categoria ${catName} para seus produtos`, active: true },
      { upsert: true }
    );
  }

  // Also ensure original collections from static list exist
  const staticCollections = [...new Set(PRODUCTS.map(p => p.collection))];
  for (const colName of staticCollections) {
    const exists = await Collection.findOne({ name: colName });
    if (!exists) {
      await Collection.create({
        name: colName,
        description: `Original ${colName} collection`,
        active: true
      });
    }
  }

  // Also ensure original categories from static list exist
  const staticCategories = [...new Set(PRODUCTS.map(p => p.category))];
  for (const catName of staticCategories) {
    const exists = await Category.findOne({ name: catName });
    if (!exists) {
      await Category.create({
        name: catName,
        description: `Original ${catName} category`,
        active: true
      });
    }
  }

  // If no products exist, seed the defaults
  let seededCount = products.length;
  if (products.length === 0) {
    const productsToInsert = PRODUCTS.map(({ id, ...rest }) => rest);
    await Product.insertMany(productsToInsert);
    seededCount = productsToInsert.length;
  }

  //Generate some dummy analytics data for the funnel
  await Analytics.deleteMany({});
  const dummyEvents = [];
  const visitors = 1200;
  const cartAdds = 450;
  const checkouts = 180;

  for (let i = 0; i < visitors; i++) {
    dummyEvents.push({ 
      eventType: 'visitor', 
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) 
    });
  }
  for (let i = 0; i < cartAdds; i++) {
    dummyEvents.push({ 
      eventType: 'cart_add', 
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) 
    });
  }
  for (let i = 0; i < checkouts; i++) {
    dummyEvents.push({ 
      eventType: 'checkout_start', 
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) 
    });
  }

  await Analytics.insertMany(dummyEvents);

  // Generate some dummy orders for heatmap and best sellers
  await Order.deleteMany({});
  const allProducts = await Product.find({});
  const orders = [];
  
  if (allProducts.length > 0) {
    for (let i = 0; i < 50; i++) {
      const product = allProducts[Math.floor(Math.random() * allProducts.length)];
      const size = product.sizes?.[Math.floor(Math.random() * (product.sizes?.length || 1))] || 'M';
      const quantity = Math.floor(Math.random() * 3) + 1;
      const subtotal = product.price * quantity;
      const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      orders.push({
        user: products[0]?._id || allProducts[0]?._id, // fallback
        data_pedido: date,
        status: 'paid',
        status_pagamento: 'paid',
        valor_total: subtotal + 5, // extra for shipping
        moeda: 'EUR',
        metodo_pagamento: ['credit_card', 'paypal', 'bizum'][Math.floor(Math.random() * 3)],
        items: [{
          productId: product._id,
          nome_produto: product.name,
          quantidade: quantity,
          preco_unitario: product.price,
          subtotal: subtotal,
          selectedSize: size
        }],
        shipping: {
          metodo_envio: 'standard',
          custo_envio: 5,
          status_envio: 'delivered'
        }
      });
    }
    await Order.insertMany(orders);
  }

  return seededCount;
};
