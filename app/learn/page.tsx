"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BookOpen, Brain, Zap, Shield, Microscope, ArrowLeft } from "lucide-react";

export default function LearnPage() {
  // Simulated pixel data for visualization
  const coverPixels = [
    { r: 86, g: 142, b: 204 },
    { r: 120, g: 78, b: 165 },
    { r: 220, g: 195, b: 102 },
    { r: 55, g: 128, b: 33 },
  ];
  
  const messageInBinary = "01001000 01101001";
  
  const getBinary = (num: number) => num.toString(2).padStart(8, '0');
  const withChangedLSB = (binary: string, newBit: string) => binary.substring(0, 7) + newBit;

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12 selection:bg-indigo-100 selection:text-indigo-900 bg-[#f8fafc]">
      <header className="mb-16">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-8">
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
      
      <main className="container mx-auto max-w-5xl flex-1">
        <div className="space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-[0.2em] shadow-sm">
              <Microscope className="w-3.5 h-3.5" />
              <span>Education Module</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-outfit font-bold tracking-tight text-slate-900">LSB Principles</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Understanding the science of hiding information in plain sight using digital image bitstream manipulation.
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-2xl mb-12 shadow-sm">
              <TabsTrigger value="overview" className="rounded-xl py-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md font-bold">Conceptual Overview</TabsTrigger>
              <TabsTrigger value="technical" className="rounded-xl py-4 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md font-bold">Technical Mechanics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-white border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all">
                  <CardHeader className="p-8">
                    <div className="p-3 bg-indigo-50 w-fit rounded-xl mb-4">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-2xl font-outfit text-slate-900">What is Steganography?</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 text-slate-600 leading-relaxed font-medium">
                    Unlike cryptography which makes a message unreadable, steganography makes the very existence of a message invisible. It is the art of "covered writing," where secret information is embedded within a carrier medium (like an image) such that it remains undetectable to the human eye.
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all">
                  <CardHeader className="p-8">
                    <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl font-outfit text-slate-900">Why Images?</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 text-slate-600 leading-relaxed font-medium">
                    Digital images are ideal carriers because they contain vast amounts of redundant data. Small changes to pixel values are mathematically significant but visually imperceptible.
                  </CardContent>
                </Card>
              </div>

              <div className="bg-indigo-600 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-white/20 transition-all duration-700" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl font-outfit font-bold">The Rule of Imperceptibility</h3>
                  <p className="text-xl text-indigo-100 leading-relaxed font-light">
                    "The best steganography is the kind that never invites suspicion. If an observer doesn't know there is a message to look for, the first line of defense is successful."
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-12 animate-in fade-in duration-500">
              <Card className="bg-white border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="bg-slate-50 border-b border-slate-200 p-8">
                  <CardTitle className="text-2xl font-outfit text-slate-900">LSB Visualizer</CardTitle>
                  <CardDescription>See how the 'Least Significant Bit' is modified at the pixel level.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coverPixels.map((pixel, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
                        <div 
                          className="w-full h-24 rounded-xl shadow-inner"
                          style={{ backgroundColor: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})` }}
                        />
                        <div className="space-y-3 font-mono text-[10px]">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 uppercase font-bold">Red ({pixel.r})</span>
                            <span className="text-slate-900 font-bold">{getBinary(pixel.r)}</span>
                          </div>
                          <div className="flex justify-between items-center text-indigo-600 font-bold">
                            <span className="uppercase">LSB Modified</span>
                            <span className="bg-indigo-100 px-2 py-0.5 rounded">{withChangedLSB(getBinary(pixel.r), messageInBinary[i] || '0')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">1</div>
                  <h4 className="text-xl font-bold text-slate-900">Binary Conversion</h4>
                  <p className="text-slate-600 font-medium">The secret message is first converted into a continuous stream of bits (0s and 1s).</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">2</div>
                  <h4 className="text-xl font-bold text-slate-900">Bit Substitution</h4>
                  <p className="text-slate-600 font-medium">Each bit from the secret stream replaces the 8th bit of a color channel in the carrier image.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">3</div>
                  <h4 className="text-xl font-bold text-slate-900">Zero Visibility</h4>
                  <p className="text-slate-600 font-medium">Because the 8th bit only changes the color value by 1, the human eye cannot detect the difference.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="mt-32 border-t border-slate-200 py-16 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-3">
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Developer</p>
            <p className="text-slate-900 font-outfit font-bold text-xl">Danial Ebrahimzadeh</p>
            <p className="text-indigo-600 font-bold text-sm tracking-tight">danial.ebrahimzadeh@ou.edu</p>
          </div>
          <div className="flex gap-12 items-center">
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