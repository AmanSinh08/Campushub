export type MarketplaceCategory =
  | 'Books & Notes'
  | 'Calculators & Stationery'
  | 'Fans, Tables, Chairs & Lamps'
  | 'Cycles & Accessories'
  | 'Headphones, Keyboards & Monitors'
  | 'Bags, Sports Items & Essentials';

export type ItemCondition = 'Like New' | 'Good' | 'Fair';

export interface ListingReview {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  category: MarketplaceCategory;
  condition: ItemCondition;
  sellerName: string;
  sellerRoll: string;
  sellerBranch: string;
  sellerYear: string;
  sellerCollege?: string;
  sellerCity?: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerReviewsCount: number;
  location: string;
  description: string;
  imageUrl: string;
  status: 'available' | 'sold';
  createdAt: string;
  contactPhone?: string;
  reviews?: ListingReview[];
}

export type StudyResourceCategory =
  | 'Textbooks'
  | 'Reference Books'
  | 'Notes'
  | 'Authorized Digital Resources'
  | 'PYQs'
  | 'AI Practice';

export interface BookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
  pagesRange: string;
  keyTopics: string[];
  formulas?: string[];
  examQuestions?: string[];
  content: string;
}

export interface ResourceComment {
  id: string;
  resourceId: string;
  authorName: string;
  authorRoll: string;
  authorBranch?: string;
  authorYear?: string;
  rating: number; // 1 to 5
  comment: string;
  tag?: string; // e.g., 'Exam Prep', 'Clear Proofs', 'Must Read', 'Topper Notes', 'Syllabus Aligned'
  createdAt: string;
  helpfulCount: number;
}

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  semester: number;
  course: string;
  category: StudyResourceCategory;
  author: string;
  description: string;
  pages?: number;
  fileSize?: string;
  downloads: number;
  saved?: boolean;
  unitsSummary?: string[];
  sampleContent?: string;
  chapters?: BookChapter[];
  pdfBlobUrl?: string;
  uploadedBy?: string;
  rating?: number;
  ratingsCount?: number;
  comments?: ResourceComment[];
}

export interface PYQQuestion {
  id: string;
  qNumber: number;
  text: string;
  marks: number;
  topic: string;
  defaultAnswer?: string;
}

export interface PYQPaper {
  id: string;
  course: string;
  semester: number;
  subject: string;
  year: number;
  examType: 'End-Sem' | 'Mid-Sem / Sessional';
  durationMinutes: number;
  totalMarks: number;
  questions: PYQQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  weakAreas: string[];
  primaryWeakArea?: string;
  strengths: string[];
  feedback: string;
  remedyAction: string;
}

export interface StudentProfile {
  name: string;
  rollNo: string;
  course: string;
  year: string;
  college: string;
  email: string;
  phone?: string;
  verified: boolean;
  emailVerified?: boolean;
  savedResourceIds: string[];
  savedPYQIds: string[];
  uploadedResourceIds?: string[];
  testsAttempted: number;
  averageScore: number;
  practiceScore: number;
  weakArea: string;
  pyqsSolvedCount: number;
  focusWeakTopic: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'listing' | 'resource';
  targetId: string;
  targetTitle: string;
  reason: string;
  reporterName: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export type ActiveTab =
  | 'overview'
  | 'marketplace'
  | 'study-hub'
  | 'pyq-bank'
  | 'ai-assistant'
  | 'practice-engine'
  | 'dashboard'
  | 'trust-safety'
  | 'governance';
