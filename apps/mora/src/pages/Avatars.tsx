import { Avatar } from '../components/ui/Avatar'
import { AvatarUpload } from '../components/ui/AvatarUpload'
import siteData from '../data/site.json'
import DefaultLayout from '../layouts/DefaultLayout'

const colorEntries = Object.entries(siteData.colors) as [string, any][]

import type { Person } from '../types'

interface AvatarsProps {
  people?: Person[]
}

// Mirrors Liquid's `first_letters` filter — get initials from full name
const firstLetters = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

const iconIcons = ['user', 'settings', 'car', 'balloon', 'users', 'users-group', 'apps', 'ghost']
const avatarSizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const avatarListSizes = ['xxs', 'xs', 'sm', 'md', 'lg'] as const
const uploadSizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
const statusColors = ['red', 'green', 'blue', 'yellow', 'secondary']
const brands = ['netflix', 'amazon', 'messenger', 'figma', 'twitch']

export default function Avatars({ people = [] }: AvatarsProps) {
  return (
    <DefaultLayout pageTitle="Avatars">
      <div className="row row-cards">
        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Default avatar</h2>
              <Avatar />
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar with icon</h2>
              <div className="avatar-list gap-2">
                {iconIcons.map(icon => (
                  <Avatar key={icon} icon={icon} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar with icon</h2>
              <div className="avatar-list gap-2">
                {colorEntries.map(([key]) => (
                  <Avatar key={key} icon="user" color={key} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Simple avatar</h2>
              <div className="avatar-list gap-2">
                {people.slice(0, 8).map((person, i) => (
                  <Avatar key={i} person={person} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar placeholder</h2>
              <div className="avatar-list gap-2">
                {people.slice(0, 8).map((person, i) => (
                  <Avatar key={i} placeholder={firstLetters(person.full_name || '')} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar shapes</h2>
              <div className="avatar-list gap-2">
                <Avatar />
                <Avatar className="rounded-circle" />
                <Avatar className="rounded-0" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar sizes</h2>
              <div className="row">
                <div className="col-6">
                  <div className="avatar-list gap-2">
                    {avatarSizes.map(size => (
                      <Avatar key={size} size={size} />
                    ))}
                  </div>
                </div>
                <div className="col-6">
                  <div className="avatar-list gap-2">
                    {avatarSizes.map(size => (
                      <Avatar key={size} placeholder="PK" size={size} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar lists</h2>
              <div className="row g-3">
                {avatarListSizes.map(size => (
                  <React.Fragment key={size}>
                    <div className="col-6">
                      <div className={`avatar-list avatar-list-stacked avatar-list-${size}`}>
                        {people.slice(0, 5).map((person, i) => (
                          <Avatar key={i} person={person} />
                        ))}
                        <Avatar icon="plus" link />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`avatar-list avatar-list-stacked avatar-list-${size}`}>
                        {people.slice(0, 5).map((person, i) => (
                          <Avatar key={i} person={person} className="rounded-circle" />
                        ))}
                        <Avatar icon="plus" link className="rounded-circle" />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar placeholder</h2>
              <div className="avatar-list gap-1">
                {uploadSizes.map(size => (
                  <AvatarUpload key={size} size={size} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar statuses</h2>
              <div className="avatar-list gap-2">
                {statusColors.map((color, i) => (
                  <Avatar
                    key={color}
                    personId={i + 1}
                    people={people}
                    className="rounded-circle"
                    status={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Avatar brands</h2>
              <div className="avatar-list gap-2">
                {brands.map((brand, i) => (
                  <Avatar key={brand} personId={i + 1} people={people} brand={brand} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

import React from 'react'
