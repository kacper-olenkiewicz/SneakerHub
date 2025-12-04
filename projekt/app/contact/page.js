export default function Contact() {
  return (
    <div className="flex flex-col items-center w-full py-20 px-6 min-h-screen">
      <div className="max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Contact Info Side */}
          <div className="bg-red-700 p-10 text-white flex flex-col justify-between" style={{ backgroundColor: '#b91c1c' }}>
            <div>
              <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
              <p className="text-red-100 mb-10">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-2xl"></span>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-red-100">+48 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl"></span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-red-100">hello@sneakerhub.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl"></span>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-red-100">123 Sneaker Street, Warsaw</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <p className="text-sm text-red-200">Follow us on social media:</p>
              <div className="flex gap-4 mt-4">
                <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors">FB</span>
                <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors">IG</span>
                <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors">TW</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10" style={{ backgroundColor: '#ffffff' }}>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-gray-900" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-gray-900" placeholder="john@example.com" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all text-gray-900" placeholder="How can we help you?"></textarea>
              </div>
              
              <button type="button" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg transform active:scale-95 transition-transform">
                Send Message
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
