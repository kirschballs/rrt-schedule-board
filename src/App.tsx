import "./App.css";

type Job = {
  id: string;
  machine: string;
  day: string;
  start: string;
  end: string;
  item: string;
  qty: number;
  notes?: string;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const machines = ["Perf 1", "Perf 2", "Saw", "QC / Packing"];

const jobs: Job[] = [
  {
    id: "MO123456",
    machine: "Perf 1",
    day: "Monday",
    start: "08:00",
    end: "11:00",
    item: '24" HDPE Perf Pipe',
    qty: 6,
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
    notes: "Rush / confirm hole size",
  },
  {
    id: "MO123458",
    machine: "Saw",
    day: "Wednesday",
    start: "07:30",
    end: "10:00",
    item: 'PVC Cut Lengths',
    qty: 32,
  },
  {
    id: "MO123459",
    machine: "QC / Packing",
    day: "Friday",
    start: "13:00",
    end: "15:00",
    item: "Final QC / Wrap",
    qty: 1,
  },
];

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>RRT Schedule Board Prototype</h1>
          <p>Static fake data first. Drag/drop later.</p>
        </div>
      </header>

      <section className="board">
        <div className="corner-cell">Machine</div>

        {days.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {machines.map((machine) => (
          <>
            <div key={`${machine}-label`} className="machine-label">
              {machine}
            </div>

            {days.map((day) => {
              const dayJobs = jobs.filter(
                (job) => job.machine === machine && job.day === day
              );

              return (
                <div key={`${machine}-${day}`} className="schedule-cell">
                  {dayJobs.map((job) => (
                    <article key={job.id} className="job-card">
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
          </>
        ))}
      </section>
    </main>
  );
}

export default App;