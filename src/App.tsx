import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { MarketplaceView } from './components/MarketplaceView';
import { StudyHubView } from './components/StudyHubView';
import { PYQBankView } from './components/PYQBankView';
import { AIStudyAssistantView } from './components/AIStudyAssistantView';
import { PracticeEngineView } from './components/PracticeEngineView';
import { DashboardView } from './components/DashboardView';
import { TrustSafetyView } from './components/TrustSafetyView';
import { UploadResourceModal } from './components/UploadResourceModal';
import { AuthProfileModal } from './components/AuthProfileModal';
import { NewListingModal } from './components/NewListingModal';
import {
  ActiveTab,
  MarketplaceItem,
  StudyResource,
  ResourceComment,
  PYQPaper,
  StudentProfile,
  QuizResult,
} from './types';
import {
  INITIAL_MARKETPLACE_ITEMS,
  STUDY_RESOURCES,
  PYQ_PAPERS,
  DEFAULT_STUDENT_PROFILE,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  
  // Persistent items
  const [items, setItems] = useState<MarketplaceItem[]>(() => {
    try {
      const saved = localStorage.getItem('campushub_marketplace_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MARKETPLACE_ITEMS;
  });

  // Persistent resources
  const [resources, setResources] = useState<StudyResource[]>(() => {
    try {
      const saved = localStorage.getItem('campushub_uploaded_resources');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((r: any) => r.id));
          return [...parsed, ...STUDY_RESOURCES.filter((sr) => !existingIds.has(sr.id))];
        }
      }
    } catch {}
    return STUDY_RESOURCES;
  });

  const [papers] = useState<PYQPaper[]>(PYQ_PAPERS);

  // Helper to ensure profile always has valid safe fields
  const sanitizeProfile = (p: Partial<StudentProfile>): StudentProfile => ({
    ...DEFAULT_STUDENT_PROFILE,
    ...p,
    savedResourceIds: Array.isArray(p.savedResourceIds)
      ? p.savedResourceIds
      : DEFAULT_STUDENT_PROFILE.savedResourceIds,
    savedPYQIds: Array.isArray(p.savedPYQIds)
      ? p.savedPYQIds
      : DEFAULT_STUDENT_PROFILE.savedPYQIds,
    uploadedResourceIds: Array.isArray(p.uploadedResourceIds)
      ? p.uploadedResourceIds
      : [],
  });

  // Persistent profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('campushub_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rollNo) return sanitizeProfile(parsed);
      }
    } catch {}
    return DEFAULT_STUDENT_PROFILE;
  });

  // Persistent bookmarks
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('campushub_saved_resource_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return ['res-1', 'res-3'];
  });

  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isUploadResourceModalOpen, setIsUploadResourceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [practiceInitialTopic, setPracticeInitialTopic] = useState<string>(
    'Computer Networks — TCP/IP'
  );

  // Sync profile to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('campushub_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Sync saved bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campushub_saved_resource_ids', JSON.stringify(savedResourceIds));
    } catch {}
  }, [savedResourceIds]);

  // Fetch live marketplace items from backend
  useEffect(() => {
    fetch('/api/marketplace')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
          try {
            localStorage.setItem('campushub_marketplace_items', JSON.stringify(data));
          } catch {}
        } else if (data && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
          try {
            localStorage.setItem('campushub_marketplace_items', JSON.stringify(data.items));
          } catch {}
        }
      })
      .catch(() => {
        // Fallback to local storage state
      });
  }, []);

  // Fetch live uploaded study resources from backend
  useEffect(() => {
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => {
        const serverItems = Array.isArray(data) ? data : data?.resources;
        if (Array.isArray(serverItems) && serverItems.length > 0) {
          setResources((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newResources = serverItems.filter((item: StudyResource) => !existingIds.has(item.id));
            const combined = [...newResources, ...prev];
            try {
              const uploadsOnly = combined.filter((r) => r.id.startsWith('res-') && Number(r.id.replace('res-', '')) > 100);
              localStorage.setItem('campushub_uploaded_resources', JSON.stringify(uploadsOnly));
            } catch {}
            return combined;
          });
        }
      })
      .catch(() => {
        // Fallback to initial study resources
      });
  }, []);

  // Fetch live resource feedback & ratings from backend
  useEffect(() => {
    fetch('/api/resources/feedback')
      .then((res) => res.json())
      .then((feedbackMap) => {
        if (feedbackMap && typeof feedbackMap === 'object') {
          setResources((prev) =>
            prev.map((r) => {
              const fb = feedbackMap[r.id];
              if (fb && Array.isArray(fb.comments)) {
                return {
                  ...r,
                  rating: fb.rating ?? r.rating,
                  ratingsCount: fb.ratingsCount ?? r.ratingsCount,
                  comments: fb.comments,
                };
              }
              return r;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  // Study Resource Handlers (Book / Notes / PDF upload & delete)
  const handleAddResource = async (newResource: StudyResource) => {
    setResources((prev) => {
      const updated = [newResource, ...prev];
      try {
        const raw = localStorage.getItem('campushub_uploaded_resources');
        const list = raw ? JSON.parse(raw) : [];
        localStorage.setItem('campushub_uploaded_resources', JSON.stringify([newResource, ...list]));
      } catch {}
      return updated;
    });

    setProfile((prev) => {
      const updatedProfile = {
        ...prev,
        uploadedResourceIds: [...(prev.uploadedResourceIds || []), newResource.id],
      };
      try {
        localStorage.setItem('campushub_profile', JSON.stringify(updatedProfile));
      } catch {}
      return updatedProfile;
    });

    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource),
      });
    } catch {
      // Retained in local storage state
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    setResources((prev) => {
      const updated = prev.filter((r) => r.id !== resourceId);
      try {
        const raw = localStorage.getItem('campushub_uploaded_resources');
        if (raw) {
          const list = JSON.parse(raw);
          localStorage.setItem(
            'campushub_uploaded_resources',
            JSON.stringify(list.filter((r: any) => r.id !== resourceId))
          );
        }
      } catch {}
      return updated;
    });

    setProfile((prev) => {
      const updatedProfile = {
        ...prev,
        uploadedResourceIds: (prev.uploadedResourceIds || []).filter((id) => id !== resourceId),
      };
      try {
        localStorage.setItem('campushub_profile', JSON.stringify(updatedProfile));
      } catch {}
      return updatedProfile;
    });

    try {
      await fetch(`/api/resources/${encodeURIComponent(resourceId)}`, {
        method: 'DELETE',
      });
    } catch {
      // Completed locally
    }
  };

  const handleAddResourceComment = async (
    resourceId: string,
    data: { rating: number; comment: string; tag?: string }
  ) => {
    const newComment: ResourceComment = {
      id: `comm-${Date.now()}`,
      resourceId,
      authorName: profile.name || 'Verified Student',
      authorRoll: profile.rollNo || '2200540130000',
      authorBranch: profile.course || 'B.Tech CSE',
      authorYear: profile.year || '3rd Year',
      rating: data.rating,
      comment: data.comment,
      tag: data.tag,
      createdAt: 'Just now',
      helpfulCount: 0,
    };

    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId) {
          const updated = [newComment, ...(r.comments || [])];
          const sum = updated.reduce((acc, c) => acc + (c.rating || 5), 0);
          const avg = Number((sum / updated.length).toFixed(1));
          return {
            ...r,
            rating: avg,
            ratingsCount: updated.length,
            comments: updated,
          };
        }
        return r;
      })
    );

    // Sync to local storage
    try {
      const raw = localStorage.getItem('campushub_resource_feedback');
      const existing = raw ? JSON.parse(raw) : {};
      existing[resourceId] = [newComment, ...(existing[resourceId] || [])];
      localStorage.setItem('campushub_resource_feedback', JSON.stringify(existing));
    } catch {}

    // Sync to backend API
    try {
      await fetch(`/api/resources/${encodeURIComponent(resourceId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: profile.name,
          authorRoll: profile.rollNo,
          authorBranch: profile.course,
          authorYear: profile.year,
          rating: data.rating,
          comment: data.comment,
          tag: data.tag,
        }),
      });
    } catch {}
  };

  const handleLikeResourceComment = async (resourceId: string, commentId: string) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id === resourceId && r.comments) {
          return {
            ...r,
            comments: r.comments.map((c) =>
              c.id === commentId ? { ...c, helpfulCount: (c.helpfulCount || 0) + 1 } : c
            ),
          };
        }
        return r;
      })
    );

    try {
      await fetch(`/api/resources/${encodeURIComponent(resourceId)}/comments/${encodeURIComponent(commentId)}/like`, {
        method: 'POST',
      });
    } catch {}
  };

  // Marketplace Handlers
  const handleAddItem = async (newItemData: Partial<MarketplaceItem>) => {
    try {
      const res = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });
      const data = await res.json();
      const createdItem: MarketplaceItem = data?.item ? data.item : data;
      if (createdItem && (createdItem.id || createdItem.title)) {
        // Ensure price is a clean number
        const cleanItem: MarketplaceItem = {
          ...createdItem,
          price: Number(createdItem.price ?? newItemData.price ?? 100),
        };
        setItems((prev) => {
          const updated = [cleanItem, ...prev];
          try {
            localStorage.setItem('campushub_marketplace_items', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        return;
      }
    } catch {
      // Fallback below
    }

    // Local fallback
    const fallbackItem: MarketplaceItem = {
      id: `item-${Date.now()}`,
      title: newItemData.title || 'Untitled Item',
      price: Number(newItemData.price) || 100,
      category: newItemData.category || 'Books & Notes',
      condition: newItemData.condition || 'Good',
      location: newItemData.location || 'Campus Hostel',
      description: newItemData.description || '',
      imageUrl:
        newItemData.imageUrl ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      sellerName: profile.name,
      sellerRoll: profile.rollNo,
      sellerBranch: profile.course,
      sellerYear: profile.year,
      sellerRating: 5.0,
      sellerReviewsCount: 1,
      sellerVerified: true,
      contactPhone: newItemData.contactPhone || '+91 98765 43210',
      status: 'available',
      createdAt: 'Just now',
    };
    setItems((prev) => {
      const updated = [fallbackItem, ...prev];
      try {
        localStorage.setItem('campushub_marketplace_items', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleStatus = async (id: string, newStatus: 'available' | 'sold') => {
    try {
      await fetch(`/api/marketplace/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // Ignored
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleAddReview = async (id: string, rating: number, comment: string) => {
    try {
      await fetch(`/api/marketplace/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
    } catch (e) {
      // Ignored
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newCount = item.sellerReviewsCount + 1;
          const newRating = Number(
            ((item.sellerRating * item.sellerReviewsCount + rating) / newCount).toFixed(1)
          );
          return {
            ...item,
            sellerRating: newRating,
            sellerReviewsCount: newCount,
          };
        }
        return item;
      })
    );
  };

  const handleReportItem = async (id: string, reason: string) => {
    try {
      await fetch(`/api/marketplace/${id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      alert('Listing reported for moderator review. Thank you for keeping CampusHub safe!');
    } catch (e) {
      alert('Report submitted.');
    }
  };

  // Study Hub Handlers
  const handleToggleSaveResource = (id: string) => {
    setSavedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((rId) => rId !== id) : [...prev, id]
    );
  };

  // Practice & AI Handlers
  const handleUpdateDashboardStats = (result: QuizResult | number, primaryWeakArea?: string) => {
    const score = typeof result === 'number' ? result : result.percentage;
    const weakArea = typeof result === 'number' ? primaryWeakArea : (result.primaryWeakArea || primaryWeakArea);

    setProfile((prev) => {
      const newTests = prev.testsAttempted + 1;
      const newAvg = Math.round(
        (prev.practiceScore * prev.testsAttempted + score) / newTests
      );
      return {
        ...prev,
        testsAttempted: newTests,
        practiceScore: newAvg,
        weakArea: weakArea || prev.weakArea,
        focusWeakTopic: weakArea || prev.focusWeakTopic,
      };
    });
  };

  const handleStartMockTestFromPYQ = (paper: PYQPaper) => {
    setPracticeInitialTopic(`${paper.subject} — ${paper.year} Exam Simulation`);
    setActiveTab('practice-engine');
  };

  const handleLaunchPracticeWithTopic = (topic: string) => {
    setPracticeInitialTopic(topic);
    setActiveTab('practice-engine');
  };

  // Filter items for dashboard view
  const myListings = (items || []).filter(
    (i) => i.sellerName === profile?.name || i.sellerName === 'Arjun Sharma'
  );
  const savedResources = (resources || []).filter((r) => (savedResourceIds || []).includes(r.id));

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#171717] flex flex-col selection:bg-[#2563EB] selection:text-white">
      {/* Top / Left Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenNewListing={() => setIsNewListingModalOpen(true)}
        profile={profile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenUploadModal={() => setIsUploadResourceModalOpen(true)}
      />

      {/* Main Content Area (Offset by desktop sidebar w-64) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-20 lg:pb-12 lg:pl-72">
        {activeTab === 'overview' && (
          <OverviewView onNavigate={setActiveTab} />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            items={items}
            profile={profile}
            onAddItem={handleAddItem}
            onToggleStatus={handleToggleStatus}
            onAddReview={handleAddReview}
            onReportItem={handleReportItem}
            onOpenNewListing={() => setIsNewListingModalOpen(true)}
          />
        )}

        {activeTab === 'study-hub' && (
          <StudyHubView
            resources={resources}
            savedResourceIds={savedResourceIds}
            onToggleSaveResource={handleToggleSaveResource}
            onNavigate={setActiveTab}
            onOpenUploadModal={() => setIsUploadResourceModalOpen(true)}
            profile={profile}
            onAddResourceComment={handleAddResourceComment}
            onLikeResourceComment={handleLikeResourceComment}
          />
        )}

        {activeTab === 'pyq-bank' && (
          <PYQBankView
            papers={papers}
            onStartMockTestFromPYQ={handleStartMockTestFromPYQ}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AIStudyAssistantView
            onNavigate={setActiveTab}
            onLaunchPracticeWithTopic={handleLaunchPracticeWithTopic}
          />
        )}

        {activeTab === 'practice-engine' && (
          <PracticeEngineView
            initialTopic={practiceInitialTopic}
            onUpdateDashboardStats={handleUpdateDashboardStats}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            myListings={myListings}
            savedResources={savedResources}
            onNavigate={setActiveTab}
            onToggleStatus={handleToggleStatus}
            uploadedResources={resources}
            onOpenUploadModal={() => setIsUploadResourceModalOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'trust-safety' && (
          <TrustSafetyView />
        )}
      </main>

      {/* Sell Item / Create Campus Listing Modal */}
      <NewListingModal
        isOpen={isNewListingModalOpen}
        onClose={() => setIsNewListingModalOpen(false)}
        profile={profile}
        onAddItem={handleAddItem}
        onSuccess={() => {
          setActiveTab('marketplace');
        }}
      />

      {/* Upload Resource (Book/Notes/PYQ) Modal */}
      <UploadResourceModal
        isOpen={isUploadResourceModalOpen}
        onClose={() => setIsUploadResourceModalOpen(false)}
        profile={profile}
        onAddResource={handleAddResource}
      />

      {/* Auth / Profile & Uploads Management Modal */}
      <AuthProfileModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(sanitizeProfile(updated))}
        onOpenUploadModal={() => {
          setIsAuthModalOpen(false);
          setIsUploadResourceModalOpen(true);
        }}
        uploadedResources={(resources || []).filter(
          (r) =>
            profile?.uploadedResourceIds?.includes(r.id) ||
            (r.author && profile?.name && r.author.toLowerCase().includes(profile.name.toLowerCase()))
        )}
        onDeleteResource={handleDeleteResource}
        onOpenResource={() => {
          setIsAuthModalOpen(false);
          setActiveTab('study-hub');
        }}
      />

      {/* Minimalist Light Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-6 text-xs text-[#6B7280] lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#171717]">
                Campus<span className="text-[#2563EB]">Hub</span> — Student Productivity Ecosystem
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Marketplace • Study Hub • AI Solutions • Exam Simulator
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px]">
              <button onClick={() => setActiveTab('overview')} className="hover:text-[#2563EB]">Overview</button>
              <button onClick={() => setActiveTab('marketplace')} className="hover:text-[#2563EB]">Marketplace</button>
              <button onClick={() => setActiveTab('study-hub')} className="hover:text-[#2563EB]">Study Hub</button>
              <button onClick={() => setActiveTab('practice-engine')} className="hover:text-[#2563EB]">Practice</button>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#2563EB]">Dashboard</button>
              <button onClick={() => setActiveTab('trust-safety')} className="hover:text-[#2563EB]">Trust & Safety</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
