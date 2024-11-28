import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Requisiciones from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Requisiciones />
  </StrictMode>,
)
