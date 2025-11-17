const BASE_URL = 'https://69057de8ee3d0d14c132c373.mockapi.io'

const getProducts = async () => {
    const response = await fetch(`${BASE_URL}/products`)
    const data = await response.json()
    return data
}

const getProductById = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`)
    if (!response.ok) {
        throw new Error('Product not found')
    }
    const data = await response.json()
    return data
}

const createProduct = async (product) => {
    const response = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })

    if (!response.ok) {
        throw new Error('Failed to create product')
    }

    const result = await response.json()
    
    return result
}

const updateProduct = async (id, product) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })

    if (!response.ok) {
        throw new Error('Failed to update product')
    }

    const result = await response.json()
    
    return result
}

const deleteProduct = async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error('Failed to delete product')
    }

    return true
}

export { getProducts, createProduct, getProductById, updateProduct, deleteProduct }