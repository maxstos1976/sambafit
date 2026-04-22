import { Product } from '../types';

const API_URL = '/api';

export const productApi = {
  getAll: async (filters: { category?: string; collection?: string; minPrice?: number; maxPrice?: number } = {}): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.collection) params.append('collection', filters.collection);
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const response = await fetch(`${API_URL}/products?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.map((p: any) => ({ ...p, id: p.id || p._id }));
  },

  getBestSellers: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products/best-sellers`);
    if (!response.ok) throw new Error('Failed to fetch best sellers');
    const data = await response.json();
    return data.map((p: any) => ({ ...p, id: p.id || p._id }));
  },

  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },
  
  create: async (token: string, productData: any): Promise<Product> => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  update: async (token: string, id: string, productData: any): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  delete: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }
};

export const collectionApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/collections`);
    if (!response.ok) throw new Error('Failed to fetch collections');
    return response.json();
  },
  create: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create collection');
    return response.json();
  },
  update: async (token: string, id: string, data: any) => {
    const response = await fetch(`${API_URL}/collections/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update collection');
    return response.json();
  },
  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/collections/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete collection');
  }
};

export const categoryApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },
  create: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },
  update: async (token: string, id: string, data: any) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },
  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete category');
  }
};

export const authApi = {
  login: async (credentials: any) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (userData: any) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (token: string, userData: any) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  deleteAccount: async (token: string) => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete account');
    return response.json();
  },

  toggleFavorite: async (token: string, productId: string) => {
    const response = await fetch(`${API_URL}/users/favorites/${productId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
  }
};

export const cartApi = {
  add: async (token: string, productId: string, quantity: number, selectedSize?: string, isGiftCard?: boolean, giftCardId?: string) => {
    const response = await fetch(`${API_URL}/users/cart/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity, selectedSize, isGiftCard, giftCardId })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  remove: async (token: string, productId: string, selectedSize?: string, isGiftCard?: boolean) => {
    const response = await fetch(`${API_URL}/users/cart/remove`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, selectedSize, isGiftCard })
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  update: async (token: string, productId: string, quantity: number, selectedSize?: string, isGiftCard?: boolean) => {
    const response = await fetch(`${API_URL}/users/cart/update`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity, selectedSize, isGiftCard })
    });
    if (!response.ok) throw new Error('Failed to update cart');
    return response.json();
  }
};

export const orderApi = {
  create: async (token: string, orderData: any) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  getMyOrders: async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },
  
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/orders/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch all orders');
    return response.json();
  },

  updateStatus: async (token: string, id: string, status?: string, status_envio?: string, codigo_rastreamento?: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, status_envio, codigo_rastreamento })
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete order');
    return response.json();
  },

  deleteMultiple: async (token: string, ids: string[]) => {
    const response = await fetch(`${API_URL}/orders/bulk-delete`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ids })
    });
    if (!response.ok) throw new Error('Failed to delete multiple orders');
    return response.json();
  },

  deleteAll: async (token: string) => {
    const response = await fetch(`${API_URL}/orders/all`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete all orders');
    return response.json();
  }
};

export const newsletterApi = {
  subscribe: async (email: string) => {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe');
    }
    return response.json();
  }
};

export const adminApi = {
  seedDatabase: async () => {
    const response = await fetch(`${API_URL}/seed`, {
      method: 'POST',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to seed database');
    }
    return response.json();
  },

  getUsers: async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  deleteUser: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  updateUserRole: async (token: string, id: string, role: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  },
  
  getStats: async (token: string) => {
    const response = await fetch(`${API_URL}/orders/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  getDetailedReport: async (token: string, filters: { size?: string; sortBy?: string; order?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.size) params.append('size', filters.size);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    const response = await fetch(`${API_URL}/orders/report?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch detailed report');
    return response.json();
  }
};

export const analyticsApi = {
  track: async (eventData: { eventType: 'visitor' | 'cart_add' | 'checkout_start'; productId?: string; sessionId?: string }) => {
    fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    }).catch(err => console.error('Tracking error:', err));
  },

  getFunnel: async (token: string) => {
    const response = await fetch(`${API_URL}/analytics/funnel`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch funnel data');
    return response.json();
  },

  getHeatmap: async (token: string) => {
    const response = await fetch(`${API_URL}/analytics/heatmap`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch heatmap data');
    return response.json();
  }
};

export const giftCardApi = {
  createDraft: async (token: string, data: {
    value: number;
    recipientName: string;
    recipientEmail: string;
    recipientWhatsApp?: string;
    message?: string;
    isScheduled: boolean;
    scheduledDate?: string;
  }) => {
    const response = await fetch(`${API_URL}/giftcards/draft`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create gift card draft');
    return response.json();
  },

  validate: async (code: string) => {
    const response = await fetch(`${API_URL}/giftcards/validate/${code}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Cartão presente inválido');
    }
    return response.json();
  },
  
  getAll: async (token: string) => {
    const response = await fetch(`${API_URL}/giftcards/admin/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch gift cards');
    return response.json();
  },

  update: async (token: string, id: string, data: any) => {
    const response = await fetch(`${API_URL}/giftcards/admin/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update gift card');
    return response.json();
  },

  delete: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/giftcards/admin/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete gift card');
    return data;
  },

  resendEmail: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/giftcards/admin/${id}/resend`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to resend email');
    return response.json();
  }
};
