import React from 'react';
import './Cart.css';
import { useCart } from '../../context/useCartContext';
import { toThousand } from '../../utils';

export const Cart = ({ isOpen, onClose }) => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getTotalQuantity,
    calculatePriceWithDiscount,
  } = useCart();

  // Prevenir scroll del body cuando el carrito está abierto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay de fondo */}
      <div className="cart-overlay" onClick={onClose}></div>

      {/* Sidebar del carrito */}
      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header del carrito */}
        <div className="cart-header">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="cart-title">
              <i className="fas fa-shopping-cart me-2"></i>
              Mi Carrito
              {getTotalQuantity() > 0 && (
                <span className="cart-badge">{getTotalQuantity()}</span>
              )}
            </h3>
            <button className="cart-close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Contenido del carrito */}
        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <p className="cart-empty-text">Tu carrito está vacío</p>
              <button className="btn btn-primary" onClick={onClose}>
                Seguir Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div className="cart-items">
                {cart.map((item) => {
                  const finalPrice = calculatePriceWithDiscount(item);
                  const itemTotal = calculateItemTotal(item);

                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.name}</h4>

                        {item.discount > 0 ? (
                          <div className="cart-item-price">
                            <span className="cart-item-price-original">
                              ${toThousand(item.price)}
                            </span>
                            <span className="cart-item-price-final">
                              ${toThousand(finalPrice)}
                            </span>
                            <span className="cart-item-discount">
                              {item.discount}% OFF
                            </span>
                          </div>
                        ) : (
                          <div className="cart-item-price">
                            <span className="cart-item-price-final">
                              ${toThousand(item.price)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="cart-item-actions">
                        <div className="cart-item-quantity">
                          <button
                            className="cart-btn-quantity"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="cart-quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            className="cart-btn-quantity"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>

                        <div className="cart-item-total">
                          <strong>${toThousand(itemTotal)}</strong>
                        </div>

                        <button
                          className="cart-btn-remove"
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer del carrito */}
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal:</span>
                    <span>${toThousand(calculateCartTotal())}</span>
                  </div>
                  <div className="cart-summary-row cart-total">
                    <strong>Total:</strong>
                    <strong>${toThousand(calculateCartTotal())}</strong>
                  </div>
                </div>

                <div className="cart-footer-buttons">
                  <button className="btn btn-outline-danger mb-2 w-100" onClick={clearCart}>
                    <i className="fas fa-trash me-2"></i>
                    Vaciar Carrito
                  </button>
                  <button className="btn btn-primary w-100">
                    <i className="fas fa-check me-2"></i>
                    Finalizar Compra
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

