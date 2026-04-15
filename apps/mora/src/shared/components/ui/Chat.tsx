import { clsx } from 'clsx'
import { Avatar } from './Avatar'

export interface ChatPerson {
  id: number | string
  full_name: string
  photo?: string
  avatar?: string
}

export interface ChatMessage {
  personId: number | string
  message?: string
  timestamp?: string
  loading?: boolean
  gif?: string
  // Compatibility
  'person-id'?: number | string
}

export interface ChatProps {
  messages: ChatMessage[]
  people: ChatPerson[]
  wide?: boolean
  className?: string
}

export function Chat({
  messages = [],
  people = [],
  wide,
  className,
}: ChatProps) {
  const getPerson = (id: number | string): ChatPerson =>
    people.find(p => p.id === id) ?? { id, full_name: 'Unknown' }

  return (
    <div className={clsx('chat', className)}>
      <div className="chat-bubbles">
        {messages.map((msg, i) => {
          const personId = msg.personId ?? msg['person-id'] ?? 0
          const person = getPerson(personId)
          const isMe = personId === 0 || personId === 'me'

          const avatarEl = (
            <div className="col-auto">
              <Avatar person={person} size="sm" />
            </div>
          )

          const messageEl = (
            <div className={clsx(msg.loading ? 'col-auto' : 'col', !msg.loading && wide && 'col-lg-6')}>
              <div className={clsx('chat-bubble', isMe && 'chat-bubble-me')}>
                {!msg.loading && (
                  <div className="chat-bubble-title">
                    <div className="row">
                      <div className="col chat-bubble-author">{person.full_name}</div>
                      {msg.timestamp && (
                        <div className="col-auto chat-bubble-date">{msg.timestamp}</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="chat-bubble-body">
                  {msg.loading ? (
                    <p className="text-secondary text-italic">
                      typing<span className="animated-dots" />
                    </p>
                  ) : (
                    <p>{msg.message}</p>
                  )}
                  {msg.gif && (
                    <div className="mt-2">
                      <img src={msg.gif} alt="" className="rounded img-fluid" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )

          return (
            <div key={i} className="chat-item">
              <div className={clsx('row align-items-end', isMe && 'justify-content-end')}>
                {isMe ? (
                  <>
                    {messageEl}
                    {avatarEl}
                  </>
                ) : (
                  <>
                    {avatarEl}
                    {messageEl}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
