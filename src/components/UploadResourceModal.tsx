import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { StudyResource, StudyResourceCategory, StudentProfile } from '../types';

interface UploadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onAddResource: (newResource: StudyResource) => void;
  defaultCategory?: StudyResourceCategory;
}

export const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  isOpen,
  onClose,
  profile,
  onAddResource,
  defaultCategory = 'Notes',
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Database Management Systems (DBMS)');
  const [customSubject, setCustomSubject] = useState('');
  const [category, setCategory] = useState<StudyResourceCategory>(defaultCategory);
  const [course, setCourse] = useState(profile.course || 'B.Tech CSE/IT');
  const [semester, setSemester] = useState<number>(3);
  const [author, setAuthor] = useState(profile.name ? `${profile.name} (${profile.course})` : 'College Student');
  const [description, setDescription] = useState('');
  const [unitsSummaryInput, setUnitsSummaryInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileSizeText, setFileSizeText] = useState('12.5 MB');
  const [estimatedPages, setEstimatedPages] = useState<number>(45);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const SUBJECT_PRESETS = [
    'Database Management Systems (DBMS)',
    'Data Structures & Algorithms (DSA)',
    'Computer Networks (CN)',
    'Operating Systems (OS)',
    'Discrete Mathematics (DM)',
    'Software Engineering (SE)',
    'Compiler Design',
    'Theory of Computation (Automata)',
    'Computer Organization & Architecture (COA)',
    'Other / Custom Subject',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSizeText(`${sizeInMb} MB`);

    const blobUrl = URL.createObjectURL(file);
    setPdfBlobUrl(blobUrl);

    const est = Math.max(12, Math.min(250, Math.round(file.size / (80 * 1024))));
    setEstimatedPages(est);

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const activeSubject = subject === 'Other / Custom Subject' ? customSubject.trim() : subject;

    if (!title.trim()) {
      setErrorMsg('Please enter a title for the study material.');
      return;
    }
    if (!activeSubject) {
      setErrorMsg('Please select or specify a subject.');
      return;
    }

    setIsSubmitting(true);

    const units = unitsSummaryInput
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const newResource: StudyResource = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      subject: activeSubject,
      semester,
      course,
      category,
      author: author.trim() || profile.name || 'Verified Student',
      description:
        description.trim() ||
        `Verified curriculum study notes covering comprehensive syllabus topics, numerical proofs, and exam preparation guides.`,
      pages: estimatedPages,
      fileSize: fileSizeText,
      downloads: 1,
      saved: false,
      unitsSummary: units.length > 0 ? units : [`Unit 1: ${activeSubject} Fundamentals`, 'Unit 2: Core Concepts & Formulas', 'Unit 3: Exam Numericals'],
      pdfBlobUrl: pdfBlobUrl || undefined,
      uploadedBy: profile.name,
      rating: 5.0,
      ratingsCount: 1,
      comments: [
        {
          id: `comm-init-${Date.now()}`,
          resourceId: `res-${Date.now()}`,
          authorName: profile.name || 'Uploader',
          authorRoll: profile.rollNo || 'Verified',
          authorBranch: profile.course,
          rating: 5,
          comment: 'Uploaded genuine semester study notes.',
          tag: 'Topper Notes',
          createdAt: 'Just now',
          helpfulCount: 0,
        },
      ],
    };

    try {
      onAddResource(newResource);
      setIsSubmitting(false);
      onClose();
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Error saving resource.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 sm:px-6 py-4 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#171717]">
                Share Study Material or Book PDF
              </h3>
              <p className="text-xs text-[#6B7280]">
                Uploaded materials appear in the Study Hub for campus students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F7F7F5] hover:text-[#171717]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="rounded-xl border border-red-200 bg-[#FEE2E2] p-3 text-xs text-[#DC2626] flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* File Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all ${
              dragActive
                ? 'border-[#2563EB] bg-[#EFF6FF]'
                : 'border-[#E5E7EB] bg-[#F7F7F5]/50 hover:bg-[#F7F7F5] hover:border-gray-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#171717]">{selectedFile.name}</p>
                  <p className="text-[11px] text-[#6B7280]">
                    {fileSizeText} • Approx {estimatedPages} pages • Ready to upload
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <UploadCloud className="h-8 w-8 text-[#2563EB] mx-auto" />
                <p className="text-xs font-bold text-[#171717]">
                  Drag and drop your PDF book / notes here, or <span className="text-[#2563EB] underline">browse</span>
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  Supports PDF, Word and lecture notes (Up to 50MB)
                </p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Database Systems Complete Handwritten Topper Notes (Unit 1 to 5)"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Subject & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
              >
                {SUBJECT_PRESETS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {subject === 'Other / Custom Subject' && (
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Enter specific subject name..."
                  className="mt-1.5 w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">
                Resource Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StudyResourceCategory)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Notes">Handwritten Notes / Topper Notes</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Reference Books">Reference Books</option>
                <option value="Authorized Digital Resources">Digital Notes / Formula Sheet</option>
                <option value="PYQs">Previous Year Question Solutions</option>
              </select>
            </div>
          </div>

          {/* Course & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Course</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. B.Tech CSE / IT"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight key units, solved numericals, and syllabus coverage..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280] hover:bg-[#F7F7F5]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {isSubmitting ? 'Uploading...' : 'Publish to Study Hub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
