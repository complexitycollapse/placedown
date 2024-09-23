import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CacheList from '../components/cache-list'
import PersistenceLayerComponent from '../components/persistence-layer-component';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersistenceLayerComponent></PersistenceLayerComponent>
  </StrictMode>,
);
