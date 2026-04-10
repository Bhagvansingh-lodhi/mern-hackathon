import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../api';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import Loader from '../components/Loader';

function SectionCard({ title, description, accentClass, children }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className={`mb-6 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${accentClass}`}>
        {title}
      </div>
      <p className="mb-6 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState({
    career: false,
    roadmap: false,
    resume: false
  });

  const [data, setData] = useState({
    careerData: null,
    roadmapData: null,
    resumeData: null
  });

  const [errors, setErrors] = useState({
    career: '',
    roadmap: '',
    resume: ''
  });

  const [inputs, setInputs] = useState({
    careerInput: '',
    resumeInput: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const getCareerRecommendation = async () => {
    setLoading(l => ({ ...l, career: true }));
    setData(d => ({ ...d, careerData: null }));
    setErrors(e => ({ ...e, career: '' }));

    try {
      const res = await aiAPI.getCareerRecommendation();
      setData(d => ({ ...d, careerData: res.data }));
    } catch (err) {
      setErrors(e => ({ ...e, career: err.message || 'Failed to fetch career recommendation' }));
    } finally {
      setLoading(l => ({ ...l, career: false }));
    }
  };

  const generateRoadmap = async () => {
    if (!inputs.careerInput.trim()) {
      setErrors(e => ({ ...e, roadmap: 'Please enter a career name' }));
      return;
    }

    setLoading(l => ({ ...l, roadmap: true }));
    setData(d => ({ ...d, roadmapData: null }));
    setErrors(e => ({ ...e, roadmap: '' }));

    try {
      const res = await aiAPI.generateRoadmap(inputs.careerInput);
      setData(d => ({ ...d, roadmapData: res.data }));
    } catch (err) {
      setErrors(e => ({ ...e, roadmap: err.message || 'Failed to generate roadmap' }));
    } finally {
      setLoading(l => ({ ...l, roadmap: false }));
    }
  };

  const analyzeResume = async () => {
    if (!inputs.resumeInput.trim()) {
      setErrors(e => ({ ...e, resume: 'Please paste resume text' }));
      return;
    }

    setLoading(l => ({ ...l, resume: true }));
    setData(d => ({ ...d, resumeData: null }));
    setErrors(e => ({ ...e, resume: '' }));

    try {
      const res = await aiAPI.analyzeResume(inputs.resumeInput);
      setData(d => ({ ...d, resumeData: res.data }));
    } catch (err) {
      setErrors(e => ({ ...e, resume: err.message || 'Failed to analyze resume' }));
    } finally {
      setLoading(l => ({ ...l, resume: false }));
    }
  };

  const careerRoles = Array.isArray(data.careerData?.recommendedRoles)
    ? data.careerData.recommendedRoles
    : [];
  const roadmapPhases = Array.isArray(data.roadmapData?.roadmap)
    ? data.roadmapData.roadmap
    : [];
  const strengths = Array.isArray(data.resumeData?.strengths)
    ? data.resumeData.strengths
    : [];
  const missingKeywords = Array.isArray(data.resumeData?.missingKeywords)
    ? data.resumeData.missingKeywords
    : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef5ff_100%)]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-12 rounded-[32px] border border-white/70 bg-slate-900 px-6 py-10 text-white shadow-[0_25px_90px_-45px_rgba(15,23,42,0.8)]">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
              Career Intelligence Workspace
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Build a sharper career plan with AI-backed guidance.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Update your profile once, then generate role suggestions, skill roadmaps, and resume feedback from a single dashboard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          <div className="space-y-10 lg:col-span-2">
            <SectionCard
              title="Career Match"
              description="Use your saved profile to surface role recommendations that fit your current skills, interests, and experience."
              accentClass="bg-cyan-50 text-cyan-700"
            >
              <button
                onClick={getCareerRecommendation}
                disabled={loading.career}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading.career ? 'Analyzing...' : 'Get Career Recommendation'}
              </button>

              {loading.career && <Loader />}
              {errors.career && (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.career}
                </div>
              )}

              {data.careerData && (
                <div className="mt-8 space-y-6">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Experience Level:</span>{' '}
                    {data.careerData.experienceLevel || 'Not available'}
                  </p>

                  {careerRoles.length > 0 ? careerRoles.map((role, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {role.title}
                        </h3>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500">
                          {role.category || 'Role'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {role.whySuitable}
                      </p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                      {data.careerData.rawText || 'The AI response was returned in an unexpected format. Please try again.'}
                    </div>
                  )}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Roadmap"
              description="Generate a focused learning plan for a target role, broken into phases with topics and practical tasks."
              accentClass="bg-emerald-50 text-emerald-700"
            >
              <input
                name="careerInput"
                value={inputs.careerInput}
                onChange={handleInputChange}
                placeholder="Enter career name"
                className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />

              <button
                onClick={generateRoadmap}
                disabled={loading.roadmap}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading.roadmap ? 'Generating...' : 'Generate Roadmap'}
              </button>

              {loading.roadmap && <Loader />}
              {errors.roadmap && (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.roadmap}
                </div>
              )}

              {data.roadmapData && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900">
                    Roadmap for {data.roadmapData.career}
                  </h3>

                  {roadmapPhases.length > 0 ? roadmapPhases.map((phase, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-slate-900">{phase.phase}</h4>
                        <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500">
                          {phase.duration}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-700">Topics</p>
                      <ul className="mb-3 list-disc list-inside text-sm leading-6 text-slate-700">
                        {(Array.isArray(phase.topics) ? phase.topics : []).map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>

                      <p className="text-sm font-medium text-slate-700">Tasks</p>
                      <ul className="list-disc list-inside text-sm leading-6 text-slate-700">
                        {(Array.isArray(phase.tasks) ? phase.tasks : []).map((task, idx) => (
                          <li key={idx}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                      {data.roadmapData.rawText || 'The roadmap response was empty. Please try again.'}
                    </div>
                  )}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Resume Review"
              description="Paste your resume text to get a quick score, strengths, and missing keyword hints for improvement."
              accentClass="bg-violet-50 text-violet-700"
            >
              <textarea
                name="resumeInput"
                value={inputs.resumeInput}
                onChange={handleInputChange}
                placeholder="Paste resume text here"
                className="mb-4 min-h-[160px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:outline-none"
              />

              <button
                onClick={analyzeResume}
                disabled={loading.resume}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading.resume ? 'Analyzing...' : 'Analyze Resume'}
              </button>

              {loading.resume && <Loader />}
              {errors.resume && (
                <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.resume}
                </div>
              )}

              {data.resumeData && (
                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between rounded-2xl bg-violet-50 p-4">
                    <h3 className="font-semibold text-violet-700">
                      Resume Score
                    </h3>
                    <span className="text-2xl font-bold text-violet-700">
                      {data.resumeData.overallScore ?? '--'}/100
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h4 className="mb-2 font-semibold text-slate-900">Summary</h4>
                    <p className="text-sm leading-6 text-slate-700">
                      {data.resumeData.summary}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h4 className="mb-2 font-semibold text-emerald-600">
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside text-sm leading-6 text-slate-700">
                      {strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h4 className="mb-2 font-semibold text-orange-600">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.length > 0 ? missingKeywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                        >
                          {keyword}
                        </span>
                      )) : (
                        <span className="text-sm text-slate-500">
                          No missing keywords were identified.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
