const seedData = {
  buses: [{ id: 'ST-204', driver: 'A. Kamau', route: 'North Loop', status: 'On route', eta: '07 min' }, { id: 'ST-118', driver: 'M. Otieno', route: 'Coastline', status: 'Delayed', eta: '18 min' }, { id: 'ST-307', driver: 'J. Wanjiku', route: 'West Hills', status: 'Arrived', eta: 'Complete' }],
  attendance: [{ student: 'Asma Ahmed', route: 'North Loop', time: '07:14', status: 'Boarded' }, { student: 'Saidi Juma', route: 'Coastline', time: '07:22', status: 'Boarded' }, { student: 'amina Jabir', route: 'West Hills', time: '07:31', status: 'Absent' }],
  students: [],
  routes: [{ name: 'North Loop', stops: 8, bus: 'ST-204', time: '06:45' }, { name: 'Coastline', stops: 6, bus: 'ST-118', time: '06:55' }, { name: 'West Hills', stops: 7, bus: 'ST-307', time: '07:05' }],
  notifications: [{ title: 'Bus ST-118 is running late', text: 'Coastline route is delayed by 18 minutes.', time: '8 min ago', type: 'Delay' }, { title: 'Morning boarding complete', text: 'West Hills route has arrived at school.', time: '22 min ago', type: 'Update' }],
  bookings: []
};
const store = { get(key) { return JSON.parse(localStorage.getItem(`sst-${key}`) || JSON.stringify(seedData[key] || [])); }, set(key, value) { localStorage.setItem(`sst-${key}`, JSON.stringify(value)); } };
function toast(message) { const node = document.createElement('div'); node.className = 'toast'; node.textContent = message; document.body.append(node); setTimeout(() => node.remove(), 2600); }
function statusClass(value) { return /delay|absent/i.test(value) ? 'red' : /arrived|boarded|on route/i.test(value) ? 'green' : 'amber'; }
function renderShell(active) { document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === active)); const date = document.querySelector('[data-today]'); if (date) date.textContent = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date()); }
document.addEventListener('DOMContentLoaded', () => {
  renderShell(document.body.dataset.page || 'dashboard');
  document.querySelectorAll('[data-action="toast"]').forEach(button => button.addEventListener('click', () => toast(button.dataset.message || 'Update saved')));
  const registrationForm = document.querySelector('#registrationForm');
  if (registrationForm) registrationForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(registrationForm);
    const students = store.get('students');
    students.unshift({
      id: `REG-${Date.now().toString().slice(-6)}`,
      studentName: formData.get('studentName'),
      grade: formData.get('grade'),
      school: formData.get('school'),
      guardianName: formData.get('guardianName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      route: formData.get('route'),
      submittedAt: new Date().toISOString(),
      status: 'Pending review'
    });
    store.set('students', students);
    registrationForm.reset();
    toast('Registration received. The school will review it shortly.');
  });
});