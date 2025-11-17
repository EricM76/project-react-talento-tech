export const validateProduct = (product, file = null, fileRequired = true) => {
   const errors = {}
   if (!product.name || product.name.trim() === '') {
    errors.name = 'El nombre es requerido'
   } else if (product.name.trim().length < 10) {
    errors.name = 'El nombre debe tener al menos 10 caracteres'
   }
   if (!product.price || product.price <= 0) {
    errors.price = 'El precio es requerido'
   }
   // El descuento es opcional, pero si se proporciona debe estar entre 0 y 100
   if (product.discount !== undefined && product.discount !== null && product.discount !== '') {
    const discountValue = Number(product.discount)
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
     errors.discount = 'El descuento debe ser un número entre 0 y 100'
    }
   }
   if (!product.description || product.description.trim() === '') {
    errors.description = 'La descripción es requerida'
   } else {
    const descLength = product.description.trim().length
    if (descLength < 20) {
     errors.description = 'La descripción debe tener al menos 20 caracteres'
    } else if (descLength > 500) {
     errors.description = 'La descripción no puede tener más de 500 caracteres'
    }
   }
   if (!product.category || product.category.trim() === '') {
    errors.category = 'La categoria es requerida'
   }
   if (!product.subcategory || product.subcategory.trim() === '') {
    errors.subcategory = 'La subcategoría es requerida'
   }
   if (!product.brand || product.brand.trim() === '') {
    errors.brand = 'La marca es requerida'
   }
   if (!product.section || product.section.trim() === '') {
    errors.section = 'La sección es requerida'
   }
   if (fileRequired && !file) {
    errors.image = 'La imagen es requerida'
   } else if (file && file.size > 5 * 1024 * 1024) {
    errors.image = 'La imagen no puede pesar más de 5MB'
   }
   return errors
}