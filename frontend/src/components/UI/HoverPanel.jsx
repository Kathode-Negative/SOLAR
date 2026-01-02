import React from "react";




const HoverPanel =() => {






    <div className="booking-panel roboto-bold">
        <label>Wählen Sie Ihr Reisedatum:</label>
        <div className="datepicker-container">
          <FaCalendarAlt className="calendar-icon" />
          <DatePicker
            selected={travelDate}
            onChange={(date) => setTravelDate(date)}
            dateFormat="dd/MM/yyyy"
            className="datepicker"
          />
        </div>
      </div>
}