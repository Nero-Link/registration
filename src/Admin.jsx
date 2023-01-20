import { useEffect, useState } from "react";
import ical from "ical.js";

import { ReactComponent as Gear } from "./images/gear.svg";

import "./App.css";
import "./fonts/fonts.css";

function Admin() {
  const [value, setValue] = useState("");
  const [events, setEvents] = useState("");
  const [dates, setDates] = useState("");
  const [admin, setAdmin] = useState(false);
  const [limit, setLimit] = useState(9);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateConstructor = (dates) => {
    const fulldate = new Date(dates.jCal[1][3][3]);
    const date = fulldate.getDate();
    const day = days[fulldate.getDay()];
    const month = months[fulldate.getMonth()];
    return `${day} ${date} ${month}`;
  };

  const submit = () => {
    setAdmin(false);
    const jcalData = ical.parse(value);
    const comp = new ical.Component(jcalData);
    const vevent = comp.getAllSubcomponents("vevent");
    let tempEvents = [];
    let tempDates = [];

    vevent.forEach((event) => {
      tempEvents.push(new ical.Event(event));
      tempDates.push(dateConstructor(event));
    });
    setEvents(tempEvents);
    setDates([...new Set(tempDates)]);
  };
  return (
    <div className="App">
      <div
        className="dates-container"
        style={{
          gridTemplateColumns: dates.length === 0 && "100%",
          gridTemplateRows:
            dates.length > 6 && limit > 6
              ? "minmax(16.25%, 20%) minmax(16.25%, 20%) minmax(16.25%, 20%) minmax(16.25%, 20%)"
              : dates.length > 3 && (dates.length < 7 || limit > 3)
              ? "26.25% 26.25% 26.25% 26.25%"
              : "auto",
        }}
      >
        {dates.length > 0
          ? dates.slice(0, limit).map((date, index) => {
              return (
                <div
                  key={index}
                  className="date-column"
                  style={{
                    gridRow:
                      index < 3
                        ? "1"
                        : index > 2 && index < 6
                        ? "2"
                        : index > 5 && index < 9
                        ? "3"
                        : "4",
                    gridColumn:
                      index === 0 || index === 3 || index === 6 || index === 9
                        ? "1"
                        : index === 1 ||
                          index === 4 ||
                          index === 7 ||
                          index === 10
                        ? "2"
                        : index === 2 ||
                          index === 5 ||
                          index === 8 ||
                          index === 12
                        ? "3"
                        : null,
                    gridRowEnd:
                      events.filter((event) => {
                        return dateConstructor(event.component) === date;
                      }).length > 1
                        ? index < 3
                          ? "2"
                          : index > 2 && index < 6
                          ? "3"
                          : "auto"
                        : "auto",
                    marginTop:
                      index > 2 && index < 6
                        ? events.filter((event) => {
                            return (
                              dateConstructor(event.component) ===
                              dates[index - 3]
                            );
                          }).length > 1 &&
                          21.5 *
                            (events.filter((event) => {
                              return (
                                dateConstructor(event.component) ===
                                dates[index - 3]
                              );
                            }).length -
                              1) +
                            "%"
                        : index > 5 && index < 9
                        ? (events.filter((event) => {
                            return (
                              dateConstructor(event.component) ===
                              dates[index - 3]
                            );
                          }).length > 1 ||
                            events.filter((event) => {
                              return (
                                dateConstructor(event.component) ===
                                dates[index - 6]
                              );
                            }).length > 1) &&
                          21.5 *
                            (events.filter((event) => {
                              return (
                                dateConstructor(event.component) ===
                                dates[index - 3]
                              );
                            }).length -
                              1 +
                              events.filter((event) => {
                                return (
                                  dateConstructor(event.component) ===
                                  dates[index - 6]
                                );
                              }).length -
                              1) +
                            "%"
                        : index > 8 && index < 12
                        ? (events.filter((event) => {
                            return (
                              dateConstructor(event.component) ===
                              dates[index - 3]
                            );
                          }).length > 1 ||
                            events.filter((event) => {
                              return (
                                dateConstructor(event.component) ===
                                dates[index - 6]
                              );
                            }).length > 1 ||
                            events.filter((event) => {
                              return (
                                dateConstructor(event.component) ===
                                dates[index - 9]
                              );
                            }).length > 1) &&
                          21.5 *
                            (events.filter((event) => {
                              return (
                                dateConstructor(event.component) ===
                                dates[index - 3]
                              );
                            }).length -
                              1 +
                              events.filter((event) => {
                                return (
                                  dateConstructor(event.component) ===
                                  dates[index - 6]
                                );
                              }).length -
                              1 +
                              events.filter((event) => {
                                return (
                                  dateConstructor(event.component) ===
                                  dates[index - 9]
                                );
                              }).length -
                              1) +
                            "%"
                        : "0%",
                  }}
                >
                  <h3 className="date-title">{date}</h3>
                  <div className="event-container">
                    {events.length > 0 &&
                      events.map((event) => {
                        return dateConstructor(event.component) === date ? (
                          <div
                            key={event.summary}
                            id={event.summary}
                            className="event"
                          >
                            <div className="event-topline">
                              <h4 className="event-title">
                                {event.summary.length > 33
                                  ? event.summary.substring(0, 33) + "..."
                                  : event.summary}
                              </h4>{" "}
                              <h4 className="event-time">
                                {event.startDate._time.hour > 12
                                  ? event.startDate._time.hour - 12
                                  : event.startDate._time.hour}
                                {event.startDate._time.minute > 0 &&
                                  ":" + event.startDate._time.minute}
                                {event.startDate._time.hour < 12 ? "AM" : "PM"}
                              </h4>
                            </div>
                            <p className="event-location">{event.location}</p>
                          </div>
                        ) : null;
                      })}
                  </div>
                </div>
              );
            })
          : "No events found"}
      </div>
      <div className="admin">
        <Gear
          width="50px"
          height="50px"
          style={{
            fill: "var(--dark)",
          }}
          onClick={(e) => setAdmin(!admin)}
        />
      </div>
      {admin && (
        <div className="admin-controls">
          <label>
            Max # of Days:
            <input
              type="number"
              max="9"
              min="1"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </label>
          <label>Input ICS:</label>
          <textarea
            value={value}
            style={{
              width: "80%",
              height: "300px",
            }}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
          <button type="submit" onClick={submit}>
            {" "}
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;
