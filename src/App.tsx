import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { ChatAgent } from './components/ChatAgent/ChatAgent';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Works } from './pages/Works';
import { DigitalAssetsStore } from './pages/DigitalAssetsStore';
import { Resume } from './pages/Resume';
import { Pricing } from './pages/Pricing';
import { Blogs } from './pages/Blogs';
import { BlogPostDetail } from './pages/BlogPostDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Faqs } from './pages/Faqs';
import { Contact } from './pages/Contact';
import { AIAgentPage } from './pages/AIAgentPage';
import { NotFound } from './pages/NotFound';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <CustomCursor />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-north-bg text-north-black">
        <Header />
        <main className="flex-grow">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/works" element={<Works />} />
              <Route path="/assets" element={<DigitalAssetsStore />} />
              <Route path="/store" element={<DigitalAssetsStore />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogPostDetail />} />
              <Route path="/agent" element={<AIAgentPage />} />
              <Route path="/ai" element={<AIAgentPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/blogs" element={<AdminDashboard />} />
              <Route path="/admin/assets" element={<AdminDashboard />} />
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        {/* Global Floating AI Intelligence Agent */}
        <ChatAgent />
      </div>
    </Router>
  );
};

export default App;
