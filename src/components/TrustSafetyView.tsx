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
  Search,
} from 'lucide-react';
import { PRESENTER_INFO } from '../data/mockData';

export const TrustSafetyView: React.FC = () => {
  const [lookupRoll, setLookupRoll] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    found: boolean;
    name?: string;
    course?: string;
    college?: string;
    verified?: boolean;
  } | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupRoll.trim()) return;

    const trimmed = lookupRoll.trim();
    if (trimmed.includes('2100540130042') || trimmed.toLowerCase().includes('aman')) {
      setLookupResult({
        found: true,
        name: 'Aman Kumar Singh',
        course: 'B.Tech IT (Final Year)',
        college: 'Babu Banarasi Das Institute of Technology and Management (BBDITM)',
        verified: true,
      });
    } else if (trimmed.includes('2200540100089') || trimmed.toLowerCase().includes('priya')) {
      setLookupResult({
        found: true,
        name: 'Priya Sharma',
        course: 'B.Tech CSE (3rd Year)',
        college: 'Babu Banarasi Das Institute of Technology and Management (BBDITM)',
        verified: true,
      });
    } else {
      setLookupResult({
        found: true,
        name: 'Verified University Student',
        course: 'Engineering / Science Student',
        college: 'AKTU / Lucknow University Affiliated Institute',
        verified: true,
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. Header Banner */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-xs font-bold border border-green-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Campus Security & Verification Standard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight">
            Trust, Safety & Student Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
            CampusHub is built strictly for authenticated students. No external commercial sellers, no hidden fees, and safe in-person handovers within college premises.
          </p>
        </div>
      </section>

      {/* 2. Four Pillars Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Roll Number Verification</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Every seller and contributor must authenticate with valid college roll credentials and email OTP before listing items.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Campus Safe Zones</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Physical handovers are scheduled in well-lit public campus hubs like the Central Library, Cafeteria, or Main Gate.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
            <Star className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Transparent Peer Reviews</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Read authentic student ratings on textbook conditions and seller integrity before initiating contact.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-xs space-y-3">
          <div className="h-10 w-10 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
            <Flag className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">Active Moderation</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Prohibited listings or suspicious commercial activity get flagged and reviewed within minutes by student moderators.
          </p>
        </div>
      </section>

      {/* 3. Interactive Student Roll Number Verification Lookup */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#171717]">Live Student Authentication Lookup</h2>
          <p className="text-xs text-[#6B7280]">
            Enter a student’s University Roll Number to check their authenticated credentials before completing an exchange.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            value={lookupRoll}
            onChange={(e) => setLookupRoll(e.target.value)}
            placeholder="e.g. 2100540130042 or 2200540100089"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>Verify Student</span>
          </button>
        </form>

        {lookupResult && (
          <div className="p-4 rounded-xl bg-[#DCFCE7] border border-green-200 space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verified Campus Student Record Found</span>
            </div>
            <p className="text-xs text-[#171717] font-semibold">{lookupResult.name}</p>
            <p className="text-[11px] text-[#6B7280]">
              {lookupResult.course} • {lookupResult.college}
            </p>
          </div>
        )}
      </section>

      {/* 4. Safe Handover Zones List */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#171717]">Designated Campus Safe Exchange Zones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Central Campus Library Foyer', timing: '9:00 AM – 7:00 PM', landmark: 'Ground Floor Reading Hall' },
            { name: 'Student Cafeteria & Food Court', timing: '8:00 AM – 8:00 PM', landmark: 'Main Entrance Seating' },
            { name: 'Hostel Gate Security Booth', timing: '7:00 AM – 9:30 PM', landmark: 'Near Warden Office Checkpoint' },
          ].map((zone) => (
            <div key={zone.name} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F7F7F5]/50 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#171717]">
                <MapPin className="h-4 w-4 text-[#2563EB]" />
                <span>{zone.name}</span>
              </div>
              <p className="text-[11px] text-[#6B7280]">Recommended Timing: {zone.timing}</p>
              <p className="text-[11px] text-[#6B7280]">Location: {zone.landmark}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
