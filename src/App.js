import logo from "./logo.svg";
import { useEffect, useState } from "react";
import ical from "ical.js";

import { ReactComponent as Gear } from "./images/gear.svg";
import { ReactComponent as Moon } from "./images/moon.svg";

import "./App.css";
import "./fonts/fonts.css";

function App() {
  const file =
    "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/a1acd9d5-2d95-4fa4-98d5-87421f786aa3/cid-F003584BB3488402/calendar.ics";

  const [value, setValue] = useState("");
  const [events, setEvents] = useState("");
  const [admin, setAdmin] = useState(false);
  const [dark, setDark] = useState(() => {
    return JSON.parse(localStorage.getItem("theme") || true);
  });
  const [limit, setLimit] = useState(3);

  const submit = (e) => {
    // setValue(e);
    const jcalData = ical.parse(value);
    const comp = new ical.Component(jcalData);
    const vevent = comp.getAllSubcomponents("vevent");
    let tempEvents = [];
    vevent.forEach((event) => {
      tempEvents.push(new ical.Event(event));
    });
    setEvents(tempEvents);
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
      <div className="event-container">
        {events.length > 0 &&
          events.slice(0, limit).map((event) => {
            return (
              <p
                key={event.summary}
                id={event.summary}
                className="event"
                style={{
                  background: dark ? "var(--light)" : "var(--dark)",
                  color: dark ? "var(--dark)" : "var(--light)",
                }}
              >
                <p className="title">{event.summary}</p>
                <p className="date">
                  {event.startDate._time.day}/{event.startDate._time.month}/
                  {event.startDate._time.year}
                </p>
                FROM {event.startDate._time.hour}:
                {event.startDate._time.minute < 10
                  ? "0" + event.startDate._time.minute
                  : event.startDate._time.minute}
                :0{event.startDate._time.second}
                <br />
                TO {event.endDate._time.hour}:
                {event.endDate._time.minute < 10
                  ? "0" + event.endDate._time.minute
                  : event.endDate._time.minute}
                :0
                {event.endDate._time.second}
              </p>
            );
          })}
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
              }}
              onChange={(e) => setLimit(e.target.value)}
            />
          </label>
          <label>Input ICS:</label>
          <textarea
            value={value}
            style={{
              width: "80%",
              height: "300px",
              background: dark ? "var(--light)" : "var(--dark)",
              color: dark ? "var(--dark)" : "var(--light)",
            }}
            // onChange={(e) => submit(e.target.value)}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
          {/* <button type="submit" onClick={(e) => submit(e.target.value)}> */}
          <button
            type="submit"
            style={{
              background: dark ? "var(--light)" : "var(--dark)",
              color: dark ? "var(--dark)" : "var(--light)",
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
