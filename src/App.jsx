import './App.css'
import { Home } from './pages/Home'
import { Header } from './components/Header'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'
import { ProductDetail } from './pages/ProductDetail/ProductDetail'
import { Products } from './pages/Products'

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:id' element={<ProductDetail/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
