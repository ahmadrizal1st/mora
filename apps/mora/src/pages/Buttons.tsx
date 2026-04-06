// src/pages/Buttons.tsx
// Converted from preview/pages/buttons.html

import BaseLayout from '../layouts/BaseLayout'
import { Button } from '../components/ui/Button'
import siteData from '../data/site.json'

const themeColorEntries = Object.entries(siteData.themeColors) as [string, any][]
const colorEntries = Object.entries(siteData.colors) as [string, any][]
const socialColorEntries = Object.entries(siteData.socialColors) as [string, any][]

const actionIcons = ['edit', 'copy', 'settings', 'clipboard', 'x']

export default function Buttons() {
  return (
    <BaseLayout pageTitle="Buttons">
      <div className="row row-cards">

        {/* Standard Buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Standard Buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {themeColorEntries.map(([key, color]) => (
                  <Button
                    key={key}
                    color={color.class}
                    icon={color.icon}
                    text={color.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Outline Buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Outline Buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {themeColorEntries.map(([key, color]) => (
                  <Button
                    key={key}
                    color={color.class}
                    outline
                    icon={color.icon}
                    text={color.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ghost Buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Ghost Buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {themeColorEntries.map(([key, color]) => (
                  <Button
                    key={key}
                    color={color.class}
                    ghost
                    icon={color.icon}
                    text={color.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Square Buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Square Buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {themeColorEntries.map(([key, color]) => (
                  <Button
                    key={key}
                    color={color.class}
                    square
                    icon={color.icon}
                    text={color.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pill Buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Pill Buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {themeColorEntries.map(([key, color]) => (
                  <Button
                    key={key}
                    color={color.class}
                    pill
                    icon={color.icon}
                    text={color.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Extra colors */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Extra colors</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {colorEntries.map(([key, color]) => (
                  <Button
                    key={key}
                    color={color.class}
                    icon={color.icon}
                    text={color.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Icon buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Icon buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {socialColorEntries.map(([key, app]) => (
                  <Button
                    key={key}
                    color={key}
                    icon={app.icon}
                    iconOnly
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social colors */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Social colors</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {socialColorEntries.map(([key, app]) => (
                  <Button
                    key={key}
                    color={key}
                    icon={app.icon}
                    text={app.title}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Action buttons</h3>
            </div>
            <div className="card-body">
              <div className="btn-actions">
                {actionIcons.map(action => (
                  <Button
                    key={action}
                    action
                    icon={action}
                    iconOnly
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons with animated icons */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Buttons with icon</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                <Button className="btn-animate-icon" text="Save" iconEnd="arrow-right" />
                <Button className="btn-animate-icon btn-animate-icon-rotate" icon="plus" text="Add" />
                <Button className="btn-animate-icon btn-animate-icon-shake" icon="bell" text="Notifications" />
                <Button className="btn-animate-icon btn-animate-icon-rotate" icon="settings" text="Settings" />
                <Button className="btn-animate-icon btn-animate-icon-pulse" icon="heart" text="Love" />
                <Button className="btn-animate-icon btn-animate-icon-rotate" icon="x" text="Close" />
                <Button className="btn-animate-icon btn-animate-icon-tada" icon="check" text="Confirm" />
                <Button className="btn-animate-icon" text="Next" iconEnd="chevron-right" />
                <Button className="btn-animate-icon btn-animate-icon-move-start" icon="chevron-left" text="Previous" />
              </div>
            </div>
          </div>
        </div>

        {/* Button sizes */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Buttons size</h3>
            </div>
            <div className="card-body">
              <div className="space-y">
                {['sm', 'md', 'lg', 'xl'].map((size) => (
                  <div key={size || 'default'} className="btn-list gap-2">
                    <Button size={size as any} text="Button" />
                    <Button size={size as any} icon="star" iconOnly />
                    <Button size={size as any} icon="star" text="Button" />
                    <Button size={size as any} iconEnd="star" text="Button" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </BaseLayout>
  )
}
