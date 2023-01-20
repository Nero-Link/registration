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
  const tick = 5000;
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

  useEffect(
    () => async () => {
      const response = await getSettings();
      if (response) {
        setValue(response[0].admin.ics);
        setLimit(response[0].admin.limit);
        setTimeout(response[0].admin.timeout);
      }
      if (value && limit && timeout) load();
    },
    [refresh]
  );

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
        {dates.length > 0 ? (
          dates.slice(0, limit).map((date, index) => {
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
        ) : (
          <>
            No events found{" "}
            <button
              type="submit"
              style={{ width: "400px", margin: "0px auto" }}
              onClick={load}
            >
              {" "}
              Load Calendar
            </button>
          </>
        )}
      </div>
      <span id="message" dangerouslySetInnerHTML={{ __html: message }}></span>
    </div>
  );
}

export default Calendar;
