import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getProducts, updateProduct, deleteProduct } from '../../../services/products'
import { uploadToImgbb } from '../../../services/uploadImage'
import { ProductsUI } from './ProductsUI'
import Swal from 'sweetalert2'

const formatCurrency = (value) => {
  const numericValue = Number(value) || 0
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(numericValue)
}

const formatDiscount = (value) => {
  const numericValue = Number(value) || 0
  return numericValue > 0 ? `${numericValue}%` : '—'
}

const formatStock = (value) => {
  if (value === 0) return '0'
  if (!value && value !== 0) return '—'
  return value
}

const FALLBACK_IMAGE = 'https://via.placeholder.com/280x180.png?text=Sin+imagen'

const createEditableValues = (product = {}) => ({
  name: product.name || '',
  price: product.price !== undefined && product.price !== null ? String(product.price) : '',
  discount: product.discount !== undefined && product.discount !== null ? String(product.discount) : '',
  category: product.category || product.section || '',
  section: product.section || '',
  subcategory: product.subcategory || '',
  stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '',
  brand: product.brand || '',
  status: product.status || 'Activo',
  description: product.description || ''
})

export const ProductsContainer = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [expandedProductId, setExpandedProductId] = useState(null)
  const [editingProductId, setEditingProductId] = useState(null)
  const [editingValues, setEditingValues] = useState(null)
  const [editingImagePreview, setEditingImagePreview] = useState(null)
  const [editingImageFile, setEditingImageFile] = useState(null)
  const [categoriesData, setCategoriesData] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error('Error al obtener productos:', err)
        setError('No se pudieron cargar los productos. Intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    // Cargar categorías para obtener subcategorías
    const fetchCategories = async () => {
      try {
        const response = await fetch('/data/categories.json')
        const data = await response.json()
        setCategoriesData(data)
      } catch (err) {
        console.error('Error al cargar categorías:', err)
      }
    }

    fetchCategories()
  }, [])

  const productsWithFallback = useMemo(
    () =>
      products.map((product) => ({
        ...product
      })),
    [products]
  )

  const categoryOptions = useMemo(() => {
    const values = new Set()
    productsWithFallback.forEach((product) => {
      if (product.category) values.add(product.category)
      if (product.section) values.add(product.section)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const sectionOptions = useMemo(() => {
    const values = new Set()
    productsWithFallback.forEach((product) => {
      if (product.section) values.add(product.section)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const brandOptions = useMemo(() => {
    const values = new Set()
    productsWithFallback.forEach((product) => {
      if (product.brand) values.add(product.brand)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const statusOptions = useMemo(() => {
    const values = new Set(['Activo', 'Inactivo'])
    productsWithFallback.forEach((product) => {
      if (product.status) values.add(product.status)
    })
    return Array.from(values)
  }, [productsWithFallback])

  const getSubcategoryOptions = (category) => {
    if (!category || !categoriesData.length) return []
    const selectedCategory = categoriesData.find((cat) => cat.name === category)
    return selectedCategory && selectedCategory.sub ? selectedCategory.sub : []
  }

  const handleFieldChange = (field, value) => {
    setEditingValues((prev) => {
      if (!prev) return prev
      const updated = { ...prev, [field]: value }
      // Si cambia la categoría, limpiar la subcategoría
      if (field === 'category') {
        updated.subcategory = ''
      }
      return updated
    })
  }

  const handleView = (product) => {
    if (editingProductId === product.id) {
      return
    }
    setExpandedProductId((prev) => (prev === product.id ? null : product.id))
  }

  const handleEdit = (product) => {
    setExpandedProductId(product.id)
    setEditingProductId(product.id)
    setEditingValues(createEditableValues(product))
    setEditingImagePreview(product.image || product.thumbnail || FALLBACK_IMAGE)
    setEditingImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancelEditing = () => {
    setEditingProductId(null)
    setEditingValues(null)
    setEditingImagePreview(null)
    setEditingImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const parseNumberValue = (value, fallback = 0) => {
    if (value === '' || value === null || value === undefined) {
      return fallback
    }
    const numericValue = Number(value)
    return Number.isNaN(numericValue) ? fallback : numericValue
  }

  const handleSave = async (product) => {
    if (!editingValues) {
      return
    }

    try {
      setSaving(true)
      setError(null)

      let imageUrl = product.image
      let thumbnailUrl = product.thumbnail

      // Si hay una nueva imagen, subirla a IMGBB
      if (editingImageFile) {
        try {
          const uploadedImageUrl = await uploadToImgbb(editingImageFile)
          imageUrl = uploadedImageUrl
          thumbnailUrl = uploadedImageUrl
        } catch (imgError) {
          console.error('Error al subir la imagen:', imgError)
          setError('Error al subir la imagen. Por favor, intenta nuevamente.')
          setSaving(false)
          return
        }
      }

      // Preparar el producto actualizado
      const updatedProduct = {
        ...product,
        name: editingValues.name.trim(),
        price: parseNumberValue(editingValues.price, product.price || 0),
        discount: parseNumberValue(editingValues.discount, product.discount || 0),
        category: editingValues.category || editingValues.section || '',
        section: editingValues.section,
        subcategory: editingValues.subcategory || '',
        stock: parseNumberValue(editingValues.stock, product.stock || 0),
        brand: editingValues.brand,
        status: editingValues.status || product.status || 'Activo',
        description: editingValues.description,
        image: imageUrl,
        thumbnail: thumbnailUrl
      }

      // Actualizar el producto en la API
      const savedProduct = await updateProduct(product.id, updatedProduct)

      // Actualizar la lista local de productos
      setProducts((prevProducts) =>
        prevProducts.map((item) => (item.id === product.id ? savedProduct : item))
      )

      // Limpiar estados de edición
      setEditingProductId(null)
      setEditingValues(null)
      setEditingImagePreview(null)
      setEditingImageFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error al actualizar el producto:', err)
      setError('No se pudo actualizar el producto. Intenta nuevamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `<p style="font-size: 18px;">¿Deseas eliminar el producto "<strong>${product.name}</strong>"? Esta acción no se puede deshacer.</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      width: '600px',
      customClass: {
        popup: 'swal2-popup-large',
        confirmButton: 'swal2-confirm-large',
        cancelButton: 'swal2-cancel-large'
      },
      buttonsStyling: true
    })

    if (result.isConfirmed) {
      try {
        setError(null)
        await deleteProduct(product.id)
        
        // Actualizar la lista local de productos
        setProducts((prevProducts) => prevProducts.filter((item) => item.id !== product.id))
        
        // Cerrar la vista expandida si estaba abierta
        if (expandedProductId === product.id) {
          setExpandedProductId(null)
        }
        
        // Cerrar la edición si estaba en edición
        if (editingProductId === product.id) {
          setEditingProductId(null)
          setEditingValues(null)
          setEditingImagePreview(null)
          setEditingImageFile(null)
        }

        await Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          text: 'El producto se eliminó correctamente.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        })
      } catch (err) {
        console.error('Error al eliminar el producto:', err)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el producto. Intenta nuevamente.',
          confirmButtonText: 'Aceptar'
        })
      }
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    setEditingImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingImagePreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <ProductsUI
      products={productsWithFallback}
      loading={loading}
      saving={saving}
      error={error}
      expandedProductId={expandedProductId}
      editingProductId={editingProductId}
      editingValues={editingValues}
      editingImagePreview={editingImagePreview}
      editingImageFile={editingImageFile}
      fileInputRef={fileInputRef}
      categoryOptions={categoryOptions}
      sectionOptions={sectionOptions}
      brandOptions={brandOptions}
      statusOptions={statusOptions}
      categoriesData={categoriesData}
      getSubcategoryOptions={getSubcategoryOptions}
      formatCurrency={formatCurrency}
      formatDiscount={formatDiscount}
      formatStock={formatStock}
      FALLBACK_IMAGE={FALLBACK_IMAGE}
      createEditableValues={createEditableValues}
      handleFieldChange={handleFieldChange}
      handleView={handleView}
      handleEdit={handleEdit}
      handleCancelEditing={handleCancelEditing}
      handleSave={handleSave}
      handleDelete={handleDelete}
      handleImageChange={handleImageChange}
    />
  )
}

