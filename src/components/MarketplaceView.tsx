import React, { useState } from 'react';
import {
  Search,
  Plus,
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
  ArrowRight,
  ExternalLink,
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

  const userCollege = (profile?.college || 'BBDITM').trim().toLowerCase();

  const availableColleges = Array.from(
    new Set(
      (items || [])
        .map((i) => i?.sellerCollege?.trim())
        .filter(Boolean) as string[]
    )
  );

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

  const filteredItems = (items || []).filter((item) => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    const matchesSearch =
      !searchQuery.trim() ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerCollege?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesScope = true;
    if (campusScope === 'my_college') {
      matchesScope = isItemMyCollege(item);
    } else if (campusScope === 'nearby') {
      const userCity = 'lucknow';
      matchesScope =
        (item.sellerCity && item.sellerCity.toLowerCase().includes(userCity)) ||
        (item.sellerCollege && item.sellerCollege.toLowerCase().includes(userCity)) ||
        isItemMyCollege(item);
    } else if (campusScope === 'custom' && customCollegeFilter !== 'All') {
      matchesScope = item.sellerCollege === customCollegeFilter;
    }

    return matchesCategory && matchesCondition && matchesStatus && matchesSearch && matchesScope;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { sender: 'me', text: chatMessage.trim(), time: 'Just now' },
    ]);
    setChatMessage('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalItem || !reviewComment.trim()) return;
    await onAddReview(reviewModalItem.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setReviewModalItem(null);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalItem || !reportReason.trim()) return;
    await onReportItem(reportModalItem.id, reportReason.trim());
    setReportReason('');
    setReportModalItem(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Quick Post CTA */}
      <section className="rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                Roll-Number Verified Peer Commerce
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1.5 tracking-tight">
              Campus Student Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
              Buy & sell textbooks, engineering calculators, cycles, and hostel furniture directly from verified peers.
            </p>
          </div>

          <button
            onClick={onOpenNewListing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Sell on Campus</span>
          </button>
        </div>

        {/* Campus Scope Tabs */}
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#6B7280] mr-1">Campus Scope:</span>
          <button
            onClick={() => setCampusScope('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              campusScope === 'all'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#F7F7F5] text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              <span>All Colleges & Universities</span>
            </span>
          </button>

          <button
            onClick={() => setCampusScope('my_college')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              campusScope === 'my_college'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#F7F7F5] text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>My Campus ({profile?.college ? profile.college.split(' ')[0] : 'My College'})</span>
            </span>
          </button>

          <button
            onClick={() => setCampusScope('nearby')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              campusScope === 'nearby'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#F7F7F5] text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              <span>Same City / Region</span>
            </span>
          </button>

          {availableColleges.length > 0 && (
            <select
              value={customCollegeFilter}
              onChange={(e) => {
                setCustomCollegeFilter(e.target.value);
                setCampusScope('custom');
              }}
              className="text-xs bg-[#F7F7F5] border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-[#171717] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="All">Select Specific College...</option>
              {availableColleges.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          )}
        </div>
      </section>

      {/* 2. Search & Category Filters */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search books, calculators, bicycles, laptops, study lamps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs sm:text-sm text-[#171717] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#171717]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Condition & Status dropdowns */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#2563EB] shadow-xs"
            >
              <option value="All">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#2563EB] shadow-xs"
            >
              <option value="All">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#171717] text-white shadow-xs'
                : 'bg-white text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
            }`}
          >
            All Items ({items.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = (items || []).filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : 'bg-white text-[#6B7280] hover:text-[#171717] border border-[#E5E7EB]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-3 text-xs text-[#6B7280]">
          <span>Showing {filteredItems.length} student listings</span>
          <span>Verified campus peer exchange</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-12 text-center space-y-3 shadow-xs">
            <Search className="h-8 w-8 text-[#9CA3AF] mx-auto" />
            <h3 className="text-sm font-bold text-[#171717]">No items found matching your filters</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Try adjusting your category selection, search terms, or switch campus scope to "All Colleges".
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCondition('All');
                setSearchQuery('');
                setCampusScope('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#2563EB]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <span className="rounded-lg bg-white/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-[#171717] shadow-xs">
                        {item.condition}
                      </span>
                      {item.status === 'sold' && (
                        <span className="rounded-lg bg-[#DC2626] text-white px-2 py-0.5 text-[10px] font-bold">
                          SOLD
                        </span>
                      )}
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="rounded-lg bg-[#2563EB] text-white px-2.5 py-1 text-xs font-bold shadow-xs">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-[#2563EB] uppercase tracking-wider block truncate">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#171717] line-clamp-1 group-hover:text-[#2563EB] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Seller details badge */}
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-[#171717] truncate">{item.sellerName}</span>
                          {item.sellerVerified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{item.location}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 shrink-0 font-bold text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.sellerRating || 4.9}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setContactModalItem(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Contact Seller</span>
                  </button>

                  <button
                    onClick={() => setReviewModalItem(item)}
                    className="p-2 rounded-xl bg-white hover:bg-[#F7F7F5] border border-[#E5E7EB] text-[#6B7280] hover:text-[#171717] transition-colors"
                    title="Student Reviews"
                  >
                    <Star className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setReportModalItem(item)}
                    className="p-2 rounded-xl bg-white hover:bg-[#F7F7F5] border border-[#E5E7EB] text-[#6B7280] hover:text-[#DC2626] transition-colors"
                    title="Safety Report"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL 1: CONTACT SELLER & CAMPUS PICKUP */}
      {contactModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#171717]">Contact Seller for Campus Handover</h3>
                <p className="text-xs text-[#6B7280]">Verified Student Pickup on Campus</p>
              </div>
              <button
                onClick={() => setContactModalItem(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F7F7F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product summary card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB]">
              <img
                src={contactModalItem.imageUrl}
                alt={contactModalItem.title}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-[#171717] truncate">{contactModalItem.title}</h4>
                <p className="text-[11px] text-[#6B7280]">
                  ₹{contactModalItem.price} • {contactModalItem.condition} • {contactModalItem.sellerCollege || 'Campus'}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp / Phone Call Option */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={`tel:${contactModalItem.contactPhone || '+919876543210'}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#DCFCE7] text-[#16A34A] border border-green-200 text-xs font-semibold hover:bg-green-100 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call Seller</span>
              </a>

              <a
                href={`https://wa.me/${(contactModalItem.contactPhone || '919876543210').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(contactModalItem.sellerName)},%20I%20saw%20your%20listing%20for%20${encodeURIComponent(contactModalItem.title)}%20on%20CampusHub.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Campus chat box */}
            <div className="space-y-2 border-t border-[#E5E7EB] pt-3">
              <span className="text-xs font-semibold text-[#171717]">Campus Peer Messenger</span>
              <div className="h-36 overflow-y-auto p-3 rounded-xl bg-[#F7F7F5] border border-[#E5E7EB] space-y-2 text-xs">
                {chatHistory.map((c, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${c.sender === 'me' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                        c.sender === 'me'
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-white text-[#171717] border border-[#E5E7EB]'
                      }`}
                    >
                      {c.text}
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] mt-0.5">{c.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type message or pickup meeting point..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REVIEWS */}
      {reviewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#171717]">Seller Ratings & Reviews</h3>
                <p className="text-xs text-[#6B7280]">Verified feedback for {reviewModalItem.sellerName}</p>
              </div>
              <button
                onClick={() => setReviewModalItem(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F7F7F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Your Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Item condition as described? Honest seller?"
                  className="w-full p-3 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalItem(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SAFETY REPORT */}
      {reportModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#171717]">Report Listing to Moderation</h3>
                <p className="text-xs text-[#6B7280]">Help keep CampusHub safe and trustworthy</p>
              </div>
              <button
                onClick={() => setReportModalItem(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F7F7F5]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#171717] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">Select a reason...</option>
                  <option value="Prohibited or illegal item">Prohibited or illegal item</option>
                  <option value="Misleading price or description">Misleading price or description</option>
                  <option value="Not a genuine university student">Not a genuine university student</option>
                  <option value="Off-campus commercial seller">Off-campus commercial seller</option>
                  <option value="Copyright infringement">Copyright infringement</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalItem(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#DC2626] text-white text-xs font-semibold"
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
