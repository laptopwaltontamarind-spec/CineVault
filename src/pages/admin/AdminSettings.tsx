import React, { useState } from 'react';
import { Settings, Check, AlertCircle, Globe, Mail, ShieldAlert } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useMovieContext();

  const [formData, setFormData] = useState({ ...settings });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <AdminLayout
      activeTab="settings"
      title="Platform Settings"
      subtitle="Configure site branding, compliance contact, metadata, and analytics."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Site settings updated and persisted successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">General Branding</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Site Name</label>
                <input
                  type="text"
                  required
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Site Logo URL</label>
                <input
                  type="text"
                  value={formData.site_logo}
                  onChange={(e) => setFormData({ ...formData, site_logo: e.target.value })}
                  placeholder="/logo.png"
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Site Tagline / Description</label>
                <input
                  type="text"
                  value={formData.site_description}
                  onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Contact &amp; Compliance</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">General Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">DMCA Compliance Officer Email</label>
                <input
                  type="email"
                  value={formData.dmca_contact}
                  onChange={(e) => setFormData({ ...formData, dmca_contact: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-amber-300 rounded-xl outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Footer Legal Disclaimer / Copyright Text</label>
                <input
                  type="text"
                  value={formData.footer_text}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Analytics &amp; Social Links</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Google Analytics Measurement ID</label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={formData.google_analytics_id}
                  onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">Twitter / X Profile</label>
                <input
                  type="text"
                  value={formData.social_links.twitter}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, twitter: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">GitHub Repository / Organization</label>
                <input
                  type="text"
                  value={formData.social_links.github}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, github: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">YouTube Channel</label>
                <input
                  type="text"
                  value={formData.social_links.youtube}
                  onChange={(e) => setFormData({
                    ...formData,
                    social_links: { ...formData.social_links, youtube: e.target.value }
                  })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-white rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20"
            >
              Save Site Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
