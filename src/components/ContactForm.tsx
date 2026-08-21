import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from './Button';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Video Editing',
    budget: '$500 - $1,500',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="border border-north-black bg-white p-8 md:p-12 text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 bg-north-lime text-north-black rounded-full flex items-center justify-center mx-auto border border-north-black">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase">Inquiry Received!</h3>
        <p className="text-north-gray max-w-md mx-auto">
          Thank you for getting in touch, <strong>{formData.name}</strong>. I will review your <strong>{formData.projectType}</strong> project details and reach back within 24 hours.
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-4">
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-north-black bg-white p-6 md:p-10 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block font-heading font-bold text-xs uppercase tracking-wider text-north-black mb-2">
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name"
            className="w-full px-4 py-3.5 bg-north-bg border border-north-black text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime font-body text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-heading font-bold text-xs uppercase tracking-wider text-north-black mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full px-4 py-3.5 bg-north-bg border border-north-black text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime font-body text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Type */}
        <div>
          <label className="block font-heading font-bold text-xs uppercase tracking-wider text-north-black mb-2">
            Project Type *
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-north-bg border border-north-black text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime font-body text-sm cursor-pointer"
          >
            <option value="Video Editing">Video Editing</option>
            <option value="VFX / Compositing">VFX / Compositing</option>
            <option value="Motion Graphics">Motion Graphics</option>
            <option value="Web Development">Web Development</option>
            <option value="WordPress">WordPress</option>
            <option value="AI Project">AI Project</option>
            <option value="Social Media Content">Social Media Content</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block font-heading font-bold text-xs uppercase tracking-wider text-north-black mb-2">
            Estimated Budget Range
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-3.5 bg-north-bg border border-north-black text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime font-body text-sm cursor-pointer"
          >
            <option value="Under $500">Under $500</option>
            <option value="$500 - $1,500">$500 - $1,500</option>
            <option value="$1,500 - $3,000">$1,500 - $3,000</option>
            <option value="$3,000+">$3,000+</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block font-heading font-bold text-xs uppercase tracking-wider text-north-black mb-2">
          Project Details & Requirements *
        </label>
        <textarea
          name="message"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project goals, video footage, website requirements, or creative ideas..."
          className="w-full px-4 py-3.5 bg-north-bg border border-north-black text-north-black focus:outline-none focus:ring-2 focus:ring-north-lime font-body text-sm resize-none"
        ></textarea>
      </div>

      <Button type="submit" className="w-full md:w-auto" showArrow={!loading}>
        {loading ? 'SENDING INQUIRY...' : 'Send Inquiry'}
      </Button>
    </form>
  );
};
