// src/pages/ChatPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'
import { Avatar } from '../components/ui/Avatar'
import { Chat, type ChatMessage } from '../components/ui/Chat'

import type { Person } from '../types'

interface ChatPageProps {
  people: Person[]
  chats: ChatMessage[]
}

export default function ChatPage({ people = [], chats = [] }: ChatPageProps) {
  // Use first 10 people for the sidebar
  const sidebarPeople = people.slice(0, 10)

  return (
    <BaseLayout pageTitle="Chat" containerClass="flex-fill d-flex flex-column">
      <div className="card flex-fill">
        <div className="row g-0 flex-fill">
          {/* Sidebar */}
          <div className="col-12 col-lg-5 col-xl-3 border-end d-flex flex-column">
            <div className="card-header d-none d-md-block">
              <div className="input-icon">
                <span className="input-icon-addon">
                  <Icon icon="search" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search…"
                  aria-label="Search"
                />
              </div>
            </div>
            <div className="card-body p-0 scrollable flex-fill">
              <div className="nav flex-column nav-pills" role="tablist">
                {sidebarPeople.map((person, index) => (
                  <a
                    key={person.id}
                    href={`#chat-${person.id}`}
                    className={`nav-link text-start mw-100 p-3${index === 0 ? ' active' : ''}`}
                    id={`chat-${person.id}-tab`}
                    data-bs-toggle="pill"
                    role="tab"
                    aria-selected={index === 0}
                  >
                    <div className="row align-items-center flex-fill">
                      <div className="col-auto">
                        <Avatar person={person} />
                      </div>
                      <div className="col text-body">
                        <div className="text-truncate">{person.full_name}</div>
                        <div className="text-secondary text-truncate w-100">
                          {chats.find(c => c['person-id'] === index + 1)?.message || 'No messages yet'}
                        </div>
                      </div>
                      {index === 6 && (
                        <div className="col-auto">🌴</div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-12 col-lg-7 col-xl-9 d-flex flex-column">
            <div className="card-body scrollable flex-fill">
              <Chat wide messages={chats} people={people as any} />
            </div>
            <div className="card-footer">
              <div className="input-group input-group-flat">
                <input
                  type="text"
                  className="form-control"
                  autoComplete="off"
                  placeholder="Type message"
                />
                <span className="input-group-text">
                  <a
                    href="#"
                    className="link-secondary"
                    data-bs-toggle="tooltip"
                    title="Clear search"
                  >
                    <Icon icon="mood-smile" />
                  </a>
                  <a
                    href="#"
                    className="link-secondary ms-2"
                    data-bs-toggle="tooltip"
                    title="Add notification"
                  >
                    <Icon icon="paperclip" />
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
