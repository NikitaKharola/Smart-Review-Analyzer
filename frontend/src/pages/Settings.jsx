import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { isLoggedIn } from "../api";

function Settings() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn().then(async (yes) => {
      if (!yes) {
        navigate("/login");
        return;
      }
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setFullName(data.user?.user_metadata?.full_name || "");
      setCheckingAuth(false);
    });
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Checking your session...</p>
      </div>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setProfileSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });
      if (error) throw error;
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileError(err.message || "Could not update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Could not update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (deleteConfirmText !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm.');
      return;
    }

    setDeleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch("http://localhost:5000/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Could not delete account.");
      }

      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      setDeleteError(err.message || "Could not delete account.");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto py-16 px-6">

        <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">
          Manage your account preferences and application settings.
        </p>

        {/* Profile Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Profile</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Update your personal information.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full border border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800/50 text-slate-500 rounded-xl p-3 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
            </div>

            {profileMessage && <p className="text-sm text-green-600">{profileMessage}</p>}
            {profileError && <p className="text-sm text-red-500">{profileError}</p>}

            <button
              type="submit"
              disabled={profileSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Change Password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Choose a new password for your account.
          </p>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}
            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition disabled:opacity-60"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* Delete Account */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 p-8">
          <h2 className="text-2xl font-bold mb-1 text-red-600">Delete Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This permanently deletes your account and all your reviews. This cannot be undone.
          </p>

          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
            Type <span className="font-mono font-bold">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {deleteError && <p className="text-sm text-red-500 mb-4">{deleteError}</p>}

          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        </section>

      </div>
    </div>
  );
}

export default Settings;
