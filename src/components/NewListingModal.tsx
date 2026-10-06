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
  Plus,
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
    label: 'Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Headphones, Keyboards & Monitors',
  },
];

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
  const [sellerCollege, setSellerCollege] = useState(profile.college || 'BBDITM');
  const [sellerCity, setSellerCity] = useState('Lucknow');
  const [phone, setPhone] = useState(profile.phone || '+91 98765 43210');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && profile?.college) {
      setSellerCollege(profile.college);
      if (profile.phone) setPhone(profile.phone);
    }
  }, [isOpen, profile]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setIsCameraStarting(false);
    setCameraError(null);
  };

  const startCamera = async (facing: 'environment' | 'user' = 'environment') => {
    stopCamera();
    setIsCameraStarting(true);
    setIsCameraActive(true);
    setCameraError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraStarting(false);
    } catch (err: any) {
      setIsCameraStarting(false);
      setCameraError('Camera access denied or unavailable. Please use file picker or sample image.');
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImageUrl(dataUrl);
      setImageSource('camera');
      setErrorMsg('');
      stopCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleFilePicked = async (e: React.ChangeEvent<HTMLInputElement>, source: 'gallery' | 'camera') => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file);
        setImageUrl(compressed);
        setImageSource(source);
        setErrorMsg('');
      } catch (err: any) {
        setErrorMsg('Could not process selected image file.');
      }
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
        sellerCollege: sellerCollege.trim() || profile.college || 'BBDITM',
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
    } catch {
      setErrorMsg('Failed to publish listing. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#DBEAFE] shrink-0">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#171717]">Sell on CampusHub</h3>
              <p className="text-xs text-[#6B7280]">List textbooks, stationery, cycles or electronics</p>
            </div>
          </div>
          <button
            id="close-sell-modal"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F7F7F5] hover:text-[#171717]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-[#FEE2E2] p-3 text-xs text-[#DC2626] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Seller Info badge */}
        <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#6B7280]">Listing as:</span>
            <span className="font-semibold text-[#171717]">{profile.name}</span>
            <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] font-bold text-[#16A34A] border border-green-200">
              Verified Student
            </span>
          </div>
          <span className="text-[#6B7280] font-mono text-[11px]">{profile.rollNo}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Item Title *</label>
            <input
              id="listing-title-input"
              type="text"
              required
              placeholder="e.g. Core Data Structures in C++ or Hero Sprint 21-Speed Cycle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          {/* Price and Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Price (₹ INR) *</label>
              <input
                id="listing-price-input"
                type="number"
                required
                min="10"
                placeholder="e.g. 350"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Condition *</label>
              <select
                id="listing-condition-select"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
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
            <label className="block text-xs font-semibold text-[#171717] mb-1">Campus Category *</label>
            <select
              id="listing-category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Campus and Pickup Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">College Campus *</label>
              <input
                id="listing-college-input"
                type="text"
                required
                placeholder="e.g. BBDITM, IET, DU, AKTU..."
                value={sellerCollege}
                onChange={(e) => setSellerCollege(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] mb-1">Pickup Location *</label>
              <input
                id="listing-location-input"
                type="text"
                required
                placeholder="e.g. Library Gate or Hostel 2 Room 314"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">WhatsApp / Call Phone *</label>
            <input
              id="listing-phone-input"
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] font-mono focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#171717] mb-1">Description & Details</label>
            <textarea
              id="listing-description-input"
              rows={2}
              placeholder="State working condition, reason for selling (semester over), included bills or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs text-[#171717] focus:border-[#2563EB] focus:outline-none"
            />
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

          {/* Camera Viewfinder */}
          {isCameraActive && (
            <div className="rounded-2xl border border-[#2563EB] bg-black p-3 space-y-3">
              <div className="flex items-center justify-between text-xs text-white px-1">
                <span>Live Camera</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-1 rounded bg-gray-800 text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="p-1 rounded bg-gray-800 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video rounded-xl object-cover bg-black" />
              <button
                type="button"
                onClick={captureLivePhoto}
                className="w-full py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold"
              >
                Capture Photo
              </button>
            </div>
          )}

          {/* Action Buttons for Image */}
          {!isCameraActive && (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => startCamera('environment')}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] hover:bg-white text-[#171717] text-xs font-semibold"
              >
                <Camera className="h-4 w-4 text-[#2563EB]" />
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] hover:bg-white text-[#171717] text-xs font-semibold"
              >
                <ImageIcon className="h-4 w-4 text-[#16A34A]" />
                <span>Upload Gallery</span>
              </button>
            </div>
          )}

          {/* Image Preview Card */}
          {imageUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F7F7F5] p-2.5">
              <img src={imageUrl} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 text-xs">
                <p className="font-semibold text-[#171717] truncate">Product Photo Attached</p>
                <p className="text-[11px] text-[#6B7280]">Visible to buyers on campus</p>
              </div>
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="p-1.5 text-[#DC2626] hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#6B7280]"
            >
              Cancel
            </button>
            <button
              id="submit-listing-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
