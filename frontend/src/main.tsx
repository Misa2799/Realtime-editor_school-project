import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './contexts/Providers'

createRoot(document.getElementById('root')!).render(
  // to prevent double rendering, comment out the <StrictMode> tag
  // <StrictMode>
    <Providers />
  // {/* </StrictMode> */}
)
