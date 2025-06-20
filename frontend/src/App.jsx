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

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/profile/:id" element={<Profile />}></Route>
            <Route
              path="/appointment/:id"
              element={<AppointmentForm />}
            ></Route>
            <Route path="/doctor/:id" element={<DoctorProfile />}></Route>
            <Route
              path="/doctor/:userId/patient-history"
              element={<PatientHistory />}
            />
            <Route path="/notifications/:userId" element={<Notifications />} />
            <Route
              path="/appointments/:userId"
              element={<AppointmentsPage />}
            />
            <Route
              path="/medical-records/:userId"
              element={<MedicalRecords />}
            />
            <Route path="/findDoctor/:userId" element={<FindDoctor />} />
            <Route path="/book/:userId" element={<Book />} />
            <Route path="/profilepage/:userId" element={<ProfilePage />} />
            <Route path="/patient/:patientId/prescriptions" element={<PatientPrescriptions />} />

            {/* Catch-All Route for Invalid URLs */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
