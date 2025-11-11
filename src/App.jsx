import './App.css'
import { Home } from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import { Categories } from './pages/Categories'
import { NotFound } from './pages/NotFound'
import { ScrollToTop } from './components/ScrollToTop'
import { Products } from './pages/Products/Products'
import { ProductDetail } from './pages/ProductDetail/ProductDetail'
import { CartProvider } from './context/CartProvider'
import { ProductFormContainer } from './components/adminComponents/ProductFormContainer'
import { Dashboard } from './pages/Admin'
import { MainLayout } from './layouts/MainLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginFormContainer } from './components/authComponents/LoginFormContainer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='/categories' element={<Categories />} />
        </Route>
        <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<LoginFormContainer />} />

          <Route path='/admin/dashboard' element={
            <ProtectedRoute>
                <Dashboard />
          </ProtectedRoute>}>
          </Route>

        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </CartProvider>
    </AuthProvider>
  )
}

export default App
