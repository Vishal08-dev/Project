import { Heart, Users, Droplet, Award, Activity, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-[#C62828] to-[#8B0000] text-white pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Donate Blood, Save Lives
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Your one drop can save many lives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donor-register"
              className="px-8 py-4 bg-white text-[#C62828] rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Register as Donor
            </Link>
            <Link
              to="/request-blood"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#C62828] transition-all transform hover:scale-105"
            >
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-[#C62828] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">5,234+</h3>
              <p className="text-gray-600 font-medium">Total Donors</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-[#C62828] rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">12,850</h3>
              <p className="text-gray-600 font-medium">Available Units</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-[#C62828] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">8,965</h3>
              <p className="text-gray-600 font-medium">Successful Donations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Why Blood Donation Matters
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Every two seconds, someone in the world needs blood. Blood donations are essential for surgeries, cancer treatment, chronic illnesses, and traumatic injuries. A single donation can save up to three lives.
              </p>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                By becoming a donor, you join a community of heroes who make a difference every day. The process is safe, simple, and takes less than an hour of your time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Activity className="w-6 h-6 text-[#C62828] mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Safe Process</h4>
                    <p className="text-gray-600 text-sm">Medically supervised and sterile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-[#C62828] mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Health Benefits</h4>
                    <p className="text-gray-600 text-sm">Regular health check-ups included</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-[#C62828] mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Quick & Easy</h4>
                    <p className="text-gray-600 text-sm">Takes less than an hour</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="w-6 h-6 text-[#C62828] mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Save Lives</h4>
                    <p className="text-gray-600 text-sm">One donation saves three lives</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 bg-gradient-to-br from-[#C62828] to-[#8B0000]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-32 h-32 text-white opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#C62828] to-[#8B0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of donors who are saving lives every day
          </p>
          <Link
            to="/donor-register"
            className="inline-block px-10 py-4 bg-white text-[#C62828] rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            Become a Donor Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
