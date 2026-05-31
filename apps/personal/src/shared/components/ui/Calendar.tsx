import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { type EventInput } from '@fullcalendar/core'

export interface CalendarProps {
  events?: EventInput[]
  initialView?: string
  height?: string | number
  aspectRatio?: number
}

export function Calendar({
  events = [],
  initialView = 'dayGridMonth',
  height = 'auto',
  aspectRatio = 1.35,
}: CalendarProps) {
  return (
    <>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView={initialView}
        events={events}
        height={height}
        aspectRatio={aspectRatio}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
        }}
      />
    </>
  )
}
