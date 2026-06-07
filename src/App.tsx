import { Fragment, useEffect, useState } from "react";
import "./App.css";

type Job = {
  id: string;
  machine: string;
  day: string;
  start: string;
  end: string;
  item: string;
  qty: number;
  customer?: string;
  dueDate?: string;
  notes?: string;
};

type JobDraft = {
  id: string;
  machine: string;
  day: string;
  start: string;
  end: string;
  item: string;
  qty: string;
  customer: string;
  dueDate: string;
  notes: string;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const machines = ["Perf 1", "Perf 2", "Saw", "QC / Packing"];

const initialJobs: Job[] = [
  {
    id: "MO123456",
    machine: "Perf 1",
    day: "Monday",
    start: "08:00",
    end: "11:00",
    item: '24" HDPE Perf Pipe',
    qty: 6,
    customer: "Example Customer A",
    dueDate: "2026-06-12",
    notes: "Pattern C, 4 rows, 1/2 stagger",
  },
  {
    id: "MO123457",
    machine: "Perf 2",
    day: "Tuesday",
    start: "09:00",
    end: "13:00",
    item: '18" HDPE Perf Pipe',
    qty: 10,
    customer: "Example Customer B",
    dueDate: "2026-06-13",
    notes: "Rush / confirm hole size",
  },
  {
    id: "MO123458",
    machine: "Saw",
    day: "Wednesday",
    start: "07:30",
    end: "10:00",
    item: "PVC Cut Lengths",
    qty: 32,
    customer: "Example Customer C",
    dueDate: "2026-06-14",
  },
  {
    id: "MO123459",
    machine: "QC / Packing",
    day: "Friday",
    start: "13:00",
    end: "15:00",
    item: "Final QC / Wrap",
    qty: 1,
    customer: "Internal",
    dueDate: "2026-06-14",
  },
];

const emptyJobDraft: JobDraft = {
  id: "",
  machine: machines[0],
  day: days[0],
  start: "08:00",
  end: "09:00",
  item: "",
  qty: "1",
  customer: "",
  dueDate: "",
  notes: "",
};

const STORAGE_KEY = "rrt-schedule-board-jobs";

function App() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const savedJobs = localStorage.getItem(STORAGE_KEY);

    if (!savedJobs) {
      return initialJobs;
    }

    try {
      return JSON.parse(savedJobs) as Job[];
    } catch {
      return initialJobs;
    }
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [newJob, setNewJob] = useState<JobDraft>(emptyJobDraft);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  function updateJob(jobId: string, updates: Partial<Job>) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId ? { ...job, ...updates } : job
      )
    );
  }

  function updateNewJob(field: keyof JobDraft, value: string) {
    setNewJob((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  function addJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = newJob.id.trim();
    const item = newJob.item.trim();

    if (!id || !item) {
      alert("MO number and item are required.");
      return;
    }

    const duplicateJob = jobs.some(
      (job) => job.id.toLowerCase() === id.toLowerCase()
    );

    if (duplicateJob) {
      alert("That MO already exists on the board.");
      return;
    }

    const jobToAdd: Job = {
      id,
      machine: newJob.machine,
      day: newJob.day,
      start: newJob.start,
      end: newJob.end,
      item,
      qty: Number(newJob.qty) || 0,
      customer: newJob.customer.trim() || undefined,
      dueDate: newJob.dueDate || undefined,
      notes: newJob.notes.trim() || undefined,
    };

    setJobs((currentJobs) => [...currentJobs, jobToAdd]);
    setSelectedJobId(jobToAdd.id);
    setNewJob(emptyJobDraft);
  }

  function resetSchedule() {
    setJobs(initialJobs);
    setSelectedJobId(null);
    setNewJob(emptyJobDraft);
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>RRT Schedule Board Prototype</h1>
          <p>Static fake data first. Drag/drop goblinry later.</p>
        </div>

        <button className="reset-button" onClick={resetSchedule}>
          Reset Schedule
        </button>
      </header>

      <div className="layout">
        <section className="board">
          <div className="corner-cell">Machine</div>

          {days.map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}

          {machines.map((machine) => (
            <Fragment key={machine}>
              <div className="machine-label">{machine}</div>

              {days.map((day) => {
                const dayJobs = jobs.filter(
                  (job) => job.machine === machine && job.day === day
                );

                return (
                  <div key={`${machine}-${day}`} className="schedule-cell">
                    {dayJobs.map((job) => (
                      <article
                        key={job.id}
                        className={`job-card ${
                          selectedJobId === job.id ? "selected" : ""
                        }`}
                        onClick={() => setSelectedJobId(job.id)}
                      >
                        <strong>{job.id}</strong>
                        <span>{job.item}</span>
                        <small>
                          {job.start}–{job.end} · Qty {job.qty}
                        </small>
                        {job.notes && <em>{job.notes}</em>}
                      </article>
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </section>

        <aside className="side-panel">
          <section className="add-job-panel">
            <h2>Add Job</h2>

            <form onSubmit={addJob} className="add-job-form">
              <label>
                MO Number
                <input
                  value={newJob.id}
                  onChange={(event) => updateNewJob("id", event.target.value)}
                  placeholder="MO123460"
                />
              </label>

              <label>
                Item
                <input
                  value={newJob.item}
                  onChange={(event) => updateNewJob("item", event.target.value)}
                  placeholder='24" HDPE Perf Pipe'
                />
              </label>

              <label>
                Customer
                <input
                  value={newJob.customer}
                  onChange={(event) =>
                    updateNewJob("customer", event.target.value)
                  }
                  placeholder="Customer name"
                />
              </label>

              <div className="two-col-fields">
                <label>
                  Day
                  <select
                    value={newJob.day}
                    onChange={(event) => updateNewJob("day", event.target.value)}
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Machine
                  <select
                    value={newJob.machine}
                    onChange={(event) =>
                      updateNewJob("machine", event.target.value)
                    }
                  >
                    {machines.map((machine) => (
                      <option key={machine} value={machine}>
                        {machine}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="two-col-fields">
                <label>
                  Start
                  <input
                    type="time"
                    value={newJob.start}
                    onChange={(event) =>
                      updateNewJob("start", event.target.value)
                    }
                  />
                </label>

                <label>
                  End
                  <input
                    type="time"
                    value={newJob.end}
                    onChange={(event) => updateNewJob("end", event.target.value)}
                  />
                </label>
              </div>

              <div className="two-col-fields">
                <label>
                  Qty
                  <input
                    type="number"
                    min="0"
                    value={newJob.qty}
                    onChange={(event) => updateNewJob("qty", event.target.value)}
                  />
                </label>

                <label>
                  Due Date
                  <input
                    type="date"
                    value={newJob.dueDate}
                    onChange={(event) =>
                      updateNewJob("dueDate", event.target.value)
                    }
                  />
                </label>
              </div>

              <label>
                Notes
                <textarea
                  value={newJob.notes}
                  onChange={(event) => updateNewJob("notes", event.target.value)}
                  rows={3}
                  placeholder="Pattern, rush note, missing info, etc."
                />
              </label>

              <button type="submit" className="add-button">
                Add Job
              </button>
            </form>
          </section>

          <section className="details-panel">
            {selectedJob ? (
              <>
                <div className="details-header">
                  <h2>{selectedJob.id}</h2>
                  <button onClick={() => setSelectedJobId(null)}>×</button>
                </div>

                <dl>
                  <dt>Item</dt>
                  <dd>{selectedJob.item}</dd>

                  <dt>Customer</dt>
                  <dd>{selectedJob.customer ?? "N/A"}</dd>

                  <dt>Machine</dt>
                  <dd>{selectedJob.machine}</dd>

                  <dt>Scheduled</dt>
                  <dd>
                    {selectedJob.day}, {selectedJob.start}–{selectedJob.end}
                  </dd>

                  <dt>Due Date</dt>
                  <dd>{selectedJob.dueDate ?? "N/A"}</dd>
                </dl>

                <div className="edit-controls">
                  <h3>Edit Job</h3>

                  <label>
                    Start Time
                    <input
                      type="time"
                      value={selectedJob.start}
                      onChange={(event) =>
                        updateJob(selectedJob.id, { start: event.target.value })
                      }
                    />
                  </label>

                  <label>
                    End Time
                    <input
                      type="time"
                      value={selectedJob.end}
                      onChange={(event) =>
                        updateJob(selectedJob.id, { end: event.target.value })
                      }
                    />
                  </label>

                  <label>
                    Quantity
                    <input
                      type="number"
                      min="0"
                      value={selectedJob.qty}
                      onChange={(event) =>
                        updateJob(selectedJob.id, {
                          qty: Number(event.target.value),
                        })
                      }
                    />
                  </label>

                  <label>
                    Notes
                    <textarea
                      value={selectedJob.notes ?? ""}
                      onChange={(event) =>
                        updateJob(selectedJob.id, { notes: event.target.value })
                      }
                      rows={4}
                    />
                  </label>
                </div>

                <div className="move-controls">
                  <h3>Move Day</h3>
                  <div className="button-grid">
                    {days.map((day) => (
                      <button
                        key={day}
                        className={selectedJob.day === day ? "active" : ""}
                        onClick={() => updateJob(selectedJob.id, { day })}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <h3>Move Machine</h3>
                  <div className="button-grid">
                    {machines.map((machine) => (
                      <button
                        key={machine}
                        className={
                          selectedJob.machine === machine ? "active" : ""
                        }
                        onClick={() => updateJob(selectedJob.id, { machine })}
                      >
                        {machine}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-detail">
                <h2>No MO selected</h2>
                <p>Click a job block to view details.</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

export default App;