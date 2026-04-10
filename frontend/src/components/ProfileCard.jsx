import { useEffect, useState } from 'react';
import { profileAPI } from '../api';
import Card from './Card';
import Loader from './Loader';

export default function ProfileCard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    skills: '',
    interests: '',
    experienceLevel: 'Beginner'
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await profileAPI.get();
        if (!isMounted) return;

        setProfile({
          skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          interests: Array.isArray(data.interests) ? data.interests.join(', ') : '',
          experienceLevel: data.experienceLevel || 'Beginner'
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const profileData = {
        skills: profile.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        interests: profile.interests.split(',').map(interest => interest.trim()).filter(Boolean),
        experienceLevel: profile.experienceLevel
      };

      const updatedProfile = await profileAPI.update(profileData);
      setProfile({
        skills: Array.isArray(updatedProfile.skills) ? updatedProfile.skills.join(', ') : '',
        interests: Array.isArray(updatedProfile.interests) ? updatedProfile.interests.join(', ') : '',
        experienceLevel: updatedProfile.experienceLevel || 'Beginner'
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Card
      title="Your Profile"
      className="border border-white/60 bg-white/90 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur"
    >
      <p className="mb-5 text-sm leading-6 text-slate-600">
        Keep your skills and interests updated so the AI suggestions stay relevant.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Skills <span className="text-slate-400">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="React, Python, Machine Learning"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Interests <span className="text-slate-400">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="interests"
            value={profile.interests}
            onChange={handleChange}
            placeholder="Web Development, Data Science, AI"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={profile.experienceLevel}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Profile updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </Card>
  );
}
