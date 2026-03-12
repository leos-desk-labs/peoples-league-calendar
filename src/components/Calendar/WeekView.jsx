import { useState } from 'react'
import { Button } from '../shared/Button'
import { ContentCard } from '../Content/ContentCard'
import {
  getWeekDays,
  formatMonthYear,
  formatDayOfWeek,
  formatDayNumber,
  isToday,
  addDays,
} from '../../utils/dates'
import './WeekView.css'

export function WeekView({ content, onCardClick, onAddClick }) {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date()
    const day = today.getDay()
    return addDays(today, -day)
  })

  const days = getWeekDays(weekStart)

  const goToPrevWeek = () => setWeekStart((d) => addDays(d, -7))
  const goToNextWeek = () => setWeekStart((d) => addDays(d, 7))
  const goToThisWeek = () => {
    const today = new Date()
    const day = today.getDay()
    setWeekStart(addDays(today, -day))
  }

  const getItemsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    const shootItems = content.filter((item) => item.shootDate === dateStr)
    const releaseItems = content.filter((item) => item.releaseDate === dateStr)
    return { shootItems, releaseItems }
  }

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="week-nav">
          <Button variant="ghost" size="sm" onClick={goToPrevWeek}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4L6 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <h2 className="week-title">{formatMonthYear(weekStart)}</h2>
          <Button variant="ghost" size="sm" onClick={goToNextWeek}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
        <div className="week-actions">
          <Button variant="ghost" size="sm" onClick={goToThisWeek}>
            This Week
          </Button>
          <Button variant="primary" onClick={onAddClick}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Add Content
          </Button>
        </div>
      </div>

      <div className="week-grid">
        {days.map((day) => {
          const { shootItems, releaseItems } = getItemsForDay(day)
          const today = isToday(day)

          return (
            <div key={day.toISOString()} className={`week-day ${today ? 'today' : ''}`}>
              <div className="week-day-header">
                <span className="week-day-name">{formatDayOfWeek(day)}</span>
                <span className={`week-day-number ${today ? 'today' : ''}`}>
                  {formatDayNumber(day)}
                </span>
              </div>
              <div className="week-day-content">
                {shootItems.length > 0 && (
                  <div className="week-section">
                    <h4 className="week-section-title shoot">Shoots</h4>
                    {shootItems.map((item) => (
                      <ContentCard
                        key={item.id}
                        content={item}
                        onClick={() => onCardClick(item)}
                        compact
                      />
                    ))}
                  </div>
                )}
                {releaseItems.length > 0 && (
                  <div className="week-section">
                    <h4 className="week-section-title release">Releases</h4>
                    {releaseItems.map((item) => (
                      <ContentCard
                        key={item.id}
                        content={item}
                        onClick={() => onCardClick(item)}
                        compact
                      />
                    ))}
                  </div>
                )}
                {shootItems.length === 0 && releaseItems.length === 0 && (
                  <div className="week-empty">No content</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
