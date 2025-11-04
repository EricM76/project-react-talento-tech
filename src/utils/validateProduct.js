export const validateProduct = (product, fileRequired = true) => {
   const errors = {}
   if (!product.name || product.name.trim() === '') {
    errors.name = 'El nombre es requerido'
   }
   if (!product.price || product.price <= 0) {
    errors.price = 'El precio es requerido'
   }
   if (!product.discount || product.discount < 0 || product.discount > 100) {
    errors.discount = 'El descuento es requerido'
   }
   if (!product.description || product.description.trim() === '') {
    errors.description = 'La descripción es requerida'
   }
   if (!product.category || product.category.trim() === '') {
    errors.category = 'La categoria es requerida'
   }
   if (fileRequired && !product.file) {
    errors.file = 'La imagen es requerida'
   }
   return errors
}