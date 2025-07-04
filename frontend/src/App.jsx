import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import AppointmentForm from "./components/AppointmentForm";
import DoctorProfile from "./components/DoctorProfile";
import Home from "./components/Home";
import PatientHistory from "./components/PatientHistory";
import Notifications from "./components/Notifications";
import AppointmentsPage from "./components/AppointmentsPage";
import NotFound from "./components/NotFound";
import FindDoctor from "./components/FindDoctor";
import MedicalRecords from "./components/MedicalRecords";
import Book from "./components/Book";
import ProfilePage from "./components/ProfilePage";
import PatientPrescriptions from "./components/PatientPrescriptions.jsx";
import Services from "./components/Service.jsx";
import HowToUse from "./components/Howtouse.jsx";

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/appointment/:doctorId" element={<AppointmentForm />}></Route>
            <Route path="/doctor" element={<DoctorProfile />}></Route>
            <Route path="/doctor/:userId/patient-history" element={<PatientHistory />}/>
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/appointments" element={<AppointmentsPage />}/>
            <Route path="/medicalrecords" element={<MedicalRecords />}/>
            <Route path="/findDoctor" element={<FindDoctor />} />
            <Route path="/book" element={<Book />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
            <Route path="/services" element={<Services />} />
            <Route path="/howtouse" element={<HowToUse />} />


            {/* Catch-All Route for Invalid URLs */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
