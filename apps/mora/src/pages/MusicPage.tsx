// src/pages/MusicPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { MusicTracksList, type Track } from '../components/cards/music/MusicTracksList'
import { MusicTrackInfo } from '../components/cards/music/MusicTrackInfo'
import tracksData from '../data/tracks.json'

export default function MusicPage() {
  const tracks = tracksData as Track[]
  
  // Simulated (8..13) as per liquid template
  const topTracks = tracks.slice(8, 14)

  return (
    <BaseLayout 
      pageTitle="Music components"
      pageActions={<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Music components' }]} />}
    >
      <div className="row">
        <div className="col-lg-8">
          <MusicTracksList tracks={tracks} />
        </div>
        <div className="col-lg-4">
          <h3 className="mb-3">Top tracks</h3>
          <div className="row row-cards">
            {topTracks.map((track, i) => (
              <div key={i} className="col-md-6 col-lg-12">
                <MusicTrackInfo track={track} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
