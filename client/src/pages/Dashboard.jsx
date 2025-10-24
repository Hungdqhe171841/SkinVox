import { useAuth } from '../contexts/AuthContext'
import { Camera, BarChart3, Calendar, TrendingUp, Users, Zap } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Total Analyses',
      value: '24',
      change: '+12%',
      icon: <Camera className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Skin Health Score',
      value: '85%',
      change: '+5%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'This Month',
      value: '8',
      change: '+3',
      icon: <Calendar className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Recommendations',
      value: '12',
      change: 'New',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const recentAnalyses = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Full Face Analysis',
      score: 85,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-01-12',
      type: 'Acne Assessment',
      score: 78,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-01-10',
      type: 'Skin Tone Analysis',
      score: 92,
      status: 'Completed'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your skin health journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="btn btn-primary w-full py-3 flex items-center justify-center">
                  <Camera className="w-5 h-5 mr-2" />
                  New Analysis
                </button>
                <button className="btn btn-outline w-full py-3 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Reports
                </button>
                <button className="btn btn-outline w-full py-3 flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  Share Results
                </button>
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{analysis.type}</p>
                        <p className="text-sm text-gray-600">{analysis.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{analysis.score}%</p>
                      <p className="text-sm text-green-600">{analysis.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline w-full mt-4">
                View All Analyses
              </button>
            </div>
          </div>
        </div>

        {/* Skin Health Progress */}
        <div className="mt-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skin Health Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">85%</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Overall Health</p>
                <p className="text-xs text-gray-600">Excellent</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">78%</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Hydration</p>
                <p className="text-xs text-gray-600">Good</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">92%</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Texture</p>
                <p className="text-xs text-gray-600">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
