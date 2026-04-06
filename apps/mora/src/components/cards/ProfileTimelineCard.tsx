import { useState } from 'react';

interface TimelineComment {
  name: string;
  avatarSrc?: string;
  text: string;
  time?: string;
  replies?: { name: string; avatarSrc?: string; text: string }[];
}

interface ProfileTimelineCardProps {
  threads?: TimelineComment[];
}

export function ProfileTimelineCard({
  threads = [
    {
      name: 'Alice Smith', time: '4 min',
      text: 'Aenean lacinia bibendum nulla sed consectetur. Vestibulum id ligula porta felis euismod semper.',
      replies: [
        { name: 'Bob Jones', text: 'Donec id elit non mi porta gravida at eget metus.' },
        { name: 'Carol White', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      ]
    },
    {
      name: 'Dave Brown', time: '12 min',
      text: 'Donec id elit non mi porta gravida at eget metus. Integer posuere erat a ante venenatis.',
    },
    {
      name: 'Eve Taylor', time: '34 min',
      text: 'Donec ullamcorper nulla non metus auctor fringilla.',
      replies: [{ name: 'Frank Lee', text: 'Donec id elit non mi porta gravida at eget metus.' }]
    },
  ],
}: ProfileTimelineCardProps) {
  const [message, setMessage] = useState('');
  return (
    <div className="card">
      <div className="card-header">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Message"
            value={message} onChange={e => setMessage(e.target.value)} />
          <button className="btn btn-icon"><svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 8h.01m-6.01 0h.01m2.99 9v-3.5a3.5 3.5 0 0 1 7 0v3.5m-7 -9.5h14" /></svg></button>
        </div>
      </div>
      <ul className="list-group card-list-group">
        {threads.map((t, i) => (
          <li key={i} className="list-group-item py-4">
            <div className="d-flex">
              <span className="avatar me-3">{t.avatarSrc ? <img src={t.avatarSrc} alt={t.name} /> : t.name.charAt(0)}</span>
              <div className="flex-fill">
                <div>
                  {t.time && <small className="float-end text-secondary">{t.time}</small>}
                  <h4>{t.name}</h4>
                </div>
                <div>{t.text}</div>
                {t.replies && (
                  <ul className="list-unstyled">
                    {t.replies.map((r, j) => (
                      <li key={j} className="d-flex mt-4">
                        <span className="avatar me-3">{r.avatarSrc ? <img src={r.avatarSrc} alt={r.name} /> : r.name.charAt(0)}</span>
                        <div className="flex-fill">
                          <strong>{r.name}: </strong>{r.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
