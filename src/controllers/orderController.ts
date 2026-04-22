import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { GiftCard } from "../models/GiftCard.js";
import { activateGiftCard } from "./giftCardController.js";
import { emitUpdate } from "../lib/socket.js";

// Gestão de Pedidos
export const createOrder = async (req, res) => {
  const {
    items,
    valor_total,
    moeda,
    metodo_pagamento,
    shipping,
    observacoes,
    codigo_transacao_pagamento,
    status_pagamento,
    giftCardCode,
  } = req.body;

  if (items && items.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    // 1. Calculate actual total from items to prevent tampering and fix gift card logic
    const cartSubtotal = items.reduce(
      (acc, item) => acc + item.preco_unitario * item.quantidade,
      0,
    );
    const shippingTotal = (shipping as any)?.custo_envio || 0;
    const totalBeforeDiscount = cartSubtotal + shippingTotal;

    // 2. Handle Gift Card Redemption
    let calculatedDiscount = 0;
    if (giftCardCode) {
      const gc = await GiftCard.findOne({
        code: giftCardCode,
        status: "active",
      });
      if (gc) {
        if (gc.balance <= 0) {
          return res
            .status(400)
            .json({
              message: "O cartão presente selecionado não possui saldo.",
            });
        }
        calculatedDiscount = Math.min(gc.balance, totalBeforeDiscount);
        gc.balance -= calculatedDiscount;
        if (gc.balance <= 0) gc.status = "used";
        await gc.save();
      } else {
        return res
          .status(400)
          .json({ message: "Cartão presente inválido ou inativo." });
      }
    }

    // 3. Check stock for all items (skip for gift cards)
    for (const item of items) {
      if (item.isGiftCard) continue;

      const product = await Product.findById(
        item.productId || item.id || item._id,
      );
      if (!product) {
        res
          .status(404)
          .json({
            message: `Product ${item.nome_produto || item.name} not found`,
          });
        return;
      }

      const currentStock = product.stock.get(item.selectedSize) || 0;
      if (currentStock < (item.quantidade || item.quantity)) {
        res.status(400).json({
          message: `Insufficient stock for ${item.nome_produto || item.name} in size ${item.selectedSize}. Available: ${currentStock}`,
        });
        return;
      }
    }

    const order = new Order({
      user: req.user._id,
      items,
      valor_total: totalBeforeDiscount - calculatedDiscount,
      moeda: moeda || "EUR",
      desconto: calculatedDiscount,
      giftCardCode,
      metodo_pagamento,
      shipping,
      observacoes,
      codigo_transacao_pagamento,
      status_pagamento: status_pagamento || "pending",
      status: status_pagamento === "paid" ? "paid" : "pending",
    });

    const createdOrder = await order.save();

    // Link order to user and clear cart
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orders: createdOrder._id },
      $set: { cart: [] },
    });

    // Decrease stock and Activate Gift Cards
    for (const item of items) {
      if (
        item.isGiftCard &&
        item.giftCardId &&
        (createdOrder as any).status_pagamento === "paid"
      ) {
        await activateGiftCard(
          item.giftCardId.toString(),
          createdOrder._id.toString(),
        );
      } else if (!item.isGiftCard) {
        const product = await Product.findById(
          item.productId || item.id || item._id,
        );
        if (product) {
          const currentStock = product.stock.get(item.selectedSize) || 0;
          product.stock.set(
            item.selectedSize,
            currentStock - (item.quantidade || item.quantity),
          );
          product.totalSold =
            (product.totalSold || 0) + (item.quantidade || item.quantity);
          await product.save();
          emitUpdate("products", product);
        }
      }
    }

    emitUpdate("orders", createdOrder);
    res.status(201).json(createdOrder);
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    data_pedido: -1,
  });
  res.json(orders);
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email surname")
      .sort({ data_pedido: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (req.body.status) order.status = req.body.status;
    if (req.body.status_envio) {
      order.set("shipping.status_envio", req.body.status_envio);
      order.markModified("shipping");
    }
    if (req.body.codigo_rastreamento !== undefined) {
      order.set("shipping.codigo_rastreamento", req.body.codigo_rastreamento);
      order.markModified("shipping");
    }
    if (req.body.status_pagamento) {
      (order as any).status_pagamento = req.body.status_pagamento;
      if (req.body.status_pagamento === "paid") {
        (order as any).status = "paid";
        // Activate Gift Cards if present
        for (const item of (order as any).items) {
          if (item.isGiftCard && item.giftCardId) {
            await activateGiftCard(
              item.giftCardId.toString(),
              order._id.toString(),
            );
          }
        }
      }
    }
    const updatedOrder = await order.save();
    emitUpdate("orders", updatedOrder);
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

export const getSalesStats = async (req, res) => {
  try {
    const now = new Date();

    // Day start
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Week start (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    // Month start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Year start
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const stats = await Order.aggregate([
      {
        $facet: {
          daily: [
            {
              $match: {
                data_pedido: { $gte: startOfDay },
                status_pagamento: "paid",
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$valor_total" },
                count: { $sum: 1 },
              },
            },
          ],
          weekly: [
            {
              $match: {
                data_pedido: { $gte: startOfWeek },
                status_pagamento: "paid",
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$valor_total" },
                count: { $sum: 1 },
              },
            },
          ],
          monthly: [
            {
              $match: {
                data_pedido: { $gte: startOfMonth },
                status_pagamento: "paid",
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$valor_total" },
                count: { $sum: 1 },
              },
            },
          ],
          yearly: [
            {
              $match: {
                data_pedido: { $gte: startOfYear },
                status_pagamento: "paid",
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$valor_total" },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Stock value calculation
    const products = await Product.find({});
    let totalStockValue = 0;
    let totalItemsInStock = 0;

    products.forEach((product) => {
      if (product.stock) {
        product.stock.forEach((quantity) => {
          totalStockValue += quantity * product.price;
          totalItemsInStock += quantity;
        });
      }
    });

    res.json({
      sales: {
        daily: stats[0].daily[0] || { total: 0, count: 0 },
        weekly: stats[0].weekly[0] || { total: 0, count: 0 },
        monthly: stats[0].monthly[0] || { total: 0, count: 0 },
        yearly: stats[0].yearly[0] || { total: 0, count: 0 },
      },
      stock: {
        totalValue: totalStockValue,
        totalItems: totalItemsInStock,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDetailedSalesReport = async (req, res) => {
  try {
    const { size, sortBy = "totalSold", order = "desc" } = req.query;

    const matchStage: any = { status_pagamento: "paid" };

    const aggregation: any[] = [{ $match: matchStage }, { $unwind: "$items" }];

    if (size) {
      aggregation.push({ $match: { "items.selectedSize": size } });
    }

    const groupStage: any = {
      $group: {
        _id: size
          ? {
              productId: "$items.productId",
              size: "$items.selectedSize",
            }
          : "$items.productId",
        productName: { $first: "$items.nome_produto" },
        totalSold: { $sum: "$items.quantidade" },
        totalRevenue: { $sum: "$items.subtotal" },
        lastSold: { $max: "$data_pedido" },
      },
    };

    aggregation.push(groupStage);

    aggregation.push({
      $project: {
        _id: 0,
        productId: size ? "$_id.productId" : "$_id",
        size: size ? "$_id.size" : { $literal: "Tudo" },
        productName: 1,
        totalSold: 1,
        totalRevenue: 1,
        lastSold: 1,
      },
    });

    const sortOrder = order === "desc" ? -1 : 1;
    aggregation.push({ $sort: { [sortBy]: sortOrder } });

    const bestSellers = await Order.aggregate(aggregation);

    // Promotion suggestions: Products not sold in the last 30 days or never sold
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const allProducts = await Product.find({});
    const soldProductIds = await Order.distinct("items.productId", {
      status_pagamento: "paid",
    });

    const neverSold = allProducts.filter(
      (p) =>
        !soldProductIds.map((id) => id.toString()).includes(p._id.toString()),
    );

    const slowSellingAggregation = [
      { $match: { status_pagamento: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          lastSold: { $max: "$data_pedido" },
        },
      },
      { $match: { lastSold: { $lt: thirtyDaysAgo } } },
    ];

    const slowSellingStats = await Order.aggregate(slowSellingAggregation);
    const slowSellingIds = slowSellingStats.map((s) => s._id.toString());
    const slowSellingProducts = allProducts.filter((p) =>
      slowSellingIds.includes(p._id.toString()),
    );

    const suggestions = [
      ...neverSold.map((p) => ({
        productId: p._id,
        productName: p.name,
        reason: "Nunca vendido",
        lastSold: null,
      })),
      ...slowSellingProducts.map((p) => {
        const stats = slowSellingStats.find(
          (s) => s._id.toString() === p._id.toString(),
        );
        return {
          productId: p._id,
          productName: p.name,
          reason: "Não vendido há mais de 30 dias",
          lastSold: stats ? stats.lastSold : null,
        };
      }),
    ];

    res.json({
      bestSellers,
      suggestions,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Remove order reference from user
      await User.findByIdAndUpdate(order.user, {
        $pull: { orders: order._id },
      });

      await order.deleteOne();
      emitUpdate("orders", { type: "delete", id: req.params.id });
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMultipleOrders = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    // Get orders to find users
    const orders = await Order.find({ _id: { $in: ids } });

    // Remove references from users
    for (const order of orders) {
      await User.findByIdAndUpdate(order.user, {
        $pull: { orders: order._id },
      });
    }

    const result = await Order.deleteMany({ _id: { $in: ids } });
    emitUpdate("orders", { type: "bulk_delete", ids });
    res.json({ message: `${result.deletedCount} orders removed` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllOrders = async (req, res) => {
  try {
    const result = await Order.deleteMany({});

    // Clear all order references from all users
    await User.updateMany({}, { $set: { orders: [] } });

    emitUpdate("orders", { type: "all_deleted" });
    res.json({ message: "All orders removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
