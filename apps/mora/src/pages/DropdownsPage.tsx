import { DropdownMenu } from '../components/ui/DropdownMenu'
import { DropdownMenuAll } from '../components/ui/DropdownMenuAll'
import DefaultLayout from '../layouts/DefaultLayout'
import type { Person } from '../types'

interface DropdownsPageProps {
  people?: Person[]
}

export default function DropdownsPage({ people = [] }: DropdownsPageProps) {
  return (
    <DefaultLayout pageTitle="Dropdowns">
      <div className="row">
        <div className="col-sm-6 col-lg-3">
          <DropdownMenuAll show people={people} />
        </div>
        <div className="col-sm-6 col-lg-3">
          <DropdownMenu show />
          <DropdownMenu show separated />
          <DropdownMenu show active />
          <DropdownMenu show disabled />
          <DropdownMenu show header />
          <DropdownMenu show icons header />
          <DropdownMenu show arrow />
        </div>
        <div className="col-sm-6 col-lg-3">
          <DropdownMenu show />
          <DropdownMenu show separated />
          <DropdownMenu show active />
          <DropdownMenu show disabled />
          <DropdownMenu show header />
          <DropdownMenu show icons />
          <DropdownMenu show badge />
        </div>
        <div className="col-sm-6 col-lg-3">
          <DropdownMenu show dark />
          <DropdownMenu show dark separated />
          <DropdownMenu show arrow right dark />
          <DropdownMenu show arrow right dark icons />
          <DropdownMenu show check />
          <DropdownMenu show radio />
          <DropdownMenu show people peopleData={people} />
          <DropdownMenu show flag />
        </div>
      </div>
    </DefaultLayout>
  )
}
