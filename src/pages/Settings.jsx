import React, { useState, useEffect, useRef } from 'react';
import {
  User, Lock, Settings as SettingsIcon, Activity, Wrench, Globe, ShieldCheck, LogOut, Trash2, Download, Copy, Camera, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';

const Card = ({ children, className = "" }) => (
  <div className={`glass-card rounded-2xl ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4 p-6 border-b border-slate-100 dark:border-slate-700/50">
    <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300">
      <Icon size={22} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </div>
);

const InputGroup = ({ label, type = "text", placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-xl premium-input"
    />
  </div>
);

const Toggle = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  </div>
);

export default function Settings({ isDarkMode, setIsDarkMode }) {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "Gemachis Tesfaye",
    email: "gemachis.t@university.edu",
    role: "Undergraduate Student",
    avatar: "/profile.png",
    id: "USR-99281-XJ"
  });

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });

  const [feedback, setFeedback] = useState(null);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCopyId = () => {
    const textArea = document.createElement("textarea");
    textArea.value = profile.id;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showFeedback("User ID copied to clipboard!");
    } catch (err) {
      showFeedback("Failed to copy ID", "error");
    }
    document.body.removeChild(textArea);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({ profile, notifications, timestamp: new Date().toISOString() }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `user-data-${profile.id}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showFeedback("Data exported as JSON");
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new) {
      showFeedback("Please fill in all password fields", "error");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showFeedback("New passwords do not match", "error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswords({ current: "", new: "", confirm: "" });
      showFeedback("Password updated successfully!");
    }, 1500);
  };

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out of all devices?")) {
      showFeedback("Signing out...");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleDeleteAccount = () => {
    const confirmation = window.prompt("To delete your account, type your User ID: " + profile.id);
    if (confirmation === profile.id) {
      showFeedback("Account deletion scheduled", "error");
    } else if (confirmation !== null) {
      showFeedback("ID mismatch. Deletion cancelled.", "error");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showFeedback("File is too large (max 2MB)", "error");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result
        }));
        showFeedback("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-transparent text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile, security and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showFeedback("All changes saved locally")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Save All Changes
            </button>
          </div>
        </header>

        {feedback && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in fade-in slide-in-from-top-4 duration-300 ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
            }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{feedback.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader
              icon={User}
              title="Profile Information"
              description="Update your personal details and how others see you."
            />
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                <div className="relative group">
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md transition-opacity group-hover:opacity-90"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={handleImageClick}
                    className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    title="Upload local image"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{profile.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{profile.role}</p>
                  <p className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded inline-block text-slate-600 dark:text-slate-300">ID: {profile.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <InputGroup
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => showFeedback("Profile updated successfully!")}
                  className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-lg hover:opacity-90 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader
              icon={SettingsIcon}
              title="Preferences"
              description="Personalize your dashboard experience."
            />
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
                <div className="relative group">
                  <select className="w-full appearance-none px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 dark:text-slate-100">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                  <Globe size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 divide-y divide-slate-100 dark:divide-slate-700/50">
                <Toggle
                  label="Dark Mode"
                  enabled={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                />
                <Toggle
                  label="Email Notifications"
                  enabled={notifications.email}
                  onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                />
                <Toggle
                  label="Marketing Updates"
                  enabled={notifications.marketing}
                  onChange={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                />
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader
              icon={Lock}
              title="Password & Security"
              description="Manage your password and account protection."
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <InputGroup
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                />
                <InputGroup
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
                <InputGroup
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
                <button
                  onClick={handleUpdatePassword}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-medium hover:opacity-90 transition-all mt-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
                </button>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 p-5 space-y-4">
                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
                  <ShieldCheck size={20} />
                  <h4 className="font-semibold text-sm uppercase tracking-wider">Security Recommendation</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
                </p>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                  Enable 2FA Now
                </button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader
              icon={Wrench}
              title="Account Utilities"
              description="Technical actions and data management."
            />
            <div className="p-6 space-y-3">
              <button
                onClick={handleCopyId}
                className="flex items-center justify-between w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Copy User ID</span>
                </div>
                <Copy size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={handleExportData}
                className="flex items-center justify-between w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Export All Data</span>
                </div>
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-3">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
                >
                  <LogOut size={18} />
                  Sign Out of All Devices
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-3 w-full p-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all shadow-md shadow-red-500/20 font-medium text-sm"
                >
                  <Trash2 size={18} />
                  Delete Account Forever
                </button>
              </div>
            </div>
          </Card>

        </div>
        <footer className="text-center py-8">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Last updated: Oct 24, 2023 • Version 2.4.1 (Stable)
          </p>
        </footer>
      </div>
    </div>
  );
}
