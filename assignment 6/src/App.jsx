import { useState } from 'react';

function StudentForm({ onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      name: formData.get('name').trim(),
      rollNumber: formData.get('rollNumber').trim(),
      department: formData.get('department').trim(),
      marks: Number(formData.get('marks')),
    });
    event.currentTarget.reset();
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">NEW RECORD</p>
          <h2 id="form-title">Student details</h2>
        </div>
        <span className="step-mark" aria-hidden="true">01</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Full name</span>
          <input name="name" type="text" placeholder="e.g. Aisha Mehta" autoComplete="name" required />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Roll number</span>
            <input name="rollNumber" type="text" placeholder="e.g. CS-024" required />
          </label>
          <label className="field">
            <span>Department</span>
            <input name="department" type="text" placeholder="e.g. Computer Science" required />
          </label>
        </div>

        <label className="field marks-field">
          <span>Marks <span className="field-hint">out of 100</span></span>
          <input name="marks" type="number" min="0" max="100" step="0.01" placeholder="0 – 100" required />
        </label>

        <button className="submit-button" type="submit">
          <span>Add student record</span>
          <span className="button-arrow" aria-hidden="true">→</span>
        </button>
      </form>
      <p className="form-note"><span aria-hidden="true">*</span> All fields are required</p>
    </section>
  );
}

function StudentDetails({ student }) {
  if (!student) {
    return (
      <section className="details-panel empty-state" aria-labelledby="details-title" aria-live="polite">
        <div className="empty-icon" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <p className="eyebrow">STUDENT PROFILE</p>
        <h2 id="details-title">Your record<br />will appear here.</h2>
        <p className="empty-copy">Fill in the student details and submit the form to create a profile.</p>
        <span className="empty-index">NO RECORD YET</span>
      </section>
    );
  }

  return (
    <section className="details-panel student-card" aria-labelledby="details-title" aria-live="polite">
      <div className="record-topline">
        <p className="eyebrow">STUDENT PROFILE</p>
        <span className="record-status"><span></span> RECORDED</span>
      </div>
      <div className="profile-heading">
        <div className="avatar" aria-hidden="true">{student.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2 id="details-title">{student.name}</h2>
          <p className="profile-department">{student.department}</p>
        </div>
      </div>
      <div className="details-rule"></div>
      <dl className="detail-list">
        <div className="detail-row">
          <dt>Roll number</dt>
          <dd>{student.rollNumber}</dd>
        </div>
        <div className="detail-row">
          <dt>Department</dt>
          <dd>{student.department}</dd>
        </div>
      </dl>
      <div className="marks-result">
        <div>
          <p className="eyebrow">MARKS</p>
          <p className="marks-caption">out of 100</p>
        </div>
        <p className="marks-value">{student.marks}<span> / 100</span></p>
      </div>
      <div className="score-track" role="img" aria-label={`${student.marks} out of 100 marks`}>
        <span style={{ width: `${student.marks}%` }}></span>
      </div>
    </section>
  );
}

export default function App() {
  const [student, setStudent] = useState(null);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Campus register home">
          <span className="brand-icon" aria-hidden="true">S</span>
          <span>CAMPUS<span className="wordmark-light"> / REGISTER</span></span>
        </a>
        <span className="topbar-label">STUDENT INFORMATION</span>
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow intro-eyebrow">ACADEMIC RECORDS <span></span> 2026</p>
          <h1>Every student,<br /><em>in one place.</em></h1>
        </div>
        <p className="intro-copy">A simple space to capture student information and keep each record clear, complete, and easy to find.</p>
      </section>

      <div className="workspace">
        <StudentForm onSubmit={setStudent} />
        <StudentDetails student={student} />
      </div>

      <footer className="footer">
        <span>STUDENT INFORMATION SYSTEM</span>
        <span>RECORDS MADE CLEAR <span className="footer-dot">●</span></span>
      </footer>
    </main>
  );
}