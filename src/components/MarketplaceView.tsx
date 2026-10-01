import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  MessageSquare,
  Flag,
  Share2,
  Tag,
  Check,
  Send,
  X,
  Filter,
  Building2,
  Compass,
  Globe,
} from 'lucide-react';
import { MarketplaceItem, MarketplaceCategory, ItemCondition, StudentProfile } from '../types';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  profile: StudentProfile;
  onAddItem: (newItem: Partial<MarketplaceItem>) => Promise<void>;
  onToggleStatus: (id: string, newStatus: 'available' | 'sold') => Promise<void>;
  onAddReview: (id: string, rating: number, comment: string) => Promise<void>;
  onReportItem: (id: string, reason: string) => Promise<void>;
  onOpenNewListing: () => void;
}

const CATEGORIES: MarketplaceCategory[] = [
  'Books & Notes',
  'Calculators & Stationery',
  'Fans, Tables, Chairs & Lamps',
  'Cycles & Accessories',
  'Headphones, Keyboards & Monitors',
  'Bags, Sports Items & Essentials',
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items = [],
  profile,
  onAddItem,
  onToggleStatus,
  onAddReview,
  onReportItem,
  onOpenNewListing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Multi-college / campus scope state
  const [campusScope, setCampusScope] = useState<'all' | 'my_college' | 'nearby' | 'custom'>('all');
  const [customCollegeFilter, setCustomCollegeFilter] = useState<string>('All');

  // Modals state
  const [contactModalItem, setContactModalItem] = useState<MarketplaceItem | null>(null);
  const [reviewModalItem, setReviewModalItem] = useState<MarketplaceItem | null>(null);
  const [reportModalItem, setReportModalItem] = useState<MarketplaceItem | null>(null);

  // Contact chat form
  const [chatMessage, setChatMessage] = useState<string>('Hi! Is this item still available for pickup on campus?');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'me' | 'seller'; text: string; time: string }>>([
    { sender: 'seller', text: 'Hey! Yes, available. When do you want to inspect it?', time: '2m ago' },
  ]);

  // Review form
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Report form
  const [reportReason, setReportReason] = useState<string>('');

  // Helper to extract student college shortname / identity
  const userCollege = (profile?.college || 'BBDITM').trim().toLowerCase();

  // Distinct list of colleges present in items
  const availableColleges = Array.from(
    new Set(
      (items || [])
        .map((i) => i?.sellerCollege?.trim())
        .filter(Boolean) as string[]
    )
  );

  // Helper to check if an item matches user's college
  const isItemMyCollege = (item: MarketplaceItem) => {
    if (!item?.sellerCollege) return true;
    const itemCol = item.sellerCollege.toLowerCase();
    if (userCollege && itemCol.includes(userCollege)) return true;
    if (userCollege.includes('bbd') && itemCol.includes('bbd')) return true;
    if (userCollege.includes('iet') && itemCol.includes('iet')) return true;
    if (userCollege.includes('aktu') && itemCol.includes('aktu')) return true;
    if (userCollege.includes('lucknow') && itemCol.includes('lucknow')) return true;
    return itemCol === userCollege;
  };

  // Helper to check if an item is nearby (same city or regional)
  const isItemNearby = (item: MarketplaceItem) => {
    if (!item) return false;
    // Items with Lucknow city or location
    const city = (item.sellerCity || '').toLowerCase();
    const loc = (item.location || '').toLowerCase();
    const col = (item.sellerCollege || '').toLowerCase();
    return (
      city.includes('lucknow') ||
      loc.includes('lucknow') ||
      loc.includes('hostel') ||
      loc.includes('campus') ||
      col.includes('bbd') ||
      col.includes('iet') ||
      col.includes('aktu') ||
      col.includes('amity') ||
      col.includes('integral')
    );
  };

  // Filter items
  const filteredItems = (items || []).filter((item) => {
    if (!item) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedCondition !== 'All' && item.condition !== selectedCondition) return false;
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;

    // Campus Scope Filtering
    if (campusScope === 'my_college') {
      if (!isItemMyCollege(item)) return false;
    } else if (campusScope === 'nearby') {
      if (!isItemNearby(item)) return false;
    } else if (campusScope === 'custom' && customCollegeFilter !== 'All') {
      if (!item.sellerCollege || !item.sellerCollege.toLowerCase().includes(customCollegeFilter.toLowerCase())) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      const matchSeller = (item.sellerName || '').toLowerCase().includes(q);
      const matchCollege = (item.sellerCollege || '').toLowerCase().includes(q);
      const matchCity = (item.sellerCity || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchSeller && !matchCollege && !matchCity) return false;
    }
    return true;
  });

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: 'me', text: chatMessage.trim(), time: 'Just now' },
    ]);
    const currentMsg = chatMessage;
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'seller',
          text: `Great! Let's meet at ${contactModalItem?.location || 'Campus Canteen'} after classes today around 5:30 PM. Call me if needed!`,
          time: 'Just now',
        },
      ]);
    }, 900);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem) return;
    await onAddReview(reviewModalItem.id, reviewRating, reviewComment || 'Verified campus transaction. Item as described!');
    setReviewModalItem(null);
    setReviewComment('');
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalItem) return;
    await onReportItem(reportModalItem.id, reportReason || 'Price check / Inappropriate content');
    setReportModalItem(null);
    setReportReason('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header section with Slide 5 Workflow */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">CAMPUS COMMERCE</span>
              <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-800/60">
                Simple • Local • Affordable
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Student Marketplace</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Buy & sell books, cycles, electronics, fans, desks and hostel essentials directly with verified campus peers.
            </p>
          </div>

          <button
            id="create-listing-btn"
            onClick={onOpenNewListing}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Listing</span>
          </button>
        </div>

        {/* Slide 5: 6-Step Workflow Banner */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            HOW MARKETPLACE WORKS (6-STEP WORKFLOW)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { num: '1', title: 'Create Profile', desc: 'Verified student ID / college roll' },
              { num: '2', title: 'Create Listing', desc: 'Photos, price, condition & hostel location' },
              { num: '3', title: 'Search', desc: 'Peers discover by category & budget' },
              { num: '4', title: 'Contact', desc: 'Direct instant on-platform chat' },
              { num: '5', title: 'Deal / Pickup', desc: 'Safe handoff at hostel or canteen' },
              { num: '6', title: 'Review', desc: 'Rate seller & build campus trust' },
            ].map((step) => (
              <div
                key={step.num}
                className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 flex flex-col justify-between"
              >
                <div>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-900/60 text-[10px] font-bold text-cyan-300">
                    {step.num}
                  </span>
                  <p className="text-xs font-semibold text-white mt-1.5">{step.title}</p>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Campus & College Scope Filter Bar (USER INTENT REQUIREMENT) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Campus & College Location Filter
              </span>
              <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-800/60">
                Active: {campusScope === 'my_college' ? 'My College Only' : campusScope === 'nearby' ? 'Nearby Campuses' : campusScope === 'custom' ? customCollegeFilter : 'All Colleges'}
              </span>
            </div>

            {/* Quick Scope Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                id="filter-my-college-btn"
                type="button"
                onClick={() => {
                  setCampusScope('my_college');
                  setCustomCollegeFilter('All');
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  campusScope === 'my_college'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-emerald-300" />
                <span>My College ({profile?.college ? (profile.college.includes('BBD') ? 'BBD' : profile.college.slice(0, 16) + '...') : 'Campus'})</span>
              </button>

              <button
                id="filter-nearby-colleges-btn"
                type="button"
                onClick={() => {
                  setCampusScope('nearby');
                  setCustomCollegeFilter('All');
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  campusScope === 'nearby'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Compass className="h-3.5 w-3.5 text-cyan-300" />
                <span>Nearby Colleges</span>
              </button>

              <button
                id="filter-all-colleges-btn"
                type="button"
                onClick={() => {
                  setCampusScope('all');
                  setCustomCollegeFilter('All');
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  campusScope === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-indigo-300" />
                <span>All Universities</span>
              </button>
            </div>
          </div>

          {/* Specific College Selector Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 shrink-0">Or filter by specific College / University:</span>
            <select
              id="specific-college-select"
              value={customCollegeFilter}
              onChange={(e) => {
                const val = e.target.value;
                setCustomCollegeFilter(val);
                if (val === 'All') {
                  setCampusScope('all');
                } else {
                  setCampusScope('custom');
                }
              }}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All Campuses & Colleges (Showing items everywhere)</option>
              {availableColleges.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search input & status filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="marketplace-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, cycles, fans, study tables, calculators, or hostel rooms..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="condition-filter-select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>

            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="available">Available Only</option>
              <option value="sold">Sold Items</option>
            </select>
          </div>
        </div>

        {/* 6 Category Pills from Slide 4 */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-900/40'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
            }`}
          >
            All Categories ({items?.length || 0})
          </button>
          {CATEGORIES.map((cat) => {
            const count = (items || []).filter((i) => i && i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-900/40'
                    : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <p className="text-xs font-medium text-slate-400">
            Showing <span className="font-semibold text-white">{filteredItems?.length || 0}</span> campus listings
          </p>
          {statusFilter !== 'All' && (
            <span className="text-xs text-cyan-400 font-medium">Filtering by status: {statusFilter}</span>
          )}
        </div>

        {(filteredItems?.length || 0) === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
            <Tag className="h-10 w-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">No items found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords or category filters, or be the first to sell this item to your peers!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCondition('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="mt-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const isSeller = Boolean(item?.sellerName && profile?.name && item.sellerName === profile.name);
              return (
                <div
                  key={item.id}
                  id={`marketplace-card-${item.id}`}
                  className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-950/20"
                >
                  {/* Image & Badges */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    {/* Condition badge */}
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-slate-200 border border-slate-700">
                      {item.condition}
                    </span>

                    {/* Status badge */}
                    {item.status === 'sold' ? (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-rose-600/90 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                        SOLD
                      </span>
                    ) : (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        AVAILABLE
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2.5">
                      <span className="rounded-lg bg-slate-950/90 backdrop-blur-sm px-2 py-0.5 text-xs font-extrabold text-cyan-400 border border-slate-800">
                        ₹{(Number(item.price ?? 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                        {item.category}
                      </p>
                      <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Location & Seller info with College tags */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-2.5">
                      {/* College & Campus Match Badge */}
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-300 truncate" title={item.sellerCollege || 'Campus'}>
                          <Building2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate font-medium">
                            {item.sellerCollege
                              ? item.sellerCollege.replace(/\s*\(.*?\)\s*/g, '')
                              : 'College Campus'}
                          </span>
                        </div>
                        {isItemMyCollege(item) ? (
                          <span className="shrink-0 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/40">
                            My College
                          </span>
                        ) : (
                          <span className="shrink-0 rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300 border border-cyan-500/40">
                            {item.sellerCity || 'Nearby'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-200">{item.sellerName}</span>
                          {item.sellerVerified && (
                            <span title="Verified Campus Student">
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span className="font-bold">{item.sellerRating}</span>
                          <span className="text-slate-500">({item.sellerReviewsCount})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-800 bg-slate-950/60 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setContactModalItem(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 py-1.5 text-xs font-semibold text-white transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Contact Seller</span>
                      </button>

                      <button
                        onClick={() => setReviewModalItem(item)}
                        title="Rate & review seller"
                        className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => setReportModalItem(item)}
                        title="Report suspicious listing"
                        className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition-colors"
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Toggle status if user owns item or for demo toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() =>
                          onToggleStatus(item.id, item.status === 'available' ? 'sold' : 'available')
                        }
                        className="text-[10px] text-slate-400 hover:text-cyan-300 underline transition-colors"
                      >
                        {item.status === 'available' ? 'Mark as Sold' : 'Relist as Available'}
                      </button>
                      <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CONTACT / CHAT MODAL */}
      {contactModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                  {contactModalItem.sellerName ? contactModalItem.sellerName[0] : 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{contactModalItem.sellerName || 'Campus Student'}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Selling: <span className="text-cyan-300">{contactModalItem.title}</span> (₹{(Number(contactModalItem.price ?? 0)).toLocaleString()})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setContactModalItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Direct call / WhatsApp bar */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 truncate">
                <Building2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{contactModalItem.sellerCollege || 'Campus'} • {contactModalItem.location}</span>
              </div>
              <a
                href={`tel:${contactModalItem.contactPhone || '9876543210'}`}
                className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline shrink-0"
              >
                <Phone className="h-3 w-3" />
                <span>Call Seller</span>
              </a>
            </div>

            {/* Chat message bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B1120]/60">
              {chatHistory.map((c, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${c.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                      c.sender === 'me'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {c.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{c.time}</span>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendChat} className="border-t border-slate-800 bg-slate-950 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message to the seller..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 px-3.5 py-2 text-white transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Rate & Review Seller</h3>
              <button
                onClick={() => setReviewModalItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              How was your campus transaction with <span className="font-semibold text-white">{reviewModalItem.sellerName}</span> for <span className="text-cyan-300">"{reviewModalItem.title}"</span>?
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Select Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-amber-400 ml-2">{reviewRating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Feedback Comment
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="e.g. Prompt campus meetup, item exactly as described, friendly senior!"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  className="rounded-xl border border-slate-700 px-4 py-1.5 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-1.5 text-xs font-bold text-slate-950"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <Flag className="h-4 w-4" />
                <span>Report Listing</span>
              </h3>
              <button
                onClick={() => setReportModalItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Help keep CampusHub safe. Reporting <span className="font-semibold text-white">"{reportModalItem.title}"</span> flags it for moderator review.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reason for Reporting
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Commercial reseller / Non-student listing">Commercial reseller / Non-student listing</option>
                  <option value="Misleading price or fake description">Misleading price or fake description</option>
                  <option value="Prohibited or inappropriate item">Prohibited or inappropriate item</option>
                  <option value="Copyright or unauthorized material">Copyright or unauthorized material</option>
                  <option value="Other security concern">Other security concern</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setReportModalItem(null)}
                  className="rounded-xl border border-slate-700 px-4 py-1.5 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
