import { useEffect, useState } from "react";
import ical from "ical.js";
import { getSettings } from "./firebase.utils";

import "./App.css";
import "./fonts/fonts.css";

function Calendar() {
  const [value, setValue] = useState("");
  const [limit, setLimit] = useState(9);
  const [timeout, setTimeout] = useState(1);
  const [events, setEvents] = useState("");
  const [dates, setDates] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  let tick = 60000;
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
    let finalDate = "";
    dates.jCal[1].map((date) => {
      if (date[0] === "dtstart") {
        const fulldate = new Date(date[3]);
        const dateNumber = fulldate.getDate();
        const day = days[fulldate.getDay()];
        const month = months[fulldate.getMonth()];
        if (fulldate > new Date()) finalDate = `${day} ${dateNumber} ${month}`;
      }
    });
    return finalDate;
  };

  const load = () => {
    if (value && limit && timeout) {
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
      setMessage(
        `Loaded @ ${
          new Date().getHours() < 10
            ? "0" + new Date().getHours()
            : new Date().getHours()
        }:${
          new Date().getMinutes() < 10
            ? "0" + new Date().getMinutes()
            : new Date().getMinutes()
        } on  ${new Date().getDate()}/${new Date().getMonth() + 1}/${
          new Date().getYear() + 1900
        }`
      );
    }
  };

  const getAdminSettings = async () => {
    try {
      const response = await getSettings();
      if (response) {
        if (value !== response[0].admin.ics) setValue(response[0].admin.ics);
        if (limit !== response[0].admin.limit)
          setLimit(response[0].admin.limit);
        if (timeout !== response[0].admin.timeout)
          setTimeout(response[0].admin.timeout);
        setLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminSettings();
  }, [refresh]);

  useEffect(() => {
    if (loaded) load();
  }, [loaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, tick);
    return () => clearInterval(interval);
  }, []);

  if (timer > timeout) {
    setRefresh(refresh + 1);
    setTimer(0);
    load();
  }

  return (
    <div className="App">
      <h2>Upcoming Events</h2>
      <div
        className="dates-container"
        style={{ justifyContent: dates.length === 0 && "center" }}
      >
        {dates.length > 0 ? (
          dates.slice(0, limit).map((date, index) => {
            return (
              <div key={index} className="date-column">
                <h3 className="date-title">{date}</h3>
                <div className="event-container">
                  {events.length > 0 &&
                    events.map((event, index) => {
                      // if (
                      //   index === 0 ||
                      //   event.summary !== events[index - 1].summary
                      // )
                      return dateConstructor(event.component) === date &&
                        date !== "" ? (
                        <div
                          key={
                            event.summary +
                            ": " +
                            event.startDate._time.hour +
                            ":" +
                            event.startDate._time.minute
                          }
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
                                : event.startDate._time.hour === 0
                                ? ""
                                : event.startDate._time.hour}
                              {event.startDate._time.minute > 0 &&
                                ":" + event.startDate._time.minute}
                              {event.startDate._time.hour < 13 &&
                              event.startDate._time.hour > 0
                                ? "AM"
                                : event.startDate._time.hour > 12
                                ? "PM"
                                : "All Day"}
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
        ) : (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <span id="message" dangerouslySetInnerHTML={{ __html: message }}></span>
    </div>
  );
}

export default Calendar;
