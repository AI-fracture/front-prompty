import { useState } from 'react'
import './App.css'
import { Home } from './components/Home/Home'
import { Header } from './components/Header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
 <Header/>
    <Home/>
    <footer>
  <p>&copy; All rights reserved for <span class="ai-fracture">AI Fracture</span></p>
</footer>

   
    </>
  )
}

export default App
