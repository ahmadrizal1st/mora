// src/pages/MapFullsizePage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { MapBox } from '../components/ui'

export default function MapFullsizePage() {
  return (
    <BaseLayout 
      sidebar={true}
      hideTopbar={true}
      wrapperFull={true}
      noContainer={true}
      hideFooter={true}
    >
      <div className="d-flex flex-fill" style={{ height: 'calc(100vh)', width: '100%' }}>
        <MapBox 
          id="google" 
          center={[-6.2088, 106.8456]} 
          zoom={12} 
          style="streets-v12"
        />
      </div>
    </BaseLayout>
  )
}
