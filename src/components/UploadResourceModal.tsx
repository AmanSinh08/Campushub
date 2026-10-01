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

    // Create a local blob URL for preview and download
    const blobUrl = URL.createObjectURL(file);
    setPdfBlobUrl(blobUrl);

    // Estimate pages based on size
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
      id: `user-upload-${Date.now()}`,
      title: title.trim(),
      subject: activeSubject,
      semester: Number(semester),
      course,
      category,
      author: author.trim() || profile.name || 'Campus Student',
      description:
        description.trim() ||
        `Verified curriculum material uploaded by ${profile.name || 'student'}. Covers key semester topics, exam questions, and formulas.`,
      pages: estimatedPages,
      fileSize: fileSizeText,
      downloads: 1,
      saved: true,
      unitsSummary:
        units.length > 0
          ? units
          : [
              'Unit 1: Fundamentals, core definitions & basic properties',
              'Unit 2: System design & standard algorithmic steps',
              'Unit 3: Intermediate formulas & state transitions',
              'Unit 4: University exam questions & recurrent problem sets',
              'Unit 5: Fast revision summary & cheat sheet',
            ],
      sampleContent: description || 'Complete student-uploaded study notes with solved university questions.',
      pdfBlobUrl: pdfBlobUrl || undefined,
      uploadedBy: profile.name || 'Student Contributor',
    };

    // Save to local & call parent handler
    onAddResource(newResource);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Upload Book PDF or Topper Notes</span>
                <span className="rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5">
                  Share with Campus
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Share textbooks, handwritten notes, or formula sheets. Visible instantly to all students!
              </p>
            </div>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* File Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Book PDF / Document
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
                dragActive
                  ? 'border-emerald-400 bg-emerald-950/20'
                  : selectedFile
                  ? 'border-emerald-500/60 bg-emerald-950/10'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.epub"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs sm:text-sm line-clamp-1">{selectedFile.name}</p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{fileSizeText} • Ready to publish</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <UploadCloud className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drag & drop PDF file
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports PDF, DOCX (Max 50MB) • Will be viewable & downloadable in Study Hub
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title of Material *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Operating Systems Unit 1-5 Handwritten Topper Notes"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StudyResourceCategory)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Notes">Topper Notes & Handouts</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Reference Books">Reference Books</option>
                <option value="Authorized Digital Resources">Department Lecture Materials</option>
                <option value="PYQs">PYQs & Solved Papers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {SUBJECT_PRESETS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* If custom subject */}
          {subject === 'Other / Custom Subject' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Custom Subject Name *
              </label>
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Microprocessors 8085 / 8086"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Semester & Course & Estimated Pages */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Course</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="B.Tech CSE/IT">B.Tech CSE/IT</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="All Engineering">All Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pages Count</label>
              <input
                type="number"
                min={1}
                max={2000}
                value={estimatedPages}
                onChange={(e) => setEstimatedPages(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Author / Contributor Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Aman Singh (Batch Topper 9.4 CGPA)"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & What is Included
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Neat handwritten notes with university question breakdowns, AVL tree rotation dry-runs, and formula sheet."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Unit Summaries */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Key Unit Coverage (Optional, 1 per line)
            </label>
            <textarea
              rows={2}
              value={unitsSummaryInput}
              onChange={(e) => setUnitsSummaryInput(e.target.value)}
              placeholder={"Unit 1: Introduction & State Invariants\nUnit 2: Standard Algorithm Steps\nUnit 3: Recurrent Exam Questions"}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-white placeholder-slate-500 font-mono text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Will be visible to all students immediately</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all active:scale-95 disabled:opacity-50"
              >
                <BookOpen className="h-4 w-4" />
                <span>Publish to Study Hub</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
