import './App.css'
import { Home } from './pages/Home'
import { Header } from './components/Header'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer'

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
