import React, { Suspense } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Home from "./components/home";
import AdminDashboard from "./pages/admin/index";
import AdminLogin from "./pages/admin/login";
import routes from "tempo-routes";

function App() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {/* For the tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/auth/login"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-md"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Sign in
                    </button>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <a
                      href="/auth/register"
                      className="text-blue-600 hover:underline"
                    >
                      Don't have an account? Register
                    </a>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/auth/register"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Register
                  </h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-md"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md"
                        placeholder="Create a password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md"
                        placeholder="Confirm your password"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/auth/login")}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Create Account
                    </button>
                  </form>
                  <div className="mt-4 text-center text-sm">
                    <a
                      href="/auth/login"
                      className="text-blue-600 hover:underline"
                    >
                      Already have an account? Login
                    </a>
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <div className="min-h-screen bg-gray-50">
                <div className="flex">
                  <div className="w-64 bg-white h-screen border-r">
                    <div className="p-4 border-b">
                      <h2 className="text-xl font-bold">SMM Panel</h2>
                    </div>
                    <nav className="p-2">
                      <ul className="space-y-1">
                        <li>
                          <a
                            href="/dashboard"
                            className="flex items-center p-3 rounded-md bg-blue-50 text-blue-600"
                          >
                            <span className="mr-3">📊</span>
                            <span>Dashboard</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/services"
                            className="flex items-center p-3 rounded-md hover:bg-gray-100"
                          >
                            <span className="mr-3">🛒</span>
                            <span>Services</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/orders"
                            className="flex items-center p-3 rounded-md hover:bg-gray-100"
                          >
                            <span className="mr-3">📦</span>
                            <span>Orders</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/wallet"
                            className="flex items-center p-3 rounded-md hover:bg-gray-100"
                          >
                            <span className="mr-3">💰</span>
                            <span>Wallet</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="/account"
                            className="flex items-center p-3 rounded-md hover:bg-gray-100"
                          >
                            <span className="mr-3">👤</span>
                            <span>Account</span>
                          </a>
                        </li>
                        <li className="pt-4 mt-4 border-t">
                          <a
                            href="/"
                            className="flex items-center p-3 rounded-md text-red-600 hover:bg-gray-100"
                          >
                            <span className="mr-3">🚪</span>
                            <span>Logout</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold">23</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">In Progress</p>
                        <p className="text-2xl font-bold">42</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="text-2xl font-bold">91</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Orders</h2>
                        <a
                          href="/orders"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View All
                        </a>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">
                              Order ID
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Service
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Quantity
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-medium">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">ORD-001</td>
                            <td className="py-3 px-4">Instagram Followers</td>
                            <td className="py-3 px-4">1,000</td>
                            <td className="py-3 px-4">2023-06-15</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">ORD-002</td>
                            <td className="py-3 px-4">YouTube Views</td>
                            <td className="py-3 px-4">5,000</td>
                            <td className="py-3 px-4">2023-06-14</td>
                            <td className="py-3 px-4">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                In Progress
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">ORD-003</td>
                            <td className="py-3 px-4">Facebook Likes</td>
                            <td className="py-3 px-4">500</td>
                            <td className="py-3 px-4">2023-06-13</td>
                            <td className="py-3 px-4">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                Pending
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Add this before the catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}

          {/* Handle 404 Not Found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
