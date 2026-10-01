import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  MapPin,
  Flag,
  Star,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Building,
  Check,
} from 'lucide-react';
import { PRESENTER_INFO } from '../data/mockData';

export const TrustSafetyView: React.FC = () => {
  const [testRoll, setTestRoll] = useState('2500540130007');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'unverified';
    name?: string;
    department?: string;
    college?: string;
  } | null>({
    status: 'verified',
    name: 'Aman Kumar Singh',
    department: 'B.Tech',
    college: 'BBDITM',
  });

  const handleVerifyStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRoll.trim()) return;

    if (testRoll === PRESENTER_INFO.rollNo || testRoll.startsWith('25') || testRoll.startsWith('21')) {
      setVerificationResult({
        status: 'verified',
        name: testRoll === PRESENTER_INFO.rollNo ? PRESENTER_INFO.name : 'Verified University Student',
        department: 'B.Tech',
        college: PRESENTER_INFO.college,
      });
    } else {
      setVerificationResult({
        status: 'unverified',
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Slide 11 Header */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              COMMUNITY INTEGRITY & MODERATION
            </span>
            <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-800/60">
              Verified Campus Ecosystem
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Trust, Safety & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Keeping the CampusHub marketplace safe, student-only, and free from scammers or commercial spammers.
          </p>
        </div>

        {/* 4 Pillars of Trust matching Slide 11 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-cyan-800/60 bg-slate-900/80 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">1. Student Verification</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Registered using official university roll number & institutional domain (.edu / .ac.in).
              </p>
            </div>
            <span className="inline-block rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              No outsiders allowed
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-emerald-800/60 bg-slate-900/80 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">2. Campus-Only Trading</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                All pickups occur within campus boundaries: hostel common rooms, department lobbies, or campus cafeteria.
              </p>
            </div>
            <span className="inline-block rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Zero shipping risks
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-amber-800/60 bg-slate-900/80 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-950 text-amber-400 border border-amber-800/50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3. Content Moderation</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Automated keywords flag prohibited items, external commercial ads, fake prices, and unauthorized materials.
              </p>
            </div>
            <span className="inline-block rounded bg-amber-950 px-2 py-0.5 text-[10px] font-bold text-amber-300">
              Live moderation filter
            </span>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-xl border border-purple-800/60 bg-slate-900/80 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950 text-purple-400 border border-purple-800/50">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">4. Ratings & Reviews</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Peer accountability builds a trustworthy campus reputation with public seller ratings and verified reviews.
              </p>
            </div>
            <span className="inline-block rounded bg-purple-950 px-2 py-0.5 text-[10px] font-bold text-purple-300">
              Transparent trust score
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Verification Demo & Campus Safety Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Roll Number Authenticator */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span>Interactive Student ID Authenticator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Simulate university database verification for incoming student signups
            </p>
          </div>

          <form onSubmit={handleVerifyStudent} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter University Roll Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testRoll}
                  onChange={(e) => setTestRoll(e.target.value)}
                  placeholder="e.g. 2500540130007"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </form>

          {verificationResult && (
            <div
              className={`rounded-xl border p-4 space-y-2 ${
                verificationResult.status === 'verified'
                  ? 'border-emerald-700/80 bg-emerald-950/30 text-emerald-200'
                  : 'border-rose-700/80 bg-rose-950/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                {verificationResult.status === 'verified' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Verified University Student Authenticated</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-rose-400" />
                    <span>Roll Number Not Found in University Student Directory</span>
                  </>
                )}
              </div>

              {verificationResult.status === 'verified' && (
                <div className="text-xs space-y-1 text-slate-300">
                  <p><strong className="text-white">Name:</strong> {verificationResult.name}</p>
                  <p><strong className="text-white">Program:</strong> {verificationResult.department}</p>
                  <p><strong className="text-white">Institution:</strong> {verificationResult.college}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campus Safe Zones & Trading Rules */}
        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-emerald-400" />
              <span>Campus Safe Meetup Guidelines</span>
            </h2>
            <p className="text-xs text-slate-400">
              CampusHub rules designed for student safety and convenience
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Always Meet During Daylight or in Well-Lit Lobbies:</strong> Meet at hostel entrances, student cafeterias, or library porticos.
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Inspect Before Paying:</strong> Inspect cycle chains, book editions, and electronic appliance plugs before confirming the deal.
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Direct UPI or Cash:</strong> Use direct peer-to-peer UPI (GPay/PhonePe) or exact cash at pickup. No online escrow links required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
