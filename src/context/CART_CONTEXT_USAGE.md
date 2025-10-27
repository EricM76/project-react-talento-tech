# Contexto del Carrito de Compras - Guía de Uso

## Descripción

El contexto del carrito de compras proporciona una solución completa para gestionar productos en el carrito, incluyendo agregar, eliminar, modificar cantidades, calcular totales y persistencia en localStorage.

## Funcionalidades Implementadas

✅ **Agregar productos** - Agregar productos al carrito  
✅ **Eliminar productos** - Eliminar productos del carrito  
✅ **Aumentar cantidad** - Incrementar la cantidad de un producto  
✅ **Disminuir cantidad** - Decrementar la cantidad de un producto  
✅ **Calcular totales** - Calcular total parcial y total del carrito  
✅ **Vaciar carrito** - Eliminar todos los productos del carrito  
✅ **Persistencia** - Guardar automáticamente en localStorage  

## Instalación

El contexto ya está configurado en `App.jsx`. Solo necesitas importar el hook `useCart` en cualquier componente.

## Uso Básico

### 1. Importar el hook

```jsx
import { useCart } from '../context/useCartContext';
```

### 2. Usar el contexto en tu componente

```jsx
const MyComponent = () => {
  const { cart, addToCart } = useCart();
  
  // Tu código aquí
};
```

## API Completa

### Estados y Datos

#### `cart`
Array con todos los productos en el carrito.

```jsx
const { cart } = useCart();
// cart = [{ id: 1, name: 'Producto', price: 100, quantity: 2, ... }, ...]
```

### Funciones

#### `addToCart(product, quantity)`
Agrega un producto al carrito. Si el producto ya existe, incrementa su cantidad.

**Parámetros:**
- `product` (Object): Objeto del producto con propiedades: id, name, price, discount, description, image
- `quantity` (Number, opcional): Cantidad a agregar (por defecto 1)

```jsx
const { addToCart } = useCart();

// Agregar un producto
addToCart(product);

// Agregar con cantidad específica
addToCart(product, 3);
```

#### `removeFromCart(productId)`
Elimina completamente un producto del carrito.

**Parámetros:**
- `productId` (Number): ID del producto a eliminar

```jsx
const { removeFromCart } = useCart();

// Eliminar un producto
removeFromCart(1);
```

#### `increaseQuantity(productId)`
Aumenta la cantidad de un producto en el carrito en 1.

**Parámetros:**
- `productId` (Number): ID del producto

```jsx
const { increaseQuantity } = useCart();

// Aumentar cantidad
increaseQuantity(1);
```

#### `decreaseQuantity(productId)`
Disminuye la cantidad de un producto en el carrito en 1. Si la cantidad llega a 0, elimina el producto.

**Parámetros:**
- `productId` (Number): ID del producto

```jsx
const { decreaseQuantity } = useCart();

// Disminuir cantidad
decreaseQuantity(1);
```

#### `clearCart()`
Vacía completamente el carrito eliminando todos los productos.

```jsx
const { clearCart } = useCart();

// Vaciar el carrito
clearCart();
```

#### `calculateItemTotal(item)`
Calcula el total de un item del carrito considerando descuentos y cantidad.

**Parámetros:**
- `item` (Object): Item del carrito

**Retorna:** Number - Total del item (precio con descuento × cantidad)

```jsx
const { calculateItemTotal } = useCart();

// Calcular total de un item
const total = calculateItemTotal({ price: 100, discount: 10, quantity: 2 });
// Retorna: 180 (100 - 10% = 90, 90 × 2 = 180)
```

#### `calculateCartTotal()`
Calcula el total de todos los productos en el carrito.

**Retorna:** Number - Total del carrito

```jsx
const { calculateCartTotal } = useCart();

// Calcular total del carrito
const total = calculateCartTotal();
```

#### `calculatePriceWithDiscount(product)`
Calcula el precio final de un producto aplicando descuentos.

**Parámetros:**
- `product` (Object): Objeto del producto

**Retorna:** Number - Precio con descuento aplicado

```jsx
const { calculatePriceWithDiscount } = useCart();

// Calcular precio con descuento
const finalPrice = calculatePriceWithDiscount({ price: 100, discount: 20 });
// Retorna: 80
```

#### `getTotalQuantity()`
Obtiene la cantidad total de productos en el carrito (suma de todas las cantidades).

**Retorna:** Number - Cantidad total de productos

```jsx
const { getTotalQuantity } = useCart();

// Obtener cantidad total
const totalItems = getTotalQuantity();
```

#### `isInCart(productId)`
Verifica si un producto está en el carrito.

**Parámetros:**
- `productId` (Number): ID del producto

**Retorna:** Boolean - true si está en el carrito, false si no

```jsx
const { isInCart } = useCart();

// Verificar si está en el carrito
const inCart = isInCart(1);
```

#### `getProductQuantity(productId)`
Obtiene la cantidad de un producto específico en el carrito.

**Parámetros:**
- `productId` (Number): ID del producto

**Retorna:** Number - Cantidad del producto (0 si no está en el carrito)

```jsx
const { getProductQuantity } = useCart();

// Obtener cantidad
const quantity = getProductQuantity(1);
```

## Ejemplos de Uso

### Botón para agregar al carrito

```jsx
const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <button
        onClick={() => addToCart(product)}
        disabled={isInCart(product.id)}
      >
        {isInCart(product.id) ? 'Ya en el carrito' : 'Agregar al carrito'}
      </button>
    </div>
  );
};
```

### Mostrar cantidad de productos en el carrito

```jsx
const CartIcon = () => {
  const { getTotalQuantity } = useCart();
  
  return (
    <div>
      <i className="fas fa-shopping-cart"></i>
      <span>{getTotalQuantity()}</span>
    </div>
  );
};
```

### Listar productos del carrito

```jsx
const CartList = () => {
  const { cart, removeFromCart } = useCart();
  
  return (
    <div>
      {cart.map(item => (
        <div key={item.id}>
          <h4>{item.name}</h4>
          <p>Cantidad: {item.quantity}</p>
          <button onClick={() => removeFromCart(item.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Ajustar cantidad de productos

```jsx
const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity } = useCart();
  
  return (
    <div>
      <h4>{item.name}</h4>
      <button onClick={() => decreaseQuantity(item.id)}>-</button>
      <span>{item.quantity}</span>
      <button onClick={() => increaseQuantity(item.id)}>+</button>
    </div>
  );
};
```

### Mostrar total del carrito

```jsx
const CartTotal = () => {
  const { calculateCartTotal } = useCart();
  const { toThousand } = require('../helpers');
  
  return (
    <div>
      <h3>Total: ${toThousand(calculateCartTotal())}</h3>
    </div>
  );
};
```

## Estructura de Datos

### Producto en el Carrito

```javascript
{
  id: 1,
  name: "Cafetera Moulinex",
  price: 12000,
  discount: 50,
  category: "visited",
  description: "Descripción del producto...",
  image: "/images/img-cafetera.jpg",
  quantity: 2  // Cantidad agregada al carrito
}
```

## Persistencia

El carrito se guarda automáticamente en `localStorage` con la clave `'cart'`. Esto significa que:

- ✅ El carrito se mantiene al recargar la página
- ✅ El carrito persiste entre sesiones
- ✅ Los datos se cargan automáticamente al iniciar la aplicación

## Componente de Ejemplo

Se ha creado un componente de ejemplo en `src/components/Cart/CartExample.jsx` que muestra cómo usar todas las funcionalidades del contexto del carrito.

## Notas Importantes

1. El hook `useCart` debe usarse dentro de un componente que esté envuelto por `CartProvider`
2. Si intentas usar el hook fuera del provider, se lanzará un error
3. Los descuentos se calculan automáticamente en todas las funciones de total
4. El carrito se sincroniza automáticamente con localStorage
5. Al agregar un producto que ya existe, se incrementa su cantidad en lugar de duplicarlo

