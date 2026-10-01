import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  MapPin,
  Phone,
  FileText,
  DollarSign,
  Layers,
  Camera,
  RefreshCw,
  Trash2,
  Smartphone,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { MarketplaceItem, MarketplaceCategory, ItemCondition, StudentProfile } from '../types';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onAddItem: (newItem: Partial<MarketplaceItem>) => Promise<void>;
  onSuccess?: () => void;
}

const CATEGORIES: MarketplaceCategory[] = [
  'Books & Notes',
  'Calculators & Stationery',
  'Fans, Tables, Chairs & Lamps',
  'Cycles & Accessories',
  'Headphones, Keyboards & Monitors',
  'Bags, Sports Items & Essentials',
];

const SAMPLE_IMAGES: { label: string; url: string; category: MarketplaceCategory }[] = [
  {
    label: 'Engineering Textbook',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    category: 'Books & Notes',
  },
  {
    label: 'Scientific Calculator',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    category: 'Calculators & Stationery',
  },
  {
    label: 'Campus Bicycle',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    category: 'Cycles & Accessories',
  },
  {
    label: 'Hostel Study Lamp',
    url: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80',
    category: 'Fans, Tables, Chairs & Lamps',
  },
  {
    label: 'Hostel Table Fan',
    url: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=600&q=80',
    category: 'Fans, Tables, Chairs & Lamps',
  },
  {
    label: 'Noise-Cancelling Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Headphones, Keyboards & Monitors',
  },
];

// Helper to optimize real camera and gallery images for instant preview & lightweight storage
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1280;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const NewListingModal: React.FC<NewListingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onAddItem,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('Books & Notes');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [location, setLocation] = useState('Hostel Block B, Room 204');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState<'camera' | 'gallery' | 'url' | 'sample' | null>(null);
  const [sellerCollege, setSellerCollege] = useState(profile.college || 'Babu Banarasi Das Institute of Technology and Management (BBDITM)');
  const [sellerCity, setSellerCity] = useState('Lucknow');
  const [phone, setPhone] = useState(profile.phone || (profile.rollNo ? `+91 98765 ${profile.rollNo.slice(-4) || '4321'}` : '+91 98765 43210'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync profile college when modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile?.college) {
      setSellerCollege(profile.college);
      if (profile.phone) setPhone(profile.phone);
    }
  }, [isOpen, profile?.college, profile?.phone]);

  // Real Camera & Gallery states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera media tracks cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsCameraStarting(false);
  };

  // Start live in-app camera viewfinder
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    stopCamera();
    setCameraError(null);
    setIsCameraStarting(true);
    setIsCameraActive(true);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setIsCameraStarting(false);
    } catch (err: any) {
      console.warn('Live camera error:', err);
      setIsCameraStarting(false);
      setCameraError(
        'Camera permission was denied or camera is unavailable. You can click "Native Camera" or "Gallery" to upload.'
      );
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setImageUrl(dataUrl);
      setImageSource('camera');
      setErrorMsg('');
    }
    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFilePicked = async (
    e: React.ChangeEvent<HTMLInputElement>,
    source: 'camera' | 'gallery'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 15MB. Please choose a smaller photo.');
        return;
      }
      try {
        const compressed = await compressImageFile(file);
        setImageUrl(compressed);
        setImageSource(source);
        setErrorMsg('');
      } catch (err) {
        setErrorMsg('Failed to process image file. Please try another.');
      }
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const compressed = await compressImageFile(file);
        setImageUrl(compressed);
        setImageSource('gallery');
        setErrorMsg('');
      } catch {
        setErrorMsg('Could not process dropped image.');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter an item title');
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Please enter a valid price in ₹');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const defaultImg =
        SAMPLE_IMAGES.find((s) => s.category === category)?.url ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

      await onAddItem({
        title: title.trim(),
        price: numPrice,
        category,
        condition,
        location: location.trim() || 'Campus Hostel / Common Room',
        description:
          description.trim() ||
          'Genuine student-owned item in verified condition. Available for peer inspection on campus.',
        imageUrl: imageUrl.trim() || defaultImg,
        sellerName: profile.name,
        sellerRoll: profile.rollNo,
        sellerBranch: profile.course,
        sellerYear: profile.year,
        sellerCollege: sellerCollege.trim() || profile.college || 'Babu Banarasi Das Institute of Technology and Management (BBDITM)',
        sellerCity: sellerCity.trim() || 'Lucknow',
        contactPhone: phone.trim() || '+91 98765 43210',
      });

      // Reset
      setTitle('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setImageSource(null);
      stopCamera();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg('Failed to publish listing. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0f172a] p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Sell on CampusHub</h3>
              <p className="text-xs text-slate-400">List books, stationery, electronics or cycles for students</p>
            </div>
          </div>
          <button
            id="close-sell-modal"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-800/80 bg-rose-950/50 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Seller Info badge */}
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Listing as:</span>
            <span className="font-semibold text-white">{profile.name}</span>
            <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
              Verified
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">{profile.rollNo}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Item Title *
            </label>
            <input
              id="listing-title-input"
              type="text"
              required
              placeholder="e.g. Core Data Structures in C++ or Hero Sprint 21-Speed Cycle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Price and Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price (₹ INR) *
              </label>
              <input
                id="listing-price-input"
                type="number"
                required
                min="10"
                placeholder="e.g. 350"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Condition *
              </label>
              <select
                id="listing-condition-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Campus Category *
            </label>
            <select
              id="listing-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* College Campus & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                College / University Campus *
              </label>
              <input
                id="listing-college-input"
                type="text"
                required
                placeholder="e.g. BBDITM, IET Lucknow, DU, AKTU..."
                value={sellerCollege}
                onChange={(e) => setSellerCollege(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City / Region
              </label>
              <input
                id="listing-city-input"
                type="text"
                placeholder="e.g. Lucknow, Delhi, Kanpur..."
                value={sellerCity}
                onChange={(e) => setSellerCity(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Pickup Location & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Campus Pickup Location *
              </label>
              <input
                id="listing-location-input"
                type="text"
                required
                placeholder="e.g. Hostel 2 Room 314 or Library Gate"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp / Call Phone *
              </label>
              <input
                id="listing-phone-input"
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & Details
            </label>
            <textarea
              id="listing-description-input"
              rows={2}
              placeholder="State reason for selling (semester over, leaving hostel), included notes or bills, and working condition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Real Product Image Upload (Camera & Gallery) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-200">
                Product Image (Camera or Gallery) *
              </label>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Real product photos sell 3x faster
              </span>
            </div>

            {/* Hidden Inputs for Native File Dialogs */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFilePicked(e, 'gallery')}
            />
            <input
              ref={nativeCameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFilePicked(e, 'camera')}
            />

            {/* Live Camera Viewfinder Modal/Box */}
            {isCameraActive && (
              <div className="rounded-2xl border border-cyan-700/80 bg-slate-950 p-3 space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Live Camera Active ({cameraFacing === 'environment' ? 'Back' : 'Front'})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleCameraFacing}
                      className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-200 transition-colors"
                      title="Flip camera"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Flip
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="rounded-lg p-1 text-slate-400 hover:text-white"
                      title="Close camera"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {cameraError ? (
                  <div className="rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300 space-y-2">
                    <p>{cameraError}</p>
                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="rounded-lg bg-rose-900/60 hover:bg-rose-900 px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1.5"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      Open Phone Camera App
                    </button>
                  </div>
                ) : (
                  <div className="relative aspect-video sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-black border border-slate-800">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                    {isCameraStarting && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs text-slate-300">
                        Opening Camera...
                      </div>
                    )}
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={captureLivePhoto}
                        disabled={isCameraStarting}
                        className="flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 text-xs shadow-xl shadow-black/60 transition-transform active:scale-95"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary Action Buttons: Camera & Gallery */}
            {!isCameraActive && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Camera Trigger */}
                <div className="flex gap-1.5">
                  <button
                    id="open-camera-btn"
                    type="button"
                    onClick={() => startCamera('environment')}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-cyan-800/80 bg-cyan-950/40 hover:bg-cyan-900/50 p-2.5 text-xs font-semibold text-cyan-200 transition-all active:scale-95"
                  >
                    <Camera className="h-4 w-4 text-cyan-400" />
                    <span>Take Photo (Camera)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    title="Open native mobile phone camera"
                    className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 p-2.5 text-xs text-slate-300 transition-colors"
                  >
                    <Smartphone className="h-4 w-4 text-emerald-400" />
                  </button>
                </div>

                {/* Gallery Trigger */}
                <button
                  id="open-gallery-btn"
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-800/80 bg-emerald-950/40 hover:bg-emerald-900/50 p-2.5 text-xs font-semibold text-emerald-200 transition-all active:scale-95"
                >
                  <ImageIcon className="h-4 w-4 text-emerald-400" />
                  <span>Choose from Gallery / Files</span>
                </button>
              </div>
            )}

            {/* Drag & Drop Zone */}
            {!isCameraActive && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => galleryInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-3 text-center transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span>Drop image here or click to browse from device (JPG, PNG, WebP)</span>
                </div>
              </div>
            )}

            {/* Image Preview Card */}
            {imageUrl && (
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/90 p-2.5 shadow-md">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white truncate">Product Photo Attached</span>
                    {imageSource === 'camera' && (
                      <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[10px] font-bold text-cyan-300 border border-cyan-800 shrink-0">
                        📸 Camera Real
                      </span>
                    )}
                    {imageSource === 'gallery' && (
                      <span className="rounded bg-emerald-950 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300 border border-emerald-800 shrink-0">
                        🖼️ Gallery Real
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    Ready to publish. Students will see this real photo on the marketplace.
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="rounded-lg p-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    title="Change Photo"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImageSource(null);
                    }}
                    className="rounded-lg p-1.5 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Optional URL or Quick Presets Fallback */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Or use sample preset if photo not handy:</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = SAMPLE_IMAGES.find((s) => s.category === category) || SAMPLE_IMAGES[0];
                    setImageUrl(sample.url);
                    setImageSource('sample');
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  Use {category} sample
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setImageUrl(sample.url);
                      setCategory(sample.category);
                      setImageSource('sample');
                    }}
                    className={`shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      imageUrl === sample.url
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-listing-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
