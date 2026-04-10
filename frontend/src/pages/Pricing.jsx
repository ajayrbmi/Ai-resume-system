export default function Pricing() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Simple Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that works for your career goals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all">
          <h3 className="text-2xl font-bold mb-4">Free</h3>
          <div className="text-4xl font-bold text-gray-900 mb-8">$0<span className="text-lg font-normal text-gray-600">/mo</span></div>
          <ul className="space-y-4 mb-10 text-left">
            <li className="flex items-center gap-3"><span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>1 Resume/month</li>
            <li className="flex items-center gap-3"><span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>Basic AI analysis</li>
          </ul>
          <button className="w-full btn-primary py-4 rounded-xl font-semibold">Get Started</button>
        </div>
        {/* Pro plan etc */}
      </div>
    </div>
  )
}

