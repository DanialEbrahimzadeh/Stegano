"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, Shield, Search, Download, Terminal, Scan, ArrowLeft, Lock, Code2 } from "lucide-react";
import { 
  ALGORITHMS, 
  getAlgorithmName, 
  getAlgorithmDescription
} from "../utils/steganography";

const algorithmPseudocode = {
  lsb: [
    "function decode(encodedImage):",
    "  pixels = getPixelArray(encodedImage)",
    "  metadata = extractMetadata(pixels)",
    "  binaryData = []",
    "  for each pixel in pixels:",
    "    bit = pixel.getLSB()",
    "    binaryData.append(bit)",
    "  return binaryToContent(binaryData)"
  ]
};

export default function DecodePage() {
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [decodedContent, setDecodedContent] = useState<string | null>(null);
  const [decodedImage, setDecodedImage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState("");
  const [missionComplete, setMissionComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contentType, setContentType] = useState<"text" | "image" | null>(null);
  const [pseudoCodeLine, setPseudoCodeLine] = useState<number | null>(null);
  const pseudoCodeRef = useRef<HTMLDivElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pseudoCodeLine !== null && pseudoCodeRef.current) {
      const lineElement = pseudoCodeRef.current.querySelector(`[data-line-index="${pseudoCodeLine}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [pseudoCodeLine]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEncodedImage(event.target?.result as string);
        setMissionComplete(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDecode = async () => {
    if (!encodedImage) return toast.error("Encoded image required");

    try {
      setIsProcessing(true);
      setMissionComplete(false);
      
      const steps = [
        { status: "Scanning bit-planes...", line: 1, ms: 500 },
        { status: "Extracting LSB data...", line: 4, ms: 500 },
        { status: "Reassembling stream...", line: 7, ms: 500 }
      ];

      for (const step of steps) {
        setProcessingStatus(step.status);
        setPseudoCodeLine(step.line);
        await new Promise(r => setTimeout(r, step.ms));
      }
      
      const { data, contentType: type } = await ALGORITHMS[0].decode(encodedImage);
      
      setContentType(type as "text" | "image");
      if (type === "text") {
        setDecodedContent(data);
      } else {
        setDecodedImage(data);
      }
      
      setMissionComplete(true);
      setProcessingStatus("Success.");
      setPseudoCodeLine(null);
      toast.success("Decoding complete!");
    } catch (error) {
      console.error(error);
      setProcessingStatus("Failed.");
      toast.error("Extraction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDecodedImage = () => {
    if (decodedImage && downloadLinkRef.current) {
      downloadLinkRef.current.href = decodedImage;
      downloadLinkRef.current.download = "restored_secret.png";
      downloadLinkRef.current.click();
    }
  };

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
                <CardDescription>Upload stego-image to extract data.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-4">
                  <Label className="text-slate-700 font-bold">Stego Image</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer relative group">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    {encodedImage ? (
                      <div className="w-full aspect-video relative rounded-lg overflow-hidden border border-slate-200">
                        <img src={encodedImage} alt="Carrier" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <Scan className="w-8 h-8 text-slate-400 mx-auto" />
                        <p className="text-slate-900 font-bold">Click to upload stego-image</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleDecode}
                  disabled={!encodedImage || isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-8 rounded-2xl text-lg shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? "Decoding..." : "Start Decoding"}
                </Button>
              </CardContent>
            </Card>

            {isProcessing && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span className="font-mono text-sm text-slate-700 font-bold uppercase">{processingStatus}</span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <Card className="bg-white border border-slate-200 overflow-hidden rounded-3xl shadow-sm">
              <CardHeader className="bg-slate-50 border-b border-slate-200 p-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">Extraction Logic</CardTitle>
                </div>
                <Code2 className="w-4 h-4 text-indigo-400" />
              </CardHeader>
              <CardContent className="p-0">
                <div 
                  ref={pseudoCodeRef}
                  className="p-8 font-mono text-sm overflow-auto max-h-[200px] leading-relaxed bg-white"
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
                <CardTitle className="text-2xl font-outfit text-slate-900">Extracted Message</CardTitle>
                <CardDescription>Restored hidden information.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="min-h-[300px] flex flex-col justify-center border border-slate-100 rounded-2xl bg-slate-50 p-8">
                  {!missionComplete ? (
                    <div className="text-center space-y-4">
                      <Lock className="w-8 h-8 text-slate-200 mx-auto" />
                      <p className="text-slate-500 font-bold">Extraction results will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {contentType === "text" ? (
                        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-900 font-mono leading-relaxed whitespace-pre-wrap font-bold">
                          {decodedContent}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="aspect-video relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                            <img src={decodedImage!} alt="Secret" className="w-full h-full object-contain" />
                          </div>
                          <Button 
                            onClick={downloadDecodedImage}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-8 rounded-2xl shadow-lg flex items-center justify-center gap-2"
                          >
                            <Download className="w-5 h-5" /> Download Image
                          </Button>
                        </div>
                      )}
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

      <a ref={downloadLinkRef} className="hidden"></a>
    </div>
  );
}