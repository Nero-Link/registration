import logo from "./logo.svg";
import { useEffect, useState } from "react";
import ical from "ical.js";

import { ReactComponent as Gear } from "./images/gear.svg";
import { ReactComponent as Moon } from "./images/moon.svg";

import "./App.css";
import "./fonts/fonts.css";

function App() {
  const [value, setValue] = useState("");
  const [events, setEvents] = useState("");
  const [dates, setDates] = useState("");
  const [admin, setAdmin] = useState(false);
  const [uniform, setUniform] = useState(true);
  const [dark, setDark] = useState(() => {
    return JSON.parse(localStorage.getItem("theme") || true);
  });
  const [limit, setLimit] = useState(3);
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

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(dark));
  }, [dark]);
  return (
    <div
      className="App"
      style={{
        background: dark ? "var(--dark)" : "var(--light)",
        color: dark ? "var(--light)" : "var(--dark)",
      }}
    >
      <div className="dates-container">
        {dates.length > 0
          ? dates.slice(0, limit).map((date) => {
              return (
                <div
                  className="date-column"
                  style={{
                    maxWidth: uniform ? (100 / limit).toString() + "%" : "50%",
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
                            style={{
                              background: dark ? "var(--light)" : "var(--dark)",
                              color: dark ? "var(--dark)" : "var(--light)",
                              border: dark
                                ? "5px double var(--dark)"
                                : "5px double var(--light)",
                              boxShadow: dark
                                ? "1px 1px 5px var(--light)"
                                : "1px 1px 5px var(--dark)",
                            }}
                          >
                            <div className="event-topline">
                              <h4 className="event-title">{event.summary}</h4>
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
            fill: dark ? "var(--light)" : "var(--dark)",
          }}
          onClick={(e) => setAdmin(!admin)}
        />
        <Moon
          width="50px"
          height="50px"
          style={{
            fill: dark ? "var(--light)" : "var(--dark)",
          }}
          onClick={(e) => setDark(!dark)}
        />
      </div>
      {admin && (
        <div className="admin-controls">
          <label>
            Limit:
            <input
              type="number"
              value={limit}
              style={{
                background: dark ? "var(--light)" : "var(--dark)",
                color: dark ? "var(--dark)" : "var(--light)",
                border: dark
                  ? "5px double var(--dark)"
                  : "5px double var(--light)",
                boxShadow: dark
                  ? "1px 1px 5px var(--light)"
                  : "1px 1px 5px var(--dark)",
              }}
              onChange={(e) => setLimit(e.target.value)}
            />
          </label>
          <label>
            Uniform Sized Cards:
            <div className="toggle">
              <input
                type="checkbox"
                id="switch"
                value={uniform}
                defaultChecked
                onChange={(e) => setUniform(e.target.checked)}
              />
              <label
                htmlFor="switch"
                style={{
                  background: dark ? "var(--light)" : "var(--dark)",
                  border: dark
                    ? "5px double var(--dark)"
                    : "5px double var(--light)",
                  boxShadow: dark
                    ? "1px 1px 5px var(--light)"
                    : "1px 1px 5px var(--dark)",
                }}
              ></label>
            </div>
          </label>
          <label>Input ICS:</label>
          <textarea
            value={value}
            style={{
              width: "80%",
              height: "300px",
              background: dark ? "var(--light)" : "var(--dark)",
              color: dark ? "var(--dark)" : "var(--light)",
              border: dark
                ? "5px double var(--dark)"
                : "5px double var(--light)",
              boxShadow: dark
                ? "1px 1px 5px var(--light)"
                : "1px 1px 5px var(--dark)",
            }}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
          <button
            type="submit"
            style={{
              background: dark ? "var(--light)" : "var(--dark)",
              color: dark ? "var(--dark)" : "var(--light)",
              border: dark
                ? "5px double var(--dark)"
                : "5px double var(--light)",
              boxShadow: dark
                ? "1px 1px 5px var(--light)"
                : "1px 1px 5px var(--dark)",
            }}
            onClick={submit}
          >
            {" "}
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
