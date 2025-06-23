import Navbar from "./Navbar";

//. Doctors will be verified by admin.
export default function HowToUse() {
  const steps = [
    {
      step: '1. Sign Up',
      title: 'Create Your Account',
      description: 'Register as a patient or doctor by filling out your basic information.',
      icon: '📝',
    },
    {
      step: '2. Sign In',
      title: 'Login to Your Dashboard',
      description: 'Use your email and password to sign in securely to your respective dashboard.',
      icon: '🔐',
    },
    {
      step: '3. Browse Doctors',
      title: 'Search and Filter Doctors',
      description: 'Explore doctors by specialization or availability and view their profile, rating, and reviews.',
      icon: '👨‍⚕️',
    },
    {
      step: '4. Book Appointment',
      title: 'Select Slot & Book',
      description: 'Choose a doctor, pick a suitable time, and book your appointment. Wait for the doctor’s approval.',
      icon: '📅',
    },
    {
      step: '5. Attend Consultation',
      title: 'In-Person Meet',
      description: 'Meet your doctor as per the confirmed slot. Consultation can be physical based on availability.',
      icon: '💬',
    },
    {
      step: '6. Get Digital Prescription',
      title: 'View',
      description: 'Post consultation, doctors will issue digital prescriptions which you can view or download anytime.',
      icon: '📄',
    },
    {
      step: '7. Track Your Medications',
      title: 'View Medications List',
      description: 'Patients can view prescribed medications, dosage, frequency, and duration in their dashboard.',
      icon: '💊',
    },
    {
      step: '8. Leave a Review',
      title: 'Give Feedback',
      description: 'After consultation, you can rate and review the doctor to help others choose better.',
      icon: '⭐',
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen px-10 py-10 text-gray-800" style={{  background: "linear-gradient(to right, #e8f5fe, #ffffff)"}}>
    
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-12">
        How to use Our Healthcare+ 
      </h2>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 bg-gray-50 border border-gray-200 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h4 className=" font-bold" style={{color:"#1976d2"}}>{step.step}</h4>
            <h3 className="text-xl font-semibold mt-1 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="/signup"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-700 transition " style={{background:"#1976d2"}}
        >
          Get Started Now
        </a>
      </div>
    </div>
    </>
  );
}
