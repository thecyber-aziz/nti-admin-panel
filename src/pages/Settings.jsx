import {
  Building2,
  Clock3,
  CalendarDays,
  ShieldCheck,
  Save
} from "lucide-react";

import { useState } from "react";

export default function Settings() {
  const [
    companyName,
    setCompanyName
  ] = useState(
    "New Taj Industries"
  );

  const [
    workingStart,
    setWorkingStart
  ] = useState("09:00");

  const [
    workingEnd,
    setWorkingEnd
  ] = useState("18:00");

  const [
    workingDays,
    setWorkingDays
  ] = useState(26);

  const [
    normalHours,
    setNormalHours
  ] = useState(8);

  const [
    overtimeRate,
    setOvertimeRate
  ] = useState(1);

  const handleSave = (
    event
  ) => {
    event.preventDefault();

    localStorage.setItem(
      "nti_settings",
      JSON.stringify({
        companyName,
        workingStart,
        workingEnd,
        workingDays,
        normalHours,
        overtimeRate
      })
    );

    alert(
      "Settings saved successfully."
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>
            Settings
          </h2>

          <p>
            Configure company and salary
            calculation settings.
          </p>
        </div>
      </div>

      <form
        className="settings-grid"
        onSubmit={handleSave}
      >
        <div className="panel">
          <div className="panel-header">
            <div className="settings-title">
              <div className="settings-icon">
                <Building2
                  size={20}
                />
              </div>

              <div>
                <h3>
                  Company Settings
                </h3>

                <p>
                  Basic company information
                </p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              Company Name
            </label>

            <input
              value={companyName}
              onChange={(event) =>
                setCompanyName(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="settings-title">
              <div className="settings-icon">
                <Clock3
                  size={20}
                />
              </div>

              <div>
                <h3>
                  Working Hours
                </h3>

                <p>
                  Configure daily shift
                </p>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                Shift Start
              </label>

              <input
                type="time"
                value={workingStart}
                onChange={(event) =>
                  setWorkingStart(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Shift End
              </label>

              <input
                type="time"
                value={workingEnd}
                onChange={(event) =>
                  setWorkingEnd(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Normal Hours / Day
              </label>

              <input
                type="number"
                min="1"
                value={normalHours}
                onChange={(event) =>
                  setNormalHours(
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="settings-title">
              <div className="settings-icon">
                <CalendarDays
                  size={20}
                />
              </div>

              <div>
                <h3>
                  Salary Settings
                </h3>

                <p>
                  Configure salary calculation
                </p>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                Working Days / Month
              </label>

              <input
                type="number"
                min="1"
                value={workingDays}
                onChange={(event) =>
                  setWorkingDays(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Overtime Rate
              </label>

              <select
                value={overtimeRate}
                onChange={(event) =>
                  setOvertimeRate(
                    event.target.value
                  )
                }
              >
                <option value="1">
                  1x Normal Hourly Rate
                </option>

                <option value="1.5">
                  1.5x Normal Hourly Rate
                </option>

                <option value="2">
                  2x Normal Hourly Rate
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="settings-title">
              <div className="settings-icon">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>
                <h3>
                  Admin Access
                </h3>

                <p>
                  Current administrator
                </p>
              </div>
            </div>
          </div>

          <div className="admin-access-box">
            <strong>
              Single Admin
            </strong>

            <span>
              admin@newtajindustries.com
            </span>

            <small>
              Backend authentication can
              be connected later with
              Express.js and MongoDB.
            </small>
          </div>
        </div>

        <div className="settings-save-row">
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}