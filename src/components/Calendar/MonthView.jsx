import { useState } from 'react'
import { Button } from '../shared/Button'
import { CalendarDay } from './CalendarDay'
import {
  getMonthDays,
  formatMonthYear,
  addMonths,
  subMonths,
} from '../../utils/dates'
import './MonthView.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MonthView({ content, onCardClick, onAddClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const days = getMonthDays(currentDate)

  const goToPrevMonth = () => setCurrentDate((d) => subMonths(d, 1))
  const goToNextMonth = () => setCurrentDate((d) => addMonths(d, 1))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="month-view">
      <div className="month-header">
        <div className="month-nav">
          <Button variant="ghost" size="sm" onClick={goToPrevMonth}>
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
          <h2 className="month-title">{formatMonthYear(currentDate)}</h2>
          <Button variant="ghost" size="sm" onClick={goToNextMonth}>
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
        <div className="month-actions">
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
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

      <div className="month-legend">
        <div className="month-legend-item">
          <span className="month-legend-dot shoot" />
          <span>Shoot Day</span>
        </div>
        <div className="month-legend-item">
          <span className="month-legend-dot release" />
          <span>Release Day</span>
        </div>
      </div>

      <div className="month-grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="month-weekday">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            currentMonth={currentDate}
            items={content}
            onCardClick={onCardClick}
            onDayClick={() => {}}
          />
        ))}
      </div>
    </div>
  )
}
