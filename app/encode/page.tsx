"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronLeft, Shield, CheckCircle2, Download, Terminal, Settings2, Image as ImageIcon, ArrowLeft, Lock, Sparkles, Code2, Upload, Info, AlertTriangle } from "lucide-react";
import { 
  ALGORITHMS, 
  getAlgorithmName, 
  getAlgorithmDescription,
  calculateCapacity,
  resizeImageDataUrl
} from "../utils/steganography";

const algorithmPseudocode = {
  lsb: [
    "function encode(coverImage, secretData, isText):",
    "  pixels = getPixelArray(coverImage)",
    "  if isText:",
    "    binaryData = textToBinary(secretData)",
    "  else:",
    "    binaryData = imageToBinary(secretData)",
    "  for i = 0 to length(binaryData):",
    "    pixel = pixels[i]",
    "    pixel.lsb = binaryData[i]",
    "  return pixelsToImage(pixels)"
  ]
};

const SAMPLE_CARRIERS = [
  { id: 1, name: "Forest", url: "/carrier1.jpg" },
  { id: 2, name: "City", url: "/carrier2.jpg" },
  { id: 3, name: "Ocean", url: "/carrier3.jpg" },
  { id: 4, name: "Mountain", url: "/carrier4.jpg" },
  { id: 5, name: "Tech", url: "/carrier5.jpg" },
];

const SAMPLE_SECRETS = [
  { id: 1, name: "Key", url: "/secret1.png" },
  { id: 2, name: "Lock", url: "/secret2.png" },
  { id: 3, name: "Message", url: "/secret3.png" },
  { id: 4, name: "Fingerprint", url: "/secret4.png" },
];

export default function EncodePage() {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [secretImage, setSecretImage] = useState<string | null>(null);
  const [secretText, setSecretText] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [processingStatus, setProcessingStatus] = useState("");
  const [missionComplete, setMissionComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pseudoCodeLine, setPseudoCodeLine] = useState<number | null>(null);
  const [selectedCarrierId, setSelectedCarrierId] = useState<number | null>(null);
  const [selectedSecretId, setSelectedSecretId] = useState<number | null>(null);
  const [coverDimensions, setCoverDimensions] = useState<{ w: number; h: number } | null>(null);
  const pseudoCodeRef = useRef<HTMLDivElement>(null);
  const secretFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pseudoCodeLine !== null && pseudoCodeRef.current) {
      const lineElement = pseudoCodeRef.current.querySelector(`[data-line-index="${pseudoCodeLine}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [pseudoCodeLine]);

  // Measure cover image dimensions whenever coverImage changes
  useEffect(() => {
    if (!coverImage) {
      setCoverDimensions(null);
      return;
    }
    const img = window.document.createElement('img');
    img.src = coverImage;
    img.onload = () => {
      setCoverDimensions({ w: img.width, h: img.height });
    };
  }, [coverImage]);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use Blob URL to avoid data URL corruption with large images
      const blobUrl = URL.createObjectURL(file);
      setCoverImage(blobUrl);
      setSelectedCarrierId(null);
      setMissionComplete(false);
      setResultImage(null);
    }
  };

  const handleSecretImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSecretImage(event.target?.result as string);
        setSelectedSecretId(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSampleCarrier = async (id: number, url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      // Use Blob URL to avoid data URL corruption with large images
      const blobUrl = URL.createObjectURL(blob);
      setCoverImage(blobUrl);
      setSelectedCarrierId(id);
      setMissionComplete(false);
      setResultImage(null);
      toast.success("Sample carrier loaded");
    } catch (error) {
      toast.error("Failed to load sample image");
    }
  };

  const selectSampleSecret = async (id: number, url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (event) => {
        setSecretImage(event.target?.result as string);
        setSelectedSecretId(id);
        toast.success("Secret image selected");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      toast.error("Failed to load secret image");
    }
  };

  const handleEncode = async () => {
    if (!coverImage) return toast.error("Cover required");
    const isText = activeTab === "text";
    
    try {
      setIsProcessing(true);
      setMissionComplete(false);
      setResultImage(null);
      
      const steps = [
        { status: "Analyzing carrier...", line: 1 },
        { status: "Processing payload...", line: 3 },
        { status: "Embedding via LSB...", line: 6 },
        { status: "Finalizing image...", line: 9 }
      ];

      for (const step of steps) {
        setProcessingStatus(step.status);
        setPseudoCodeLine(step.line);
        await new Promise(r => setTimeout(r, 600));
      }
      
      let secretData: string;
      if (isText) {
        secretData = secretText;
        if (!secretData.trim()) {
          throw new Error("Please enter a text message to hide.");
        }
      } else {
        if (!secretImage) {
          throw new Error("Please select or upload a secret image.");
        }
        // Resize secret image to ensure it fits within carrier capacity
        // We downscale to max 300×300 to keep the data URL manageable
        setProcessingStatus("Optimizing secret image...");
        secretData = await resizeImageDataUrl(secretImage, 300, 300);
      }

      const { resultImage: encodedImage } = await ALGORITHMS[0].encode(coverImage, secretData, isText);
      
      setResultImage(encodedImage);
      setMissionComplete(true);
      setProcessingStatus("Success.");
      setPseudoCodeLine(null);
      toast.success("Encoding complete!");
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : "Encoding failed.";
      setProcessingStatus("Failed.");
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadEncodedImage = async () => {
    if (!resultImage) return;
    try {
      // resultImage is a Blob URL — fetch it to get the blob
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stego_image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Download failed. Please try again.');
    }
  };

  const capacityKB = coverDimensions
    ? Math.floor(calculateCapacity(coverDimensions.w, coverDimensions.h) / 1024)
    : null;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 bg-[#f8fafc]">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 py-6 px-6 md:px-12">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mr-4">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold font-outfit">Dashboard</span>
            </Link>
            <img src="/Picture5.png" alt="InquireLab" className="h-10 w-auto object-contain" />
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <img src="/College%20of%20Engineering_linear-crimson-WEB.png" alt="School" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl flex-1 px-6 md:px-12 py-12 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <Card className="bg-white border border-slate-200 overflow-hidden rounded-3xl shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 p-8">
                <CardTitle className="text-2xl font-outfit text-slate-900">Carrier Source</CardTitle>
                <CardDescription>Select or upload a large image to hide your data within.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Sample Carriers Selection */}
                <div className="space-y-4">
                  <Label className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Quick Start Carriers</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {SAMPLE_CARRIERS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => selectSampleCarrier(sample.id, sample.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 group ${
                          selectedCarrierId === sample.id ? "border-indigo-600 ring-2 ring-indigo-100" : "border-slate-100 hover:border-slate-300"
                        }`}
                        title={sample.name}
                      >
                        <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute bottom-1 left-1 right-1 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-700 font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    Custom Carrier
                  </Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer relative group">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleCoverUpload}
                      accept="image/*"
                    />
                    {coverImage ? (
                      <div className="w-full space-y-3">
                        <div className="w-full aspect-video relative rounded-lg overflow-hidden border border-slate-200">
                          <img src={coverImage} alt="Cover" className="w-full h-full object-contain" />
                        </div>
                        {coverDimensions && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                            <Info className="w-3 h-3" />
                            <span>{coverDimensions.w}×{coverDimensions.h} px • Capacity: ~{capacityKB} KB</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="p-4 rounded-full bg-slate-50 w-fit mx-auto">
                           <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-900 font-bold">Click or drop to upload custom carrier</p>
                        <p className="text-xs text-slate-400">Use a large image (2000+ pixels) for more capacity</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-700 font-bold">Secret Message (Payload)</Label>
                  <Tabs defaultValue="text" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-50 p-1 rounded-xl">
                      <TabsTrigger value="text" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Plain Text</TabsTrigger>
                      <TabsTrigger value="image" className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Secret Image</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="mt-4">
                      <Textarea 
                        placeholder="Enter secret message here..." 
                        value={secretText}
                        onChange={(e) => setSecretText(e.target.value)}
                        className="min-h-[150px] bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                      />
                      {secretText && coverDimensions && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {secretText.length <= calculateCapacity(coverDimensions.w, coverDimensions.h) ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-600">Message fits: {secretText.length} chars / {calculateCapacity(coverDimensions.w, coverDimensions.h).toLocaleString()} max</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                              <span className="text-red-600">Message too large: {secretText.length} chars / {calculateCapacity(coverDimensions.w, coverDimensions.h).toLocaleString()} max</span>
                            </>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="image" className="mt-4 space-y-4">
                      {/* Default secret images gallery */}
                      <div className="space-y-3">
                        <Label className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Quick Start Secrets</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {SAMPLE_SECRETS.map((sample) => (
                            <button
                              key={sample.id}
                              onClick={() => selectSampleSecret(sample.id, sample.url)}
                              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 group bg-slate-50 ${
                                selectedSecretId === sample.id ? "border-indigo-600 ring-2 ring-indigo-100" : "border-slate-100 hover:border-slate-300"
                              }`}
                              title={sample.name}
                            >
                              <img src={sample.url} alt={sample.name} className="w-full h-full object-contain p-2" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                              <span className="absolute bottom-1 left-1 right-1 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity text-center">{sample.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or upload your own</span>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>

                      {/* Custom upload */}
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer relative">
                        <input 
                          ref={secretFileInputRef}
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          onChange={handleSecretImageUpload}
                          accept="image/*"
                        />
                        {secretImage && !selectedSecretId ? (
                          <div className="w-full space-y-3">
                            <div className="w-full h-32 relative rounded-lg overflow-hidden border border-slate-200">
                              <img src={secretImage} alt="Secret" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-xs text-slate-500 text-center flex items-center gap-1 justify-center">
                              <Info className="w-3 h-3" />
                              Image will be auto-resized to fit carrier capacity
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 rounded-full bg-slate-50 border border-slate-100">
                              <Upload className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="text-center">
                              <span className="text-sm text-slate-700 font-bold block">Upload custom secret image</span>
                              <span className="text-xs text-slate-400">Any size — auto-resized for encoding</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected preview */}
                      {secretImage && selectedSecretId && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-indigo-200 bg-white flex-shrink-0">
                            <img src={secretImage} alt="Selected" className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-indigo-900">
                              {SAMPLE_SECRETS.find(s => s.id === selectedSecretId)?.name} selected
                            </p>
                            <p className="text-xs text-indigo-600">Ready to embed into carrier</p>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                <Button 
                  onClick={handleEncode}
                  disabled={!coverImage || isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-8 rounded-2xl text-lg shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all transform active:scale-95"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Encoding Data...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" /> Embed Secret Message
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {isProcessing && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span className="font-mono text-sm text-slate-700 font-bold uppercase tracking-tight">{processingStatus}</span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <Card className="bg-white border border-slate-200 overflow-hidden rounded-3xl shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Operation Logic</CardTitle>
                </div>
                <Code2 className="w-4 h-4 text-indigo-400" />
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  ref={pseudoCodeRef}
                  className="p-8 font-mono text-sm overflow-auto max-h-[250px] leading-relaxed bg-white"
                >
                  {algorithmPseudocode.lsb.map((line, index) => (
                    <div 
                      key={index}
                      data-line-index={index}
                      className={`py-1.5 px-4 rounded-lg transition-all duration-300 border-l-2 ${
                        pseudoCodeLine === index 
                          ? "bg-indigo-50 text-indigo-700 border-indigo-600 translate-x-1" 
                          : "text-slate-400 border-transparent"
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 overflow-hidden rounded-3xl h-full shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 p-8">
                <CardTitle className="text-2xl font-outfit text-slate-900">Result</CardTitle>
                <CardDescription>The final carrier with embedded information.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="min-h-[300px] flex flex-col justify-center border border-slate-100 rounded-2xl bg-slate-50 p-8">
                  {!missionComplete ? (
                    <div className="text-center space-y-4">
                      <div className="p-4 rounded-full bg-white w-fit mx-auto shadow-sm border border-slate-100">
                        <Lock className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-500 font-bold">The stego-image will be generated here.</p>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                      <div className="aspect-video relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
                        <img src={resultImage!} alt="Encoded Result" className="w-full h-full object-contain" />
                      </div>
                      <Button 
                        onClick={downloadEncodedImage}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-8 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" /> Download Stego Image
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 py-16 bg-white relative z-0">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Developer</p>
            <p className="text-slate-900 font-outfit font-bold text-xl">Danial Ebrahimzadeh</p>
            <p className="text-indigo-600 font-bold text-sm tracking-tight">danial.ebrahimzadeh@ou.edu</p>
          </div>
          <div className="flex gap-12 items-center flex-wrap justify-center">
            <div className="h-12 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
              <img src="/fema.png" alt="FEMA" className="h-full w-auto object-contain" />
            </div>
            <div className="h-12 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
              <img src="/oklahoma%20homeland%20security.png" alt="OHS" className="h-full w-auto object-contain" />
            </div>
            <div className="h-12 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
              <img src="/oklahoma%20office%20of%20homeland%20security.png" alt="OOHS" className="h-full w-auto object-contain" />
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}