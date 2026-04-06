// src/pages/TagsPage.tsx
import DefaultLayout from '../layouts/DefaultLayout'
import { Tag } from '../components/ui/Tag'
import colors from '../data/colors.json'
import people from '../data/people.json'
import flags from '../data/flags.json'

const tagIcons = [
  'bold',
  'italic',
  'underline',
  'copy',
  'scissors',
  'file-plus',
  'file-minus',
  'ghost',
  'star',
  'script',
  'photo',
  'dog',
  'piano',
]

export default function TagsPage() {
  return (
    <DefaultLayout pageTitle="Tags">
      <div className="row row-cards row-cols-1 row-cols-md-2 row-cols-lg-3">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Default tags</h3>
              <div className="tags-list">
                {Array.from({ length: 14 }).map((_, i) => (
                  <Tag key={i} text={`Label ${i + 1}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Tags with flag</h3>
              <div className="tags-list">
                {flags.slice(0, 9).map((country) => (
                  <Tag key={country.flag} text={country.name} flag={country.flag} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Tags with icon</h3>
              <div className="tags-list">
                {tagIcons.map((icon) => (
                  <Tag key={icon} text={icon} icon={icon} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Tags with avatar</h3>
              <div className="tags-list">
                {people.slice(0, 8).map((person) => (
                  <Tag key={person.id} text={person.full_name} person={person} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Tags with status</h3>
              <div className="tags-list">
                {colors.base.map((color) => (
                  <Tag key={color.name} text={color.name} status={color.name} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Tags with legend</h3>
              <div className="tags-list">
                {colors.base.map((color) => (
                  <Tag key={color.name} text={color.name} legend={color.name} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Default tags</h3>
              <div className="tags-list">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Tag key={i} text={`Label ${i + 1}`} checkbox={true} />
                ))}
                {Array.from({ length: 6 }).map((_, i) => (
                  <Tag key={i + 6} text={`Label ${i + 7}`} checkbox={true} checked={true} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Default tags</h3>
              <div className="tags-list">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Tag key={i} text="Label" badge={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
