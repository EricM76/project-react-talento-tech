import './App.css'
import { Home } from './pages/Home'
import { Header } from './components/Header'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { Categories } from './pages/Categories'
import { NotFound } from './pages/NotFound'
import { ScrollToTop } from './components/ScrollToTop'
import { Products } from './pages/Products/Products'
import { ProductDetail } from './pages/ProductDetail/ProductDetail'
import { CartProvider } from './context/CartProvider'
import { ProductFormContainer } from './components/adminComponents/ProductFormContainer'

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:id' element={<ProductDetail/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/admin' element={<ProductFormContainer/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </CartProvider>
  )
}

export default App
