// src/pages/FullcalendarPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Calendar } from '../components/ui'
import { type EventInput } from '@fullcalendar/core'

export default function FullcalendarPage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const events: EventInput[] = [
    {
      title: "Offsite Retreat",
      start: new Date(currentYear, currentMonth, 2, 9, 0),
      end: new Date(currentYear, currentMonth, 4, 17, 0),
      color: 'var(--tblr-red)',
      backgroundColor: 'var(--tblr-red-lt)',
      borderColor: 'var(--tblr-red-200)',
    },
    {
      title: "Monthly Planning",
      start: new Date(currentYear, currentMonth, 1, 10, 0),
      end: new Date(currentYear, currentMonth, 1, 11, 30),
    },
    {
      title: "Marketing Strategy Call",
      start: new Date(currentYear, currentMonth, 4, 14, 0),
      end: new Date(currentYear, currentMonth, 4, 15, 0)
    },
    {
      title: "Design Sprint",
      start: new Date(currentYear, currentMonth, 7, 9, 0),
      end: new Date(currentYear, currentMonth, 7, 12, 0)
    },
    {
      title: "Dev Team Check-in",
      start: new Date(currentYear, currentMonth, 10, 11, 0),
      end: new Date(currentYear, currentMonth, 10, 11, 30)
    },
    {
      title: "Customer Feedback Review",
      start: new Date(currentYear, currentMonth, 13, 13, 0),
      end: new Date(currentYear, currentMonth, 13, 14, 0)
    },
    {
      title: "Mid-Month Review",
      start: new Date(currentYear, currentMonth, 15, 10, 30),
      end: new Date(currentYear, currentMonth, 15, 11, 30)
    },
    {
      title: "Webinar: Product Update",
      start: new Date(currentYear, currentMonth, 18, 16, 0),
      end: new Date(currentYear, currentMonth, 18, 17, 0)
    },
    {
      title: "Sales Training",
      start: new Date(currentYear, currentMonth, 21, 9, 30),
      end: new Date(currentYear, currentMonth, 21, 11, 0)
    },
    {
      title: "Company All-Hands",
      start: new Date(currentYear, currentMonth, 25, 15, 0),
      end: new Date(currentYear, currentMonth, 25, 16, 0)
    },
    {
      title: "End-of-Month Wrap-up",
      start: new Date(currentYear, currentMonth, 31, 10, 0),
      end: new Date(currentYear, currentMonth, 31, 11, 0)
    }
  ]

  return (
    <BaseLayout pageTitle="Fullcalendar">
      <div className="card">
        <div className="card-body">
          <Calendar events={events} />
        </div>
      </div>
    </BaseLayout>
  )
}
