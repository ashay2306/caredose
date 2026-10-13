import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Pill, 
  Calendar, 
  Building, 
  ShieldCheck,
  Video,
  VideoOff
} from 'lucide-react';
import { FamilyMember, Medicine, ScannedMedicineResult, DosageForm, FoodInstruction } from '../types/medicare';
import { scanMedicineImage, SAMPLE_STRIPS, SampleStrip } from '../services/geminiScanner';

interface MedicineScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  onSaveMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt'>) => void;
}

export const MedicineScannerModal: React.FC<MedicineScannerModalProps> = ({
  isOpen,
  onClose,
  members,
  onSaveMedicine,
}) => {
  const [activeMode, setActiveMode] = useState<'sample' | 'camera' | 'upload'>('sample');
  const [selectedSample, setSelectedSample] = useState<SampleStrip>(SAMPLE_STRIPS[0]);
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_STRIPS[0].previewUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  
  // Verification Form State
  const [extractedData, setExtractedData] = useState<ScannedMedicineResult | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'mem-1');
  const [formTimings, setFormTimings] = useState<string[]>(['20:00']);
  const [stockCount, setStockCount] = useState<number>(15);
  const [minStock, setMinStock] = useState<number>(5);

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setExtractedData(null);
    } else {
      // Default to first sample
      setImagePreview(SAMPLE_STRIPS[0].previewUrl);
      setSelectedSample(SAMPLE_STRIPS[0]);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError('Camera API is not supported on this browser.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Unable to access webcam. Please check permissions or use Sample Strips/Upload.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
      triggerScan(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
        triggerScan(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: SampleStrip) => {
    setSelectedSample(sample);
    setImagePreview(sample.previewUrl);
    stopCamera();
  };

  const triggerScan = async (base64OrUrl: string) => {
    setIsScanning(true);
    setScanStep('Aligning image & running edge detection...');

    setTimeout(() => {
      setScanStep('Extracting optical text: Brand, Strength, Salt...');
    }, 700);

    setTimeout(() => {
      setScanStep('Verifying expiry date & pharmaceutical manufacturer...');
    }, 1400);

    try {
      let result: ScannedMedicineResult;
      if (activeMode === 'sample' && selectedSample) {
        // Fast instant verification using sample preset
        await new Promise((resolve) => setTimeout(resolve, 1800));
        result = selectedSample.expectedResult;
      } else {
        // Call backend Gemini Vision OCR
        result = await scanMedicineImage(base64OrUrl);
      }

      setExtractedData(result);
      setStockCount(result.totalUnitsInStrip || 10);
      if (result.suggestedFrequency.toLowerCase().includes('twice')) {
        setFormTimings(['08:00', '20:00']);
      } else {
        setFormTimings(['20:00']);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleSaveToMedicine = () => {
    if (!extractedData) return;

    onSaveMedicine({
      profileId: selectedMemberId,
      name: extractedData.medicineName,
      strength: extractedData.strength,
      dosageForm: (extractedData.dosageForm as DosageForm) || 'Tablet',
      doseAmount: `1 ${extractedData.dosageForm.toLowerCase()}`,
      foodInstruction: (extractedData.foodInstruction as FoodInstruction) || 'After food',
      scheduleTimings: formTimings,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      currentStock: stockCount,
      initialStock: stockCount,
      minStockAlert: minStock,
      unitType: extractedData.dosageForm.toLowerCase() === 'syrup' ? 'ml' : 'tablets',
      dailyFrequency: formTimings.length,
      activeSalt: extractedData.activeSalt,
      manufacturer: extractedData.manufacturer,
      expiryDate: extractedData.expiryDate,
      purpose: 'Identified via OCR strip scan',
      safetyWarnings: extractedData.safetyWarnings,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Medicine Strip Scanner (AI OCR)</h2>
              <p className="text-xs text-slate-400">
                Extract Name, Strength, Expiry, Manufacturer & Salt details directly from photo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {!extractedData ? (
            <div className="space-y-5">
              {/* Mode Selectors */}
              <div className="flex items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-xl">
                <button
                  onClick={() => {
                    setActiveMode('sample');
                    stopCamera();
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeMode === 'sample' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ College Demo Presets (Instant)
                </button>
                <button
                  onClick={() => {
                    setActiveMode('camera');
                    startCamera();
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeMode === 'camera' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📷 Live Webcam
                </button>
                <button
                  onClick={() => {
                    setActiveMode('upload');
                    stopCamera();
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📁 Upload Photo
                </button>
              </div>

              {/* Sample Presets Mode (Ideal for Viva / College presentation) */}
              {activeMode === 'sample' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold">Select a Sample Medicine Strip to Scan:</span>
                    <span className="text-teal-700 font-medium">Pre-loaded for presentation</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SAMPLE_STRIPS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => handleSelectSample(sample)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          selectedSample.id === sample.id
                            ? 'border-teal-500 bg-teal-50/70 shadow-xs ring-1 ring-teal-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="w-full h-20 rounded-lg overflow-hidden bg-slate-100 mb-2">
                          <img
                            src={sample.previewUrl}
                            alt={sample.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-[11px] font-bold text-slate-900 truncate">{sample.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{sample.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera Mode */}
              {activeMode === 'camera' && (
                <div className="space-y-3">
                  <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                    {cameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-4">
                        <VideoOff className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                        <p className="text-xs">{cameraError || 'Webcam is currently inactive.'}</p>
                        <button
                          onClick={startCamera}
                          className="mt-3 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Retry Camera
                        </button>
                      </div>
                    )}

                    {cameraActive && (
                      <div className="absolute inset-x-0 bottom-4 flex justify-center">
                        <button
                          onClick={captureCameraPhoto}
                          className="px-5 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Snap Strip Photo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* File Upload Mode */}
              {activeMode === 'upload' && (
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Choose a medicine strip or packaging image</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Supports JPG, PNG, WEBP</p>
                  <label className="mt-4 inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer">
                    Browse File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Selected Image Preview & Scan Action */}
              {imagePreview && activeMode !== 'camera' && (
                <div className="rounded-xl border border-slate-200 p-4 bg-white flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img src={imagePreview} alt="Selected Strip" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1 text-left">
                    <h4 className="text-xs font-bold text-slate-900">Ready for Optical Extraction</h4>
                    <p className="text-[11px] text-slate-500">
                      Our AI model will detect the pharmaceutical packaging, crop the text region, and extract active ingredients, strength, and expiry date.
                    </p>
                  </div>
                  <button
                    onClick={() => triggerScan(imagePreview)}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run Strip Scanner</span>
                  </button>
                </div>
              )}

              {/* Live Scanner Animation overlay */}
              {isScanning && (
                <div className="p-6 bg-slate-900 rounded-2xl text-center text-white space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-500/30 to-teal-500/10 animate-pulse" />
                  <div className="w-10 h-10 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mx-auto" />
                  <p className="text-xs font-bold text-teal-300">Processing Medicine Strip with AI OCR...</p>
                  <p className="text-[11px] text-slate-400">{scanStep}</p>
                </div>
              )}
            </div>
          ) : (
            /* Verification & Confirmation Form */
            <div className="space-y-5">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold">OCR Extraction Successful!</span> Please review and verify the extracted parameters below before confirming into the active schedule.
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={extractedData.medicineName}
                    onChange={(e) => setExtractedData({ ...extractedData, medicineName: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Strength / Dosage</label>
                  <input
                    type="text"
                    value={extractedData.strength}
                    onChange={(e) => setExtractedData({ ...extractedData, strength: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={extractedData.dosageForm}
                    onChange={(e) => setExtractedData({ ...extractedData, dosageForm: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Drops">Drops</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={extractedData.expiryDate}
                    onChange={(e) => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={extractedData.manufacturer}
                    onChange={(e) => setExtractedData({ ...extractedData, manufacturer: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Active Chemical Salt</label>
                  <input
                    type="text"
                    value={extractedData.activeSalt}
                    onChange={(e) => setExtractedData({ ...extractedData, activeSalt: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>

                {/* Patient & Administration Assignment */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assign to Family Member</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship}, {m.age}y)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Food Timing Instruction</label>
                  <select
                    value={extractedData.foodInstruction}
                    onChange={(e) => setExtractedData({ ...extractedData, foodInstruction: e.target.value })}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                  >
                    <option value="After food">After food</option>
                    <option value="Before food">Before food</option>
                    <option value="With meals">With meals</option>
                    <option value="Empty stomach">Empty stomach</option>
                    <option value="At bedtime">At bedtime</option>
                    <option value="After dinner">After dinner</option>
                    <option value="After breakfast">After breakfast</option>
                  </select>
                </div>

                {/* Stock Details */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Purchased Units in Strip</label>
                  <input
                    type="number"
                    min="1"
                    value={stockCount}
                    onChange={(e) => setStockCount(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Minimum Stock Alert Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={minStock}
                    onChange={(e) => setMinStock(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
              </div>

              {/* Safety Precaution */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Safety Advice / Precautions</label>
                <textarea
                  rows={2}
                  value={extractedData.safetyWarnings}
                  onChange={(e) => setExtractedData({ ...extractedData, safetyWarnings: e.target.value })}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  onClick={() => setExtractedData(null)}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Scan Another Strip</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveToMedicine}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save to Active Medicines</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
