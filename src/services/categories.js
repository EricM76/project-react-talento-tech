const BASE_URL = 'https://69057de8ee3d0d14c132c373.mockapi.io'

const getCategories = async () => {
    const response = await fetch(`${BASE_URL}/categories`)
    const data = await response.json()
    return data
}

export { getCategories }

