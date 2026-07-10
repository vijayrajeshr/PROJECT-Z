// CalendarComponent.js
import React, { useState } from "react";
import styles from "./OrderOnlineFieldComponent.module.css";

const CalendarComponent = ({ selectedDates, setSelectedDates }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDateClasses = (date) => {
    if (!date) return styles.emptyDay;
    let classes = [styles.day];
    if (isDateDisabled(date)) {
      classes.push(styles.disabledDay);
    } else {
      classes.push(styles.validDay);
      if (isDateSelected(date)) {
        classes.push(styles.selectedDay);
        if (date.getTime() === selectedDates[0]?.getTime()) {
          classes.push(styles.firstSelected);
        }
        if (date.getTime() === selectedDates[selectedDates.length - 1]?.getTime()) {
          classes.push(styles.lastSelected);
        }
      }
      if (isToday(date)) {
        classes.push(styles.today);
      }
    }
    return classes.join(" ");
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    setSelectedDates((prev) => {
      const dateExists = prev.some((d) => d.toDateString() === date.toDateString());
      return dateExists
        ? prev.filter((d) => d.toDateString() !== date.toDateString())
        : [...prev, date].sort((a, b) => a - b);
    });
  };

  const isDateSelected = (date) => {
    return selectedDates.some((d) => d.toDateString() === date.toDateString());
  };

  const isDateDisabled = (date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className={styles.calendarContainer}>
      <div style={{ width: "20vw" }}>
        <div className={styles.calendarHeader}>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className={styles.calendarButton}
          >
            ←
          </button>
          <span className={styles.monthYear}>
            {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className={styles.calendarButton}
          >
            →
          </button>
        </div>
        <div className={styles.calendar}>
          <div className={styles.weekDays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <div key={`${day}-${index}`} className={styles.weekDay}>{day}</div>
            ))}
          </div>
          <div className={styles.days}>
            {getDaysInMonth(currentMonth).map((date, index) => (
              <div
                key={index}
                className={getDateClasses(date)}
                onClick={() => !isDateDisabled(date) && handleDateSelect(date)}
              >
                {date?.getDate()}
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedDates.length > 0 && (
        <div className={styles.selectedDatesDisplay}>
          <h4>Selected Dates ({selectedDates.length})</h4>
          <div className={styles.datesList}>
            {selectedDates.map((date) => (
              <div key={date.toISOString()} className={styles.dateTag}>
                {formatDate(date)}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateSelect(date);
                  }}
                  className={styles.removeDate}
                  aria-label="Remove date"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
