import { useState, useEffect } from 'react';
import { CartContext } from './CartContext';

export const CartProvider = ({ children }) => {
  // Estado del carrito
  const [cart, setCart] = useState([]);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
      }
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Calcular el precio con descuento de un producto
  const calculatePriceWithDiscount = (product) => {
    return product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;
  };

  // Calcular el total parcial de un item del carrito
  const calculateItemTotal = (item) => {
    const priceWithDiscount = calculatePriceWithDiscount(item);
    return priceWithDiscount * item.quantity;
  };

  // Calcular el total del carrito
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + calculateItemTotal(item);
    }, 0);
  };

  // Calcular la cantidad total de productos en el carrito
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Agregar un producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Verificar si el producto ya existe en el carrito
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // Si existe, aumentar la cantidad
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Aumentar la cantidad de un producto
  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Disminuir la cantidad de un producto
  const decreaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          // Si la cantidad es 1, eliminar el producto
          return null;
        }
        return item;
      }).filter(Boolean) // Filtrar valores null
    );
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  // Obtener la cantidad de un producto específico en el carrito
  const getProductQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    calculatePriceWithDiscount,
    getTotalQuantity,
    isInCart,
    getProductQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

