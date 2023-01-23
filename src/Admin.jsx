import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "./firebase.utils";

import "./App.css";
import "./fonts/fonts.css";

function Admin() {
  const [value, setValue] = useState();
  const [limit, setLimit] = useState();
  const [timeout, setTimeout] = useState();
  const [message, setMessage] = useState("");

  const SETTINGS_DATA = [
    {
      admin: {
        ics: value,
        limit: limit,
        timeout: timeout,
      },
    },
  ];

  const submit = async () => {
    if (value.length > 0 && limit > 0)
      await updateSettings(SETTINGS_DATA).then(
        setMessage(
          `Saved to DB @ ${
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
        )
      );
  };

  const getAdminSettings = async () => {
    try {
      const response = await getSettings();
      if (response) {
        setValue(response[0].admin.ics);
        setLimit(response[0].admin.limit);
        setTimeout(response[0].admin.timeout);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminSettings();
  }, []);

  return (
    <div className="App">
      <div className="admin-controls">
        <div style={{ display: "flex" }}>
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
          <label>
            Refresh in mins:
            <input
              type="number"
              max="60"
              min="1"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
            />
          </label>
        </div>
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
        <span id="message" dangerouslySetInnerHTML={{ __html: message }}></span>
      </div>
    </div>
  );
}

export default Admin;
