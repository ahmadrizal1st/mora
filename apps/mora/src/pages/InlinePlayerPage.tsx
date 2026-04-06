// src/pages/InlinePlayerPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { InlinePlayer } from '../components/ui'
import inlinePlayers from '../data/inline-players.json'

export default function InlinePlayerPage() {
  return (
    <BaseLayout pageTitle="Inline Player">
      <div className="row row-cards">
        {inlinePlayers.map((player) => (
          <div key={player.id} className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{player.title}</h3>
                <InlinePlayer
                  id={player.id}
                  type={player.type as 'youtube' | 'vimeo'}
                  embedId={player['embed-id']}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseLayout>
  )
}
