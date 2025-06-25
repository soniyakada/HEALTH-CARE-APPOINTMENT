import Navbar from "./Navbar";


const services = [
  {
    title: 'Book Doctor Appointments',
    description: 'Easily book appointments with verified doctors of various specializations.',
    icon: '📅',
  },
  {
    title: 'Doctor Approval System',
    description: 'Doctors can approve or reject appointment requests based on availability.',
    icon: '✅',
  },
  {
    title: 'Patient Reviews & Ratings',
    description: 'Patients can share feedback and rate doctors based on their consultation experience.',
    icon: '⭐',
  },
  {
    title: 'Digital Prescriptions',
    description: 'Doctors can provide secure digital prescriptions after appointments.',
    icon: '📄',
  },
  {
    title: 'Medication Management',
    description: 'Doctors can prescribe medicines and patients can view them with dosage and instructions.',
    icon: '💊',
  },
  {
    title: 'Specialist Consultation',
    description: 'Book appointments with specialists like Cardiologists, Dentists, Psychiatrists, and more.',
    icon: '👨‍⚕️',
  },
  {
    title: 'Patient Medical History',
    description: 'View your past appointments, prescriptions, and medical history in one place.',
    icon: '📚',
  },
{
    title: 'Email Alerts',
    description: 'Get automatic email confirmations and reminders for your appointments and prescriptions.',
    icon: '📧',
  },
  {
    title: 'Health Reports (Coming Soon)',
    description: 'Upload, download or share lab test reports digitally with doctors. (Under development)',
    icon: '📊',
  },
];

export default function Services() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen px-4 py-12 md:px-20" style={{
         background: "linear-gradient(to right, #e8f5fe, #ffffff)",
    }}>
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-12">
        Our HealthCare+ Services
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2 " style={{color:"#1976d2"}}>
              {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      
    </div>
    </>
  );
}
