import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../api';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import Loader from '../components/Loader';

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

  /* ================= CAREER ================= */
  const getCareerRecommendation = async () => {
    setLoading(l => ({ ...l, career: true }));
    setData(d => ({ ...d, careerData: null }));

    try {
      const res = await aiAPI.getCareerRecommendation();
      setData(d => ({ ...d, careerData: res.data }));
    } catch {
      alert("Failed to fetch career recommendation");
    } finally {
      setLoading(l => ({ ...l, career: false }));
    }
  };

  /* ================= ROADMAP ================= */
  const generateRoadmap = async () => {
    if (!inputs.careerInput.trim()) {
      alert("Please enter a career name");
      return;
    }

    setLoading(l => ({ ...l, roadmap: true }));
    setData(d => ({ ...d, roadmapData: null }));

    try {
      const res = await aiAPI.generateRoadmap(inputs.careerInput);
      setData(d => ({ ...d, roadmapData: res.data }));
    } catch {
      alert("Failed to generate roadmap");
    } finally {
      setLoading(l => ({ ...l, roadmap: false }));
    }
  };

  /* ================= RESUME ================= */
  const analyzeResume = async () => {
    if (!inputs.resumeInput.trim()) {
      alert("Please paste resume text");
      return;
    }

    setLoading(l => ({ ...l, resume: true }));
    setData(d => ({ ...d, resumeData: null }));

    try {
      const res = await aiAPI.analyzeResume(inputs.resumeInput);
      setData(d => ({ ...d, resumeData: res.data }));
    } catch {
      alert("Failed to analyze resume");
    } finally {
      setLoading(l => ({ ...l, resume: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-12 text-center text-4xl font-bold tracking-tight text-indigo-700">
          AI Career Coach
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* PROFILE */}
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          {/* AI SECTION */}
          <div className="space-y-10 lg:col-span-2">

            {/* CAREER */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-5 text-2xl font-semibold text-gray-800">
                AI Career Recommendation
              </h2>

              <button
                onClick={getCareerRecommendation}
                disabled={loading.career}
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white
                           transition hover:bg-indigo-700 hover:shadow-md
                           active:scale-[0.98]
                           disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading.career ? "Analyzing..." : "Get Career Recommendation"}
              </button>

              {loading.career && <Loader />}

              {data.careerData && (
                <div className="mt-8 space-y-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Experience Level:</span>{" "}
                    {data.careerData.experienceLevel}
                  </p>

                  {data.careerData.recommendedRoles.map((role, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-slate-50 p-5"
                    >
                      <h3 className="text-lg font-semibold text-indigo-600">
                        {role.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-700">
                        {role.whySuitable}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ROADMAP */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-5 text-2xl font-semibold text-gray-800">
                Roadmap Generator
              </h2>

              <input
                name="careerInput"
                value={inputs.careerInput}
                onChange={handleInputChange}
                placeholder="Enter career name"
                className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                           focus:border-green-500 focus:ring-2 focus:ring-green-500/30"
              />

              <button
                onClick={generateRoadmap}
                disabled={loading.roadmap}
                className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white
                           transition hover:bg-green-700 hover:shadow-md
                           active:scale-[0.98]
                           disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading.roadmap ? "Generating..." : "Generate Roadmap"}
              </button>

              {loading.roadmap && <Loader />}

              {data.roadmapData && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-bold text-indigo-700">
                    Roadmap for {data.roadmapData.career}
                  </h3>

                  {data.roadmapData.roadmap.map((phase, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 bg-slate-50 p-5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{phase.phase}</h4>
                        <span className="text-xs text-gray-500">
                          {phase.duration}
                        </span>
                      </div>

                      <p className="text-sm font-medium">Topics</p>
                      <ul className="mb-3 list-disc list-inside text-sm text-gray-700">
                        {phase.topics.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>

                      <p className="text-sm font-medium">Tasks</p>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {phase.tasks.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* RESUME */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-5 text-2xl font-semibold text-gray-800">
                Resume Analyzer
              </h2>

              <textarea
                name="resumeInput"
                value={inputs.resumeInput}
                onChange={handleInputChange}
                placeholder="Paste resume text here"
                className="mb-4 min-h-[140px] w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              />

              <button
                onClick={analyzeResume}
                disabled={loading.resume}
                className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white
                           transition hover:bg-purple-700 hover:shadow-md
                           active:scale-[0.98]
                           disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading.resume ? "Analyzing..." : "Analyze Resume"}
              </button>

              {loading.resume && <Loader />}

              {data.resumeData && (
                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4">
                    <h3 className="font-semibold text-purple-700">
                      Resume Score
                    </h3>
                    <span className="text-2xl font-bold text-purple-700">
                      {data.resumeData.overallScore}/100
                    </span>
                  </div>

                  <div className="rounded-xl border p-4">
                    <h4 className="mb-2 font-semibold">Summary</h4>
                    <p className="text-sm text-gray-700">
                      {data.resumeData.summary}
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <h4 className="mb-2 font-semibold text-green-600">
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {data.resumeData.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border p-4">
                    <h4 className="mb-2 font-semibold text-orange-600">
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.resumeData.missingKeywords.map((k, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
