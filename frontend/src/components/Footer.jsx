
function Footer() {
  return (
   <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-xl font-semibold text-gray-800">
                  HealthCare+
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your trusted partner in managing health.
                </p>
              </div>
              <div className="flex space-x-6 text-gray-600 text-sm">
                <a href="#" className="hover:text-blue-600 transition">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-600 transition">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-blue-600 transition">
                  Contact Us
                </a>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} HealthCare+. All rights
              reserved.
            </div>
          </div>
        </footer>
  )
}

export default Footer