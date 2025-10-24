import './App.css'
import { Home } from './pages/Home'
import { Header } from './components/Header'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { ProductDetail } from './pages/ProductDetail/ProductDetail'
import { Categories } from './pages/Categories'
import { NotFound } from './pages/NotFound'
import { ScrollToTop } from './components/ScrollToTop'
import { Products } from './pages/Products/Products'

function App() {
  return (
    <>
      <ScrollToTop />
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:id' element={<ProductDetail/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
