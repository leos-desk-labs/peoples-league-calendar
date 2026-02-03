import { isToday, isSameMonth } from '../../utils/dates'
import { ContentCard } from '../Content/ContentCard'
import './CalendarDay.css'

export function CalendarDay({ date, currentMonth, items, onCardClick, onDayClick }) {
  const today = isToday(date)
  const inMonth = isSameMonth(date, currentMonth)

  const shootItems = items.filter((item) => item.shootDate === date.toISOString().split('T')[0])
  const releaseItems = items.filter((item) => item.releaseDate === date.toISOString().split('T')[0])

  return (
    <div
      className={`calendar-day ${!inMonth ? 'outside' : ''} ${today ? 'today' : ''}`}
      onClick={() => onDayClick(date)}
    >
      <div className="calendar-day-header">
        <span className="calendar-day-number">{date.getDate()}</span>
        {(shootItems.length > 0 || releaseItems.length > 0) && (
          <div className="calendar-day-dots">
            {shootItems.length > 0 && <span className="calendar-dot shoot" />}
            {releaseItems.length > 0 && <span className="calendar-dot release" />}
          </div>
        )}
      </div>
      <div className="calendar-day-content">
        {shootItems.map((item) => (
          <div
            key={`shoot-${item.id}`}
            className="calendar-event shoot"
            onClick={(e) => {
              e.stopPropagation()
              onCardClick(item)
            }}
          >
            <span className="calendar-event-label">Shoot:</span>
            <span className="calendar-event-title">{item.title}</span>
          </div>
        ))}
        {releaseItems.map((item) => (
          <div
            key={`release-${item.id}`}
            className="calendar-event release"
            onClick={(e) => {
              e.stopPropagation()
              onCardClick(item)
            }}
          >
            <span className="calendar-event-label">Release:</span>
            <span className="calendar-event-title">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
