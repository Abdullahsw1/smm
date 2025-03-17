function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SMM Panel</h1>
          <nav className="flex gap-4">
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </a>
            <a
              href="/auth/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register
            </a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Social Media Marketing Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Boost your social media presence with our premium marketing
            services. Get more followers, likes, and engagement across all
            platforms.
          </p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Instagram</h3>
            <p className="text-gray-600 mb-4">
              Followers, likes, comments and more
            </p>
            <a href="/services" className="text-blue-600 hover:underline">
              Browse services →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Facebook</h3>
            <p className="text-gray-600 mb-4">
              Page likes, post engagement, and followers
            </p>
            <a href="/services" className="text-blue-600 hover:underline">
              Browse services →
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">YouTube</h3>
            <p className="text-gray-600 mb-4">
              Views, likes, subscribers, and comments
            </p>
            <a href="/services" className="text-blue-600 hover:underline">
              Browse services →
            </a>
          </div>
        </section>
        <section className="text-center mb-12">
          <a
            href="/admin/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Admin Login →
          </a>
        </section>
      </main>
    </div>
  );
}

export default Home;
