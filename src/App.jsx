import { useEffect, useState } from 'react'
import {
  Calendar,
  Clock,
  UserRound,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Search,
  ArrowRight,
  CalendarDays,
  Activity,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [doctors, setDoctors] = useState([])
  const [slots, setSlots] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [reason, setReason] = useState('')
  const [activeTab, setActiveTab] = useState('home')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: doctorsData, error: doctorsError } = await supabase
      .from('doctors')
      .select('*')
      .order('name')

    const { data: slotsData, error: slotsError } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('is_available', true)
      .order('appointment_date')
      .order('appointment_time')

    const { data: appointmentsData, error: appointmentsError } =
      await supabase
        .from('appointments')
        .select(`
          *,
          appointment_slots (
            appointment_date,
            appointment_time,
            doctors (
              name,
              specialization
            )
          )
        `)
        .order('created_at', { ascending: false })

    if (doctorsError || slotsError || appointmentsError) {
      console.error(doctorsError || slotsError || appointmentsError)
      setMessage({
        type: 'error',
        text: 'Unable to load data from the cloud database.',
      })
    } else {
      setDoctors(doctorsData || [])
      setSlots(slotsData || [])
      setAppointments(appointmentsData || [])
    }

    setLoading(false)
  }

  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  function formatTime(time) {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  async function bookAppointment() {
    if (!selectedSlot || !selectedDoctor) {
      showMessage('error', 'Please select a doctor and appointment slot.')
      return
    }

    if (!patientName.trim() || !patientEmail.trim()) {
      showMessage('error', 'Please enter your name and email.')
      return
    }

    setBooking(true)

    // Insert appointment into the cloud database.
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        slot_id: selectedSlot.id,
        patient_name: patientName.trim(),
        patient_email: patientEmail.trim(),
        reason: reason.trim(),
        status: 'BOOKED',
      })
      .select()

    if (error) {
      console.error(error)

      if (error.code === '23505') {
        showMessage(
          'error',
          'This appointment slot has already been booked. Please choose another slot.'
        )
      } else {
        showMessage('error', error.message)
      }

      setBooking(false)
      return
    }

    // Mark the slot unavailable.
    const { error: slotError } = await supabase
      .from('appointment_slots')
      .update({ is_available: false })
      .eq('id', selectedSlot.id)

    if (slotError) {
      console.error(slotError)
    }

    showMessage('success', 'Appointment booked successfully!')

    setSelectedSlot(null)
    setPatientName('')
    setPatientEmail('')
    setReason('')
    setSelectedDoctor(null)

    await loadData()

    setActiveTab('appointments')
    setBooking(false)
  }

  async function cancelAppointment(appointmentId, slotId) {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'CANCELLED' })
      .eq('id', appointmentId)

    if (error) {
      showMessage('error', error.message)
      return
    }

    await supabase
      .from('appointment_slots')
      .update({ is_available: true })
      .eq('id', slotId)

    showMessage('success', 'Appointment cancelled successfully.')
    await loadData()
  }

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.name} ${doctor.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const doctorSlots = selectedDoctor
    ? slots.filter((slot) => slot.doctor_id === selectedDoctor.id)
    : []

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand" onClick={() => setActiveTab('home')}>
          <div className="brand-icon">
            <Activity size={22} />
          </div>
          <div>
            <strong>AppointEase</strong>
            <span>Healthcare Booking</span>
          </div>
        </div>

        <nav>
          <button
            className={activeTab === 'home' ? 'nav-active' : ''}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>

          <button
            className={activeTab === 'doctors' ? 'nav-active' : ''}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors
          </button>

          <button
            className={activeTab === 'appointments' ? 'nav-active' : ''}
            onClick={() => setActiveTab('appointments')}
          >
            My Appointments
          </button>
        </nav>

        <div className="cloud-status">
          <span></span>
          Cloud Connected
        </div>
      </header>

      {message && (
        <div className={`toast ${message.type}`}>
          {message.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <XCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to cloud database...</p>
        </div>
      ) : (
        <>
          {activeTab === 'home' && (
            <main>
              <section className="hero">
                <div className="hero-content">
                  <div className="eyebrow">
                    <ShieldCheck size={16} />
                    Secure cloud-powered appointments
                  </div>

                  <h1>
                    Healthcare appointments,
                    <br />
                    <span>made simple.</span>
                  </h1>

                  <p>
                    Find the right doctor, choose an available time slot,
                    and book your appointment in seconds.
                  </p>

                  <div className="hero-actions">
                    <button
                      className="primary-btn"
                      onClick={() => setActiveTab('doctors')}
                    >
                      Find a Doctor
                      <ArrowRight size={18} />
                    </button>

                    <button
                      className="secondary-btn"
                      onClick={() => setActiveTab('appointments')}
                    >
                      <CalendarDays size={18} />
                      My Appointments
                    </button>
                  </div>

                  <div className="trust-row">
                    <div>
                      <strong>{doctors.length}</strong>
                      <span>Doctors</span>
                    </div>
                    <div>
                      <strong>{slots.length}</strong>
                      <span>Available Slots</span>
                    </div>
                    <div>
                      <strong>24/7</strong>
                      <span>Online Access</span>
                    </div>
                  </div>
                </div>

                <div className="hero-card">
                  <div className="hero-card-top">
                    <span>Next Available</span>
                    <Calendar size={20} />
                  </div>

                  <div className="hero-date">
                    <strong>
                      {slots.length > 0
                        ? formatDate(slots[0].appointment_date)
                        : 'No slots available'}
                    </strong>
                  </div>

                  <div className="mini-slots">
                    {slots.slice(0, 6).map((slot) => (
                      <div key={slot.id}>
                        {formatTime(slot.appointment_time)}
                      </div>
                    ))}
                  </div>

                  <button
                    className="card-btn"
                    onClick={() => setActiveTab('doctors')}
                  >
                    View all availability
                  </button>
                </div>
              </section>

              <section className="features">
                <div>
                  <div className="feature-icon">
                    <Calendar size={21} />
                  </div>
                  <h3>Easy Booking</h3>
                  <p>Choose a doctor and reserve an available time slot.</p>
                </div>

                <div>
                  <div className="feature-icon">
                    <ShieldCheck size={21} />
                  </div>
                  <h3>Cloud Powered</h3>
                  <p>Your appointment data is stored securely in the cloud.</p>
                </div>

                <div>
                  <div className="feature-icon">
                    <Clock size={21} />
                  </div>
                  <h3>Real-Time Slots</h3>
                  <p>Unavailable slots disappear after they are booked.</p>
                </div>
              </section>
            </main>
          )}

          {activeTab === 'doctors' && (
            <main className="page">
              <div className="page-header">
                <div>
                  <span className="section-label">OUR SPECIALISTS</span>
                  <h1>Find your doctor</h1>
                  <p>
                    Choose from our available healthcare professionals.
                  </p>
                </div>

                <div className="search-box">
                  <Search size={19} />
                  <input
                    placeholder="Search doctors or specialization..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="doctor-grid">
                {filteredDoctors.map((doctor) => (
                  <div className="doctor-card" key={doctor.id}>
                    <div className="doctor-avatar">
                      <UserRound size={34} />
                    </div>

                    <div className="doctor-rating">
                      <Star size={14} fill="currentColor" />
                      {doctor.rating}
                    </div>

                    <span className="specialization">
                      {doctor.specialization}
                    </span>

                    <h2>{doctor.name}</h2>

                    <p>{doctor.description}</p>

                    <div className="doctor-meta">
                      <span>
                        <Stethoscope size={15} />
                        {doctor.experience} years experience
                      </span>
                    </div>

                    <button
                      className="primary-btn full"
                      onClick={() => {
                        setSelectedDoctor(doctor)
                        setSelectedSlot(null)
                        setActiveTab('booking')
                      }}
                    >
                      View Availability
                      <ArrowRight size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </main>
          )}

          {activeTab === 'booking' && selectedDoctor && (
            <main className="page booking-page">
              <button
                className="back-btn"
                onClick={() => setActiveTab('doctors')}
              >
                ← Back to doctors
              </button>

              <div className="booking-layout">
                <div className="booking-doctor">
                  <div className="doctor-avatar large">
                    <UserRound size={42} />
                  </div>

                  <span className="specialization">
                    {selectedDoctor.specialization}
                  </span>

                  <h1>{selectedDoctor.name}</h1>

                  <p>{selectedDoctor.description}</p>

                  <div className="info-line">
                    <Star size={17} fill="currentColor" />
                    {selectedDoctor.rating} rating
                  </div>

                  <div className="info-line">
                    <Stethoscope size={17} />
                    {selectedDoctor.experience} years experience
                  </div>
                </div>

                <div className="booking-panel">
                  <span className="section-label">BOOK APPOINTMENT</span>
                  <h2>Select an available slot</h2>

                  <div className="date-banner">
                    <Calendar size={20} />
                    {doctorSlots.length > 0
                      ? formatDate(doctorSlots[0].appointment_date)
                      : 'No slots available'}
                  </div>

                  <div className="slot-grid">
                    {doctorSlots.map((slot) => (
                      <button
                        key={slot.id}
                        className={
                          selectedSlot?.id === slot.id
                            ? 'slot selected'
                            : 'slot'
                        }
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock size={15} />
                        {formatTime(slot.appointment_time)}
                      </button>
                    ))}
                  </div>

                  {doctorSlots.length === 0 && (
                    <div className="empty">
                      No available slots for this doctor.
                    </div>
                  )}

                  <div className="form-section">
                    <h3>Patient Details</h3>

                    <input
                      type="text"
                      placeholder="Full name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />

                    <input
                      type="email"
                      placeholder="Email address"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                    />

                    <textarea
                      placeholder="Reason for appointment (optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows="3"
                    />

                    <button
                      className="primary-btn booking-btn"
                      onClick={bookAppointment}
                      disabled={booking || !selectedSlot}
                    >
                      {booking ? 'Booking...' : 'Confirm Appointment'}
                      {!booking && <CheckCircle2 size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </main>
          )}

          {activeTab === 'appointments' && (
            <main className="page">
              <div className="page-header">
                <div>
                  <span className="section-label">YOUR BOOKINGS</span>
                  <h1>My Appointments</h1>
                  <p>View and manage your appointment bookings.</p>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="empty-state">
                  <CalendarDays size={48} />
                  <h2>No appointments yet</h2>
                  <p>
                    Your booked appointments will appear here.
                  </p>
                  <button
                    className="primary-btn"
                    onClick={() => setActiveTab('doctors')}
                  >
                    Book an Appointment
                    <ArrowRight size={17} />
                  </button>
                </div>
              ) : (
                <div className="appointment-list">
                  {appointments.map((appointment) => {
                    const slot = appointment.appointment_slots
                    const doctor = slot?.doctors

                    return (
                      <div className="appointment-card" key={appointment.id}>
                        <div className="appointment-date">
                          <CalendarDays size={22} />
                          <strong>
                            {slot
                              ? formatDate(slot.appointment_date)
                              : 'Date unavailable'}
                          </strong>
                        </div>

                        <div className="appointment-main">
                          <span className="specialization">
                            {doctor?.specialization}
                          </span>
                          <h2>{doctor?.name || 'Doctor'}</h2>
                          <p>
                            <Clock size={16} />
                            {slot
                              ? formatTime(slot.appointment_time)
                              : 'Time unavailable'}
                          </p>
                          <p>
                            <UserRound size={16} />
                            {appointment.patient_name}
                          </p>
                        </div>

                        <div className="appointment-side">
                          <span
                            className={`status ${appointment.status.toLowerCase()}`}
                          >
                            {appointment.status}
                          </span>

                          {appointment.status === 'BOOKED' && slot && (
                            <button
                              className="cancel-btn"
                              onClick={() =>
                                cancelAppointment(
                                  appointment.id,
                                  appointment.slot_id
                                )
                              }
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </main>
          )}
        </>
      )}
    </div>
  )
}

export default App