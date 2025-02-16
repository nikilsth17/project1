import React, { useState } from 'react';
import DatePicker from 'react-flatpickr';

const DatePiickers = ({ bsDate }) => {
  const [selectedDate, setSelectedDate] = useState(bsDate);

  const handleDateChange = (selectedDates) => {
    setSelectedDate(selectedDates[0]);
  };

  return (
    <div>
      <DatePicker
        className='form-control'
        value={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd"
      />
    </div>
  );
};

export default DatePiickers;