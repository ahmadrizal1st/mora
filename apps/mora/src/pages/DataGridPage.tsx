// src/pages/DataGridPage.tsx
import { Avatar } from '../components/ui/Avatar'
import { AvatarList } from '../components/ui/AvatarList'
import { Status } from '../components/ui/Status'
import { Icon } from '../components/ui/Icon'
import { FormCheck } from '../components/ui/FormCheck'
import { DataGrid, DataGridItem } from '../components/ui/DataGrid'
import DefaultLayout from '../layouts/DefaultLayout'

import type { Person } from '../types'

interface DataGridPageProps {
  people?: Person[]
}

export default function DataGridPage({ people = [] }: DataGridPageProps) {
  const creator = people[0]

  return (
    <DefaultLayout pageTitle="Data grid">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Base info</h3>
        </div>
        <div className="card-body">
          <DataGrid>
            <DataGridItem title="Registrar" content="Third Party" />
            <DataGridItem title="Nameservers" content="Third Party" />
            <DataGridItem title="Port number" content="3306" />
            <DataGridItem title="Expiration date" content="–" />
            <DataGridItem title="Creator">
              <div className="d-flex align-items-center">
                <Avatar 
                  person={creator} 
                  className="me-2 rounded-circle" 
                  size="xs"
                />
                {creator?.full_name}
              </div>
            </DataGridItem>
            <DataGridItem title="Age" content="15 days" />
            <DataGridItem title="Edge network">
              <Status text="Active" color="green" />
            </DataGridItem>
            <DataGridItem title="Avatars list">
              <AvatarList stacked size="xs">
                <Avatar person={people[0]} size="xs" />
                <Avatar person={people[1]} size="xs" />
                <Avatar person={people[2]} size="xs" />
                <Avatar placeholder="+3" size="xs" />
              </AvatarList>
            </DataGridItem>
            <DataGridItem title="Checkbox">
              <FormCheck title="Click me" checked />
            </DataGridItem>
            <DataGridItem title="Icon">
              <div className="d-flex align-items-center gap-1">
                <Icon icon="check" color="green" />
                Checked
              </div>
            </DataGridItem>
            <DataGridItem title="Form control">
              <input 
                type="text" 
                className="form-control form-control-flush" 
                placeholder="Input placeholder" 
              />
            </DataGridItem>
            <DataGridItem title="Longer description">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </DataGridItem>
          </DataGrid>
        </div>
      </div>
    </DefaultLayout>
  )
}
