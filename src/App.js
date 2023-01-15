import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import ical from "ical.js";

function App() {
  const file =
    "https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/a1acd9d5-2d95-4fa4-98d5-87421f786aa3/cid-F003584BB3488402/calendar.ics";

  const [value, setValue] = useState("");
  const [events, setEvents] = useState("");
  const submit = () => {
    const jcalData = ical.parse(value);
    const comp = new ical.Component(jcalData);
    const vevent = comp.getAllSubcomponents("vevent");
    let tempEvents = [];
    vevent.forEach((event) => {
      tempEvents.push(new ical.Event(event));
    });
    console.log(tempEvents);
    setEvents(tempEvents);
    tempEvents.forEach((event) => {
      document.querySelector(
        `#${event.summary}`
      ).innerHTML = `${event.summary}`;
    });
  };
  return (
    <div className="App">
      <header className="App-header">
        <textarea
          style={{ width: "80%", height: "500px" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
        <button type="submit" onClick={submit}>
          {" "}
          Submit
        </button>
        {events.length > 0 &&
          events.map((event) => {
            return (
              <p key={event.summary} id={event.summary}>
                {event.summary}: FROM {event.startDate._time.hour}:
                {event.startDate._time.minute}:{event.startDate._time.second} on{" "}
                {event.startDate._time.day}/{event.startDate._time.month}/
                {event.startDate._time.year} TO {event.endDate._time.hour}:
                {event.endDate._time.minute}:{event.endDate._time.second} on{" "}
                {event.endDate._time.day}/{event.endDate._time.month}/
                {event.endDate._time.year}
              </p>
            );
          })}
      </header>
    </div>
  );
}

export default App;
