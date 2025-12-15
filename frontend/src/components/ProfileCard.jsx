import { useState, useEffect } from 'react';
import { profileAPI } from '../api';
import Card from './Card';
import Loader from './Loader';

export default function ProfileCard() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [profile, setProfile] = useState({
    skills: '',
    interests: '',
    experienceLevel: 'Beginner'
  });

  useEffect(() => {
    // In a real app, you would fetch existing profile here
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
        skills: profile.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        interests: profile.interests.split(',').map(interest => interest.trim()).filter(interest => interest),
        experienceLevel: profile.experienceLevel
      };

      await profileAPI.update(profileData);
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
    <Card title="Your Profile">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Skills */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Skills <span className="text-gray-400">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="React, Python, Machine Learning"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Interests <span className="text-gray-400">(comma-separated)</span>
          </label>
          <input
            type="text"
            name="interests"
            value={profile.interests}
            onChange={handleChange}
            placeholder="Web Development, Data Science, AI"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                       transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={profile.experienceLevel}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm
                       transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
            Profile updated successfully!
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white
                     transition-all duration-200
                     hover:bg-blue-700 hover:shadow-md
                     active:scale-[0.98]
                     disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </button>

      </form>
    </Card>
  );
}
