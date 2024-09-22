import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CacheList from '../components/cache-list'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CacheList></CacheList>
  </StrictMode>,
);
