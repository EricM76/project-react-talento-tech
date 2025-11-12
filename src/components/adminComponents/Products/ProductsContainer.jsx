import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getProducts, updateProduct } from '../../../services/products'
import { uploadToImgbb } from '../../../services/uploadImage'
import { ProductsUI } from './ProductsUI'

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

  const handleFieldChange = (field, value) => {
    setEditingValues((prev) => (prev ? { ...prev, [field]: value } : prev))
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

  const handleDelete = (product) => {
    console.log('Eliminar:', product)
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

