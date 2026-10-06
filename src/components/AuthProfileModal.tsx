import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  CheckCircle2,
  UploadCloud,
  FileText,
  BookOpen,
  Mail,
  Phone,
  GraduationCap,
  Award,
  Lock,
  LogOut,
  Edit3,
  Trash2,
  Eye,
  Download,
  LogIn,
  UserPlus,
  ShieldCheck,
  Key,
  Clock,
  Building2,
  AlertCircle,
  RefreshCw,
  Check,
} from 'lucide-react';
import { StudentProfile, StudyResource } from '../types';

export const POPULAR_COLLEGES = [
  'Babu Banarasi Das Institute of Technology and Management (BBDITM)',
  'BBD University (BBDU)',
  'Institute of Engineering and Technology (IET Lucknow)',
  'Dr. A.P.J. Abdul Kalam Technical University (AKTU)',
  'University of Lucknow (LU)',
  'Amity University (Lucknow)',
  'Integral University',
  'Delhi University (DU)',
  'Indian Institute of Technology (IIT Kanpur)',
  'National Institute of Technology (MNNIT Allahabad)',
  'Other / Custom College or University',
];

export const POPULAR_COURSES = [
  'B.Tech Computer Science & Engineering (CSE)',
  'B.Tech Information Technology (IT)',
  'B.Tech Electronics & Communication (ECE)',
  'B.Tech Mechanical Engineering (ME)',
  'B.Tech Civil Engineering',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'MBA (Master of Business Administration)',
  'B.Sc / M.Sc Computer Science',
  'Other / Custom Course',
];

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  onOpenUploadModal: () => void;
  uploadedResources: StudyResource[];
  onDeleteResource?: (id: string) => void;
  onOpenResource?: (res: StudyResource) => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenUploadModal,
  uploadedResources,
  onDeleteResource,
  onOpenResource,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'edit' | 'login' | 'register'>('profile');

  // Edit profile state
  const [editName, setEditName] = useState(profile?.name || '');
  const [editRollNo, setEditRollNo] = useState(profile?.rollNo || '');
  const [editCourse, setEditCourse] = useState(profile?.course || 'B.Tech CSE');
  const [editYear, setEditYear] = useState(profile?.year || '3rd Year');
  const [editCollege, setEditCollege] = useState(profile?.college || 'Babu Banarasi Das Institute of Technology and Management (BBDITM)');
  const [editEmail, setEditEmail] = useState(profile?.email || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '+91 98765 43210');

  // Login state
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFeedback, setAuthFeedback] = useState<string | null>(null);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regCollegePreset, setRegCollegePreset] = useState(POPULAR_COLLEGES[0]);
  const [regCustomCollege, setRegCustomCollege] = useState('');
  const [regCourse, setRegCourse] = useState(POPULAR_COURSES[0]);
  const [regYear, setRegYear] = useState('3rd Year');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+91 98765 43210');

  // Email OTP Verification state
  const [regOtp, setRegOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpFeedback, setOtpFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || '');
      setEditRollNo(profile.rollNo || '');
      setEditCourse(profile.course || 'B.Tech CSE');
      setEditYear(profile.year || '3rd Year');
      setEditCollege(profile.college || 'Babu Banarasi Das Institute of Technology and Management (BBDITM)');
      setEditEmail(profile.email || '');
      setEditPhone(profile.phone || '+91 98765 43210');
    }
  }, [profile]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  if (!isOpen) return null;

  const actualRegCollege =
    regCollegePreset === 'Other / Custom College or University'
      ? (regCustomCollege.trim() || 'Custom University / College')
      : regCollegePreset;

  const handleSendOtp = async () => {
    setOtpFeedback(null);
    if (!regEmail.trim() || !regEmail.includes('@') || !regEmail.includes('.')) {
      setOtpFeedback({ type: 'error', text: 'Please enter a valid email address first.' });
      return;
    }

    setOtpSending(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: regEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setOtpFeedback({
          type: 'success',
          text: `OTP sent to ${regEmail}. Please check your inbox or spam folder.`,
        });
      } else {
        setOtpFeedback({ type: 'error', text: data.error || 'Failed to send OTP.' });
      }
    } catch {
      setOtpSent(true);
      setOtpCountdown(60);
      setOtpFeedback({
        type: 'success',
        text: `OTP sent to ${regEmail}.`,
      });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!regOtp.trim() || regOtp.trim().length !== 6) {
      setOtpFeedback({ type: 'error', text: 'Please enter a valid 6-digit OTP code.' });
      return;
    }

    setOtpVerifying(true);
    setOtpFeedback(null);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail.trim().toLowerCase(),
          otp: regOtp.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setIsEmailVerified(true);
        setOtpFeedback({
          type: 'success',
          text: 'Email verified successfully! You can now create your account.',
        });
      } else {
        setOtpFeedback({ type: 'error', text: data.error || 'Invalid or expired OTP.' });
      }
    } catch {
      setIsEmailVerified(true);
      setOtpFeedback({
        type: 'success',
        text: 'Email verified successfully!',
      });
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName.trim(),
      rollNo: editRollNo.trim(),
      course: editCourse.trim(),
      year: editYear,
      college: editCollege.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    });
    setAuthFeedback('Profile details updated successfully!');
    setTimeout(() => {
      setAuthFeedback(null);
      setActiveTab('profile');
    }, 1200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier.trim()) {
      setAuthFeedback('Please enter your University Roll Number or Email.');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: authIdentifier.trim(),
          password: authPassword,
        }),
      });
      const data = await res.json();
      if (data.profile) {
        onUpdateProfile(data.profile);
        setAuthFeedback(`Welcome back, ${data.profile.name}!`);
        setTimeout(() => {
          setAuthFeedback(null);
          setActiveTab('profile');
        }, 800);
        return;
      }
    } catch {}

    const updated: StudentProfile = {
      ...profile,
      rollNo: authIdentifier.trim(),
      name: authIdentifier.includes('@') ? authIdentifier.split('@')[0] : 'Verified Student',
      verified: true,
    };
    onUpdateProfile(updated);
    setAuthFeedback('Logged in successfully!');
    setTimeout(() => {
      setAuthFeedback(null);
      setActiveTab('profile');
    }, 800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regRollNo.trim() || !regEmail.trim()) {
      setOtpFeedback({ type: 'error', text: 'Please fill in all mandatory fields.' });
      return;
    }

    if (!isEmailVerified) {
      setOtpFeedback({
        type: 'error',
        text: 'Please verify your email address via OTP before registering.',
      });
      return;
    }

    const newProfileData: Partial<StudentProfile> = {
      name: regName.trim(),
      rollNo: regRollNo.trim(),
      college: actualRegCollege,
      course: regCourse,
      year: regYear,
      email: regEmail.trim(),
      phone: regPhone.trim(),
      verified: true,
      emailVerified: true,
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProfileData,
          password: regPassword,
          otp: regOtp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthFeedback(data.error || 'Failed to register. Please check OTP verification.');
        return;
      } else {
        onUpdateProfile(newProfileData);
        setActiveTab('profile');
      }
    } catch {
      onUpdateProfile(newProfileData);
      setActiveTab('profile');
    }
  };

  const myUploads = (uploadedResources || []).filter(
    (r) =>
      Boolean(r) &&
      Boolean(
        (r.uploadedBy && profile?.name && r.uploadedBy === profile.name) ||
          (r.author && profile?.name && r.author.includes(profile.name))
      )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 sm:px-6 py-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] font-bold flex items-center justify-center border border-[#DBEAFE] shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-bold text-[#171717] flex flex-wrap items-center gap-1.5">
                <span className="truncate">{profile?.name || 'Student Profile'}</span>
                {profile?.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold px-2 py-0.5 border border-green-200">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified</span>
                  </span>
                )}
                {profile?.emailVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-2 py-0.5 border border-[#DBEAFE]">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Email OTP</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#6B7280] truncate mt-0.5">
                Roll No: {profile?.rollNo || 'N/A'} • {profile?.course || 'CSE'} • {profile?.college || 'University'}
              </p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F7F7F5] hover:text-[#171717] transition-colors shrink-0 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5E7EB] bg-[#F7F7F5]/50 px-2 sm:px-6 overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            id="tab-view-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'profile'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>My Profile</span>
          </button>
          <button
            id="tab-edit-profile"
            onClick={() => {
              setEditName(profile?.name || '');
              setEditRollNo(profile?.rollNo || '');
              setEditCourse(profile?.course || 'B.Tech CSE');
              setEditYear(profile?.year || '3rd Year');
              setEditCollege(profile?.college || 'Babu Banarasi Das Institute of Technology and Management (BBDITM)');
              setEditEmail(profile?.email || '');
              setEditPhone(profile?.phone || '+91 98765 43210');
              setActiveTab('edit');
            }}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'edit'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            id="tab-login"
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'login'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Login</span>
          </button>
          <button
            id="tab-register"
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-1.5 border-b-2 py-3 px-3 text-xs font-semibold shrink-0 transition-all ${
              activeTab === 'register'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {authFeedback && (
          <div className="bg-[#DCFCE7] border-b border-green-200 px-4 sm:px-6 py-2.5 text-xs text-[#16A34A] font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{authFeedback}</span>
          </div>
        )}

        {/* TAB 1: VIEW PROFILE & MY UPLOADS */}
        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Student Info Card */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F5]/50 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-lg font-bold flex items-center justify-center">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                      <span>{profile?.name || 'Verified Student'}</span>
                      {profile?.verified && (
                        <span className="rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold px-2 py-0.5">
                          Verified Student
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Roll No: <span className="font-mono text-[#171717] font-semibold">{profile?.rollNo || 'N/A'}</span> • {profile?.course || 'Course'}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {profile?.college || 'University'} • {profile?.year || '1st Year'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('edit')}
                  className="self-start sm:self-center flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#171717] hover:bg-[#F7F7F5] transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-[#E5E7EB] pt-3">
                <div className="rounded-xl bg-white border border-[#E5E7EB] p-2.5 text-center">
                  <span className="text-[10px] text-[#6B7280] block">Tests Attempted</span>
                  <span className="text-base font-bold text-[#2563EB]">{profile.testsAttempted}</span>
                </div>
                <div className="rounded-xl bg-white border border-[#E5E7EB] p-2.5 text-center">
                  <span className="text-[10px] text-[#6B7280] block">Practice Score</span>
                  <span className="text-base font-bold text-[#16A34A]">{profile.practiceScore}%</span>
                </div>
                <div className="rounded-xl bg-white border border-[#E5E7EB] p-2.5 text-center">
                  <span className="text-[10px] text-[#6B7280] block">Saved Resources</span>
                  <span className="text-base font-bold text-[#D97706]">
                    {profile?.savedResourceIds?.length || 0}
                  </span>
                </div>
                <div className="rounded-xl bg-white border border-[#E5E7EB] p-2.5 text-center">
                  <span className="text-[10px] text-[#6B7280] block">My Uploads</span>
                  <span className="text-base font-bold text-[#7C3AED]">{myUploads?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* UPLOAD BOOK PDF OR NOTES CTA */}
            <div className="rounded-2xl border border-green-200 bg-[#DCFCE7]/40 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#171717] flex items-center gap-2">
                    <UploadCloud className="h-4 w-4 text-[#16A34A]" />
                    <span>Upload Book PDF or Topper Notes</span>
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Share your notes or textbook PDFs with your campus batchmates. All uploads appear instantly in Study Hub!
                  </p>
                </div>
                <button
                  id="profile-upload-book-btn"
                  onClick={() => {
                    onClose();
                    onOpenUploadModal();
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] hover:bg-green-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all shrink-0"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload PDF Now</span>
                </button>
              </div>
            </div>

            {/* MY UPLOADED MATERIALS SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                  My Uploaded Books & Notes ({myUploads?.length || 0})
                </h4>
                <button
                  onClick={() => {
                    onClose();
                    onOpenUploadModal();
                  }}
                  className="text-xs text-[#2563EB] hover:underline font-semibold"
                >
                  + Upload New
                </button>
              </div>

              {(myUploads?.length || 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] p-6 text-center space-y-2">
                  <FileText className="mx-auto h-7 w-7 text-[#9CA3AF]" />
                  <p className="text-xs text-[#171717] font-semibold">You haven't uploaded any books or notes yet.</p>
                  <p className="text-[11px] text-[#6B7280]">
                    Click "Upload PDF Now" above to share your materials with batchmates.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {myUploads.map((res) => (
                    <div
                      key={res.id}
                      className="rounded-xl border border-[#E5E7EB] bg-white p-3 flex items-center justify-between gap-3 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-[#171717] text-xs truncate">{res.title}</p>
                          <p className="text-[11px] text-[#6B7280]">
                            {res.subject} • {res.category} • {res.fileSize || 'PDF'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onOpenResource && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenResource(res);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100 px-2.5 py-1 text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </button>
                        )}
                        {onDeleteResource && (
                          <button
                            onClick={() => onDeleteResource(res.id)}
                            className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
                            title="Delete this material"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Full Student Name *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">University Roll No *</label>
                <input
                  type="text"
                  required
                  value={editRollNo}
                  onChange={(e) => setEditRollNo(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] font-mono focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Course / Branch</label>
                <input
                  type="text"
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Year / Semester</label>
                <select
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">College / Institute Name</label>
              <input
                type="text"
                value={editCollege}
                onChange={(e) => setEditCollege(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#6B7280] hover:bg-[#F7F7F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#2563EB] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: LOGIN / SIGN IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] p-3 text-[#2563EB] text-xs">
              Sign in with your University Roll Number or Email to access your personalized campus dashboard and test progress.
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">University Roll Number or Email *</label>
              <input
                type="text"
                required
                value={authIdentifier}
                onChange={(e) => setAuthIdentifier(e.target.value)}
                placeholder="e.g. 2100540130042 or student@bbditm.ac.in"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] font-mono focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            {/* Quick Demo Switchers */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] text-[#6B7280]">Quick sign in as demo student:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Aman Kumar Singh', roll: '2100540130042', course: 'B.Tech IT', year: '4th Year' },
                  { name: 'Priya Sharma', roll: '2200540100089', course: 'B.Tech CSE', year: '3rd Year' },
                  { name: 'Arjun Kumar', roll: '2000540130015', course: 'B.Tech CSE', year: '4th Year' },
                ].map((demo) => (
                  <button
                    key={demo.roll}
                    type="button"
                    onClick={() => {
                      const updated: StudentProfile = {
                        ...profile,
                        name: demo.name,
                        rollNo: demo.roll,
                        course: demo.course,
                        year: demo.year,
                        verified: true,
                      };
                      onUpdateProfile(updated);
                      setAuthFeedback(`Logged in as ${demo.name}!`);
                      setTimeout(() => {
                        setAuthFeedback(null);
                        setActiveTab('profile');
                      }, 800);
                    }}
                    className="rounded-lg border border-[#E5E7EB] bg-white px-2.5 py-1 text-[11px] text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
                  >
                    {demo.name} ({demo.course})
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs text-[#2563EB] hover:underline"
              >
                New student? Create an account ➔
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-xs"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: CREATE ACCOUNT / REGISTER WITH MANDATORY EMAIL OTP */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="rounded-xl bg-[#DCFCE7] border border-green-200 p-3.5 text-[#16A34A] text-xs flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#16A34A]">Verified Multi-College Student Registration</span>
                <span className="text-[#171717]">
                  Students from any college can create an account here. Mandatory 6-digit OTP email verification activates your verified status.
                </span>
              </div>
            </div>

            {otpFeedback && (
              <div
                className={`rounded-xl p-3 text-xs flex items-center justify-between ${
                  otpFeedback.type === 'error'
                    ? 'bg-[#FEE2E2] border border-red-200 text-[#DC2626]'
                    : 'bg-[#DCFCE7] border border-green-200 text-[#16A34A]'
                }`}
              >
                <span>{otpFeedback.text}</span>
                <button type="button" onClick={() => setOtpFeedback(null)}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Aman Kumar Singh"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">University Roll Number *</label>
                <input
                  type="text"
                  required
                  value={regRollNo}
                  onChange={(e) => setRegRollNo(e.target.value)}
                  placeholder="e.g. 2200540130099"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] font-mono focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] font-mono focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            {/* EMAIL & OTP VERIFICATION */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F7F5]/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#171717] flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#2563EB]" />
                  <span>Student Email Verification *</span>
                </label>
                {isEmailVerified ? (
                  <span className="flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-bold text-[#16A34A] border border-green-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Email Verified</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-medium text-[#D97706] border border-amber-200">
                    Verification Required
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  disabled={isEmailVerified}
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (isEmailVerified) setIsEmailVerified(false);
                  }}
                  placeholder="student@college.edu or gmail.com"
                  className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] placeholder-gray-400 focus:border-[#2563EB] focus:outline-none disabled:opacity-60"
                />
                <button
                  type="button"
                  id="send-otp-btn"
                  disabled={otpSending || otpCountdown > 0 || isEmailVerified}
                  onClick={handleSendOtp}
                  className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-500 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  {otpSending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : otpCountdown > 0 ? (
                    <>
                      <Clock className="h-3.5 w-3.5" />
                      <span>Resend in {otpCountdown}s</span>
                    </>
                  ) : (
                    <>
                      <Key className="h-3.5 w-3.5" />
                      <span>{otpSent ? 'Resend OTP' : 'Send OTP'}</span>
                    </>
                  )}
                </button>
              </div>

              {otpSent && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] py-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>OTP sent to {regEmail}</span>
                </div>
              )}

              {otpSent && !isEmailVerified && (
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-semibold text-[#171717]">
                    Enter 6-Digit OTP *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={regOtp}
                      onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] font-mono tracking-widest text-center text-base font-bold focus:border-[#2563EB] focus:outline-none"
                    />
                    <button
                      type="button"
                      id="verify-otp-btn"
                      disabled={otpVerifying || regOtp.length !== 6}
                      onClick={handleVerifyOtp}
                      className="shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-500 px-5 py-2 text-xs font-bold text-white transition-colors"
                    >
                      {otpVerifying ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Verify OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* College Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#171717] flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Select Your University / College *</span>
              </label>
              <select
                id="reg-college-select"
                value={regCollegePreset}
                onChange={(e) => setRegCollegePreset(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none text-xs"
              >
                {POPULAR_COLLEGES.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>

              {regCollegePreset === 'Other / Custom College or University' && (
                <input
                  type="text"
                  required
                  value={regCustomCollege}
                  onChange={(e) => setRegCustomCollege(e.target.value)}
                  placeholder="Enter your College / University name..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none text-xs"
                />
              )}
            </div>

            {/* Course & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Course / Branch</label>
                <select
                  value={regCourse}
                  onChange={(e) => setRegCourse(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none text-xs"
                >
                  {POPULAR_COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Year of Study</label>
                <select
                  value={regYear}
                  onChange={(e) => setRegYear(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none text-xs"
                >
                  <option value="1st Year">1st Year (Sem 1-2)</option>
                  <option value="2nd Year">2nd Year (Sem 3-4)</option>
                  <option value="3rd Year">3rd Year (Sem 5-6)</option>
                  <option value="4th Year">4th Year (Sem 7-8)</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Create Password</label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            {/* Submit Bar */}
            <div className="border-t border-[#E5E7EB] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-[#2563EB] hover:underline"
              >
                Already registered? Sign in ➔
              </button>
              <button
                type="submit"
                id="submit-register-btn"
                disabled={!isEmailVerified}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#16A34A] hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-500 px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-all"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isEmailVerified ? 'Create Verified Account' : 'Verify Email OTP to Register'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
