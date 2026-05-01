"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Lock, 
  Binary, 
  ChevronRight, 
  Mail,
  User,
  GraduationCap,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <header className="relative z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="relative h-12 w-40 transition-transform hover:scale-105 duration-300 flex items-center">
              <img src="/Picture5.png" alt="InquireLab" className="max-h-full w-auto object-contain" />
            </div>
            
            <div className="h-10 w-px bg-slate-200 hidden md:block" />
            
            <div className="relative h-12 w-52 transition-transform hover:scale-105 duration-300 flex items-center">
              <img src="/College%20of%20Engineering_linear-crimson-WEB.png" alt="School" className="max-h-full w-auto object-contain" />
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold text-slate-500">
            <Link href="/learn" className="hover:text-indigo-600 transition-colors">Lab Guide</Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="container mx-auto px-6 pt-24 pb-32">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-[0.2em] shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Cyber Security Workshop Tool</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-outfit font-bold tracking-tight text-slate-900 leading-tight">
              Steganography <br/>
              <span className="text-indigo-600">Education Lab.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              An educational platform developed for participants to understand and practice image steganography using the Least Significant Bit (LSB) method.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <Link href="/encode">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-8 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 group transition-all">
                  Encode Message
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/decode">
                <Button className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-10 py-8 rounded-2xl text-lg font-bold shadow-sm transition-all">
                  Decode Carrier
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Lock, 
                title: "LSB Method", 
                desc: "Hide secret messages by modifying the least significant bits of image pixels.",
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              { 
                icon: Binary, 
                title: "Bit Manipulation", 
                desc: "Learn how binary data is mapped to RGB channels in common image formats.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                icon: GraduationCap, 
                title: "Workshop Focus", 
                desc: "Specifically prepared as a teaching tool for cybersecurity education sessions.",
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              }
            ].map((feature, i) => (
              <Card key={i} className="bg-white border border-slate-200 overflow-hidden group hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <div className={`p-4 w-fit rounded-2xl ${feature.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-outfit font-bold text-slate-900 tracking-tight">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200 pt-20 pb-12 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Developer</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-outfit font-bold text-slate-900">Danial Ebrahimzadeh</h4>
                  <p className="text-indigo-600 font-semibold text-lg">PhD Student, University of Oklahoma</p>
                </div>
                <div className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-colors group cursor-pointer w-fit">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href="mailto:danial.ebrahimzadeh@ou.edu" className="font-semibold">danial.ebrahimzadeh@ou.edu</a>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-10">
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Partners</p>
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-8">
                <div className="h-16 flex items-center p-3 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition-all">
                  <img src="/fema.png" alt="FEMA" className="h-full w-auto object-contain" />
                </div>
                
                <div className="h-16 flex items-center p-3 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition-all">
                  <img src="/oklahoma%20homeland%20security.png" alt="OHS" className="h-full w-auto object-contain" />
                </div>

                <div className="h-16 flex items-center p-3 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition-all">
                  <img src="/oklahoma%20office%20of%20homeland%20security.png" alt="OOHS" className="h-full w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold tracking-wide uppercase">
            <p>© 2026 Steganography Lab • University of Oklahoma</p>
            <div className="flex gap-8">
              <span className="hover:text-indigo-600 cursor-default transition-colors">Educational Tool</span>
              <span className="hover:text-indigo-600 cursor-default transition-colors">Secure Labs</span>
              <span className="hover:text-indigo-600 cursor-default transition-colors">Cyber Outreach</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
