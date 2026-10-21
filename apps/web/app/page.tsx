'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  CreditCard,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  FolderLock,
  Fuel,
  Globe,
  GraduationCap,
  Laptop,
  Layers,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Target,
  Users,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [mode, setMode] = useState('');
  const [urgency, setUrgency] = useState('');

  // 7 Core Operational Use Cases directly from the official CATCH-AM mandate
  const operationalUseCases = [
    {
      id: '5.1',
      title: 'Fuel & Petroleum Security',
      badge: 'Energy Defense',
      desc: 'Combating fuel diversion, illegal bunkering, pipeline vandalism, fuel tanker route deviations, depot irregularities, and black-market petroleum theft.',
      icon: Fuel,
      image: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '5.2',
      title: 'Border Security & Customs',
      badge: 'Border Interdiction',
      desc: 'Structured intelligence on suspected smuggling corridors, illegal border crossings, customs evasion, and unauthorized movement of restricted goods.',
      icon: Globe,
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '5.3',
      title: 'Anti-Corruption & Accountability',
      badge: 'Public Integrity',
      desc: 'Whistleblower channels for reporting bribery, procurement bid-rigging, abuse of public office, and misappropriation of state and local government resources.',
      icon: Scale,
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '5.4',
      title: 'Environmental Protection',
      badge: 'Ecological Defense',
      desc: 'Geotagged monitoring and investigation of oil spills, illegal artisanal mining, chemical pollution, deforestation, and protected habitat degradation.',
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '5.5',
      title: 'Traffic Safety & Road Corridors',
      badge: 'Highway Safety',
      desc: 'Documenting dangerous driving, overloaded commercial haulage vehicles, interstate highway hazards, road collisions, and unlawful highway checkpoints.',
      icon: Eye,
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '5.6',
      title: 'Emergencies & Disaster Response',
      badge: 'Civil Defense',
      desc: 'Rapid situational reporting for flash floods, major fires, natural disasters, bridge failures, and national electrical grid disruptions to coordinate responders.',
      icon: Flame,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: '5.7',
      title: 'Corporate Security & Ethics',
      badge: 'Enterprise Governance',
      desc: 'Segregated private-sector whistleblowing workspaces for employee misconduct, procurement fraud, asset theft, and regulatory compliance audits.',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // The 8-Stage Intelligence Lifecycle from Section 7 of the mandate
  const workflowSteps = [
    { num: '01', title: 'Report', desc: 'A citizen, employee, organization, or authorized official submits an incident through encrypted digital channels.' },
    { num: '02', title: 'Document', desc: 'Narratives, GPS coordinates, timestamps, photographs, video captures, and digital files are securely attached.' },
    { num: '03', title: 'Register', desc: 'The platform commits the submission to the cryptographic ledger and generates a unique private tracking token.' },
    { num: '04', title: 'Screen', desc: 'Configured workflows and authorized triage officers assess completeness, urgency, duplicate reports, and credibility.' },
    { num: '05', title: 'Route', desc: 'The case is routed directly to the competent authorized authority, enforcement division, or corporate compliance desk.' },
    { num: '06', title: 'Investigate', desc: 'Authorized personnel document follow-up actions, findings, evidence, and decisions within their legal mandate.' },
    { num: '07', title: 'Connect', desc: 'Cross-agency analytics associate recurring patterns, linked vehicles, suspects, and infrastructure assets.' },
    { num: '08', title: 'Resolve & Learn', desc: 'Official case outcomes are recorded, feeding actionable data into national security risk models and preventive policy.' },
  ];

  // Core Guiding Principles from Section 9 of the mandate
  const guidingPrinciples = [
    {
      title: 'Public Interest & Integrity',
      desc: 'Dedicated to protecting human lives, sovereign resources, and national critical assets through accurate, good-faith reporting and disciplined investigation.',
      icon: ShieldCheck,
    },
    {
      title: 'Confidentiality & Whistleblower Safety',
      desc: 'Zero-knowledge cryptographic protection reducing identity exposure, safeguarding citizens and whistleblowers who report in the public interest.',
      icon: Lock,
    },
    {
      title: 'Legality & Due Process',
      desc: 'Strict judicial chain of custody, SHA-256 evidence hashing, and respect for legal mandates, recognizing that an allegation is not proof of wrongdoing.',
      icon: Scale,
    },
    {
      title: 'Multi-Agency Interoperability',
      desc: 'Secure cross-agency coordination between law enforcement, regulators, and emergency bodies without granting unrestricted access to shared data.',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900 font-sans selection:bg-[#006B3C] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT / ACCREDITATION BAR */}
      <div className="bg-[#0B131E] border-b border-slate-800 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between gap-x-6">
          <div className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Defence Industries Corporation of Nigeria (DICON) · GITH Operations</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 whitespace-nowrap">
            <a href="tel:+2347035922044" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <Phone className="w-2.5 h-2.5 text-emerald-400" />
              <span>+234 703 592 2044</span>
            </a>
            <a href="mailto:dicongith@gmail.com" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <Mail className="w-2.5 h-2.5 text-emerald-400" />
              <span>dicongith@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-xs border border-slate-200 bg-white p-0.5 group-hover:border-[#006B3C] transition-colors flex items-center justify-center">
              <img
                src="/logo.png"
                alt="CATCHAM Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-950 font-serif leading-none">
                CATCH-AM
              </span>
              <span className="hidden min-[380px]:block text-[8px] uppercase font-bold tracking-wider text-[#006B3C] mt-0.5">
                NATIONAL CRIME INTELLIGENCE & PUBLIC SAFETY
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-semibold text-slate-700 whitespace-nowrap">
            <Link
              href="/"
              className="text-[#006B3C] font-bold border-b-2 border-[#006B3C] pb-0.5"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-[#006B3C] transition-colors"
            >
              About
            </Link>
            <a
              href="#use-cases"
              className="hover:text-[#006B3C] transition-colors"
            >
              Operational Domains
            </a>
            <a
              href="#credicorp-partnership"
              className="hover:text-[#006B3C] transition-colors flex items-center gap-1.5"
            >
              <span>CREDICORP C.L.I.C.K.D</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                PARTNER
              </span>
            </a>
            <a
              href="#workflow"
              className="hover:text-[#006B3C] transition-colors"
            >
              How It Works
            </a>
            <Link
              href="/track"
              className="hover:text-[#006B3C] transition-colors"
            >
              Track Report
            </Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link
              href={isAuthenticated ? "/dashboard?tab=submit" : "/register?next=/dashboard?tab=submit"}
              className="px-3.5 py-2 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </Link>

            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="px-3.5 py-2 rounded-lg border border-slate-300 hover:border-slate-800 bg-slate-50/80 hover:bg-slate-100 text-slate-800 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs"
            >
              {isAuthenticated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Login</span>
                </>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#006B3C]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-5 py-5 flex flex-col gap-1 shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-[#006B3C] py-3 border-b border-slate-100"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100"
            >
              About
            </Link>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100"
            >
              Operational Domains
            </a>
            <a
              href="#credicorp-partnership"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100 flex items-center justify-between"
            >
              <span>CREDICORP C.L.I.C.K.D Devices</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                PARTNER
              </span>
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100"
            >
              How It Works (8-Stage Workflow)
            </a>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3"
            >
              Track Existing Report
            </Link>

            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2.5">
              <Link
                href={isAuthenticated ? "/dashboard?tab=submit" : "/register?next=/dashboard?tab=submit"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Incident Report</span>
              </Link>
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Go to Dashboard</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                    <span>Login</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative bg-[#090F17] text-white overflow-hidden pt-10 pb-20 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,107,60,0.22),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(15,23,42,0.6),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column: Headline, Mandate, Buttons, Key Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-center min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-semibold w-fit max-w-full mb-5 sm:mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="sm:hidden">DICON · GITH Mandate</span>
              <span className="hidden sm:inline">Defence Industries Corporation of Nigeria (DICON) · GITH Mandate</span>
            </div>

            <h1 className="text-[2rem] leading-[1.15] sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-white sm:leading-[1.1]">
              A National Crime Intelligence & <br className="hidden sm:block" />
              <span className="text-emerald-400">Public Safety Platform.</span>
            </h1>

            <p className="mt-3 text-base sm:text-xl font-serif text-emerald-300/90 font-medium">
              Connecting Intelligence. Protecting Lives. Safeguarding National Assets.
            </p>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              CATCH-AM is a technology-driven digital infrastructure connecting citizens, law enforcement
              bodies, regulatory institutions, and authorized agencies to prevent crime, protect critical
              infrastructure, and preserve judicial evidence integrity across Nigeria.
            </p>

            {/* Action Buttons */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <Link
                href={isAuthenticated ? "/dashboard?tab=submit" : "/register?next=/dashboard?tab=submit"}
                className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3.5 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/60 transition-all flex items-center gap-2 group"
              >
                <span>Submit an Incident Report</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/track"
                className="w-full sm:w-auto justify-center px-6 py-3 sm:py-3.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2.5 backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Play className="w-3 h-3 fill-emerald-400" />
                </div>
                <span>Track Existing Report</span>
              </Link>
            </div>

            {/* Hero Key Stats Strip */}
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 lg:gap-6">
              <div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">37</span>
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-1">States & FCT</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">7</span>
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Operational Domains</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">SHA-256</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Custody Hash Chain</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Zero-Log</span>
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Whistleblower Privacy</p>
              </div>
            </div>
          </div>

          {/* Right Column: Tactical Intelligence Frame with Whistleblower Protection Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <div className="relative aspect-square sm:aspect-[4/5] w-full">
                <img
                  src="/images/police-lights.jpg"
                  alt="National Law Enforcement & Emergency Police Response"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090F17] via-transparent to-transparent opacity-75" />
              </div>

              {/* Floating Overlay Badge: Whistleblower Protection */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xl text-slate-900">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006B3C] shrink-0">
                    <Lock className="w-5 h-5 text-[#006B3C]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">Whistleblower Protection</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Encrypted anonymous channel with tamper-evident tracking tokens
                    </p>
                  </div>
                </div>
                <Link
                  href={isAuthenticated ? "/dashboard?tab=submit" : "/register?next=/dashboard?tab=submit"}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#006B3C] hover:text-emerald-800 transition-colors"
                >
                  <span>Submit Confidential Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE TRIAGE & ROUTING BAR */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 -mt-10 lg:-mt-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-5 sm:p-6 lg:p-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-950 mb-1">
            Rapid Incident Routing & Multi-Agency Triage
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Direct your public-interest report directly into competent law enforcement, regulatory, or emergency workflows.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-center">
            {/* Field 1: Operational Domain */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Operational Domain
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-base sm:text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#006B3C]"
              >
                <option value="">Select Domain</option>
                <option value="petroleum">Fuel & Petroleum Security (Bunkering / Diversion)</option>
                <option value="border">Border Security & Customs Intelligence</option>
                <option value="corruption">Anti-Corruption & Public Accountability</option>
                <option value="environment">Environmental Protection & Mining Hazards</option>
                <option value="traffic">Traffic Safety & Road Corridors</option>
                <option value="emergency">Emergencies & Disaster Response</option>
                <option value="corporate">Corporate Ethics & Compliance</option>
              </select>
            </div>

            {/* Field 2: Jurisdiction */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Jurisdiction / State
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full text-base sm:text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#006B3C]"
              >
                <option value="">Select Location</option>
                <option value="abuja">Abuja (Federal Capital Territory)</option>
                <option value="lagos">Lagos State Command</option>
                <option value="rivers">Rivers State (Niger Delta Basin)</option>
                <option value="kano">Kano State Jurisdiction</option>
                <option value="delta">Delta State Corridor</option>
                <option value="nationwide">Federal Nationwide Jurisdiction</option>
              </select>
            </div>

            {/* Field 3: Submission Mode */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Privacy Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full text-base sm:text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#006B3C]"
              >
                <option value="">Select Mode</option>
                <option value="anonymous">Strictly Anonymous (Zero-Knowledge)</option>
                <option value="confidential">Confidential (Encrypted Token Receipt)</option>
                <option value="verified">Verified Official Agency Intake</option>
              </select>
            </div>

            {/* Field 4: Urgency */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full text-base sm:text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-[#006B3C]"
              >
                <option value="">Select Priority</option>
                <option value="routine">Standard Assessment (Scheduled Triage)</option>
                <option value="high">High Priority (24-48h Review)</option>
                <option value="emergency">Critical / Immediate Threat to Safety</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div className="pt-1 sm:col-span-2 lg:col-span-1 lg:pt-5">
              <Link
                href="/report"
                className="w-full py-3 sm:py-2.5 px-4 bg-[#0B131E] hover:bg-[#006B3C] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 text-center"
              >
                <span>Route Incident</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPERATIONAL USE CASES (The 7 Real Mandate Domains) */}
      <section id="use-cases" className="scroll-mt-20 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            OUR OPERATIONAL USE CASES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-tight mt-4 sm:mt-3">
            Engineered for Multi-Agency Crime Intelligence & Safety
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Rather than requiring separate silos for every sector, CATCH-AM delivers a unified technological
            infrastructure tailored to critical public-interest domains across Nigeria.
          </p>
        </div>

        {/* 7 Operational Use Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {operationalUseCases.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-3 left-4 w-10 h-10 rounded-lg bg-[#006B3C] text-white flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="absolute top-3 right-3 text-[10px] font-bold font-mono tracking-wider bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded border border-white/10">
                    {item.badge}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#006B3C] transition-colors">
                      {item.id} {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006B3C] hover:text-emerald-800 transition-colors"
                    >
                      <span>Read operational mandate</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5.5 STRATEGIC PARTNERSHIP: FG CREDICORP C.L.I.C.K.D PROGRAMME */}
      <section id="credicorp-partnership" className="scroll-mt-20 py-16 sm:py-24 bg-gradient-to-b from-[#060D17] via-[#0A1A28] to-[#060D17] text-white border-y border-emerald-900/40 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>GITH & FG CREDICORP STRATEGIC ALLIANCE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white tracking-tight">
              C.L.I.C.K.D Device Credit Programme
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Discussions are actively progressing between <strong>GITH (DICON)</strong> and the <strong>Federal Government Consumer Credit Corporation (CREDICORP)</strong>. Active Catcham subscribers, tertiary students, and verified civic monitors can access laptops, smartphones, and field tablets on subsidized, flexible consumer credit.
            </p>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-2xl border border-slate-800 bg-[#0B1522]/90 p-6 sm:p-7 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Students & Academic Researchers</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Equipping Nigerian university, polytechnic, and NYSC corps members with modern laptops to advance digital literacy, cybersecurity analysis, and evidence-based civic reporting.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>0% Downpayment on Approved Tiers</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0B1522]/90 p-6 sm:p-7 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Civic Whistleblowers & Field Reporters</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empowering community vigilance monitors with tamper-evident, geotag-enabled 5G smartphones and rugged tablets to document environmental harm, pipeline theft, and security hazards.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pre-installed Secure Forensic Client</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0B1522]/90 p-6 sm:p-7 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Priority Subscriber Clearance</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                GITH platform subscribers benefit from an expedited credit underwriting track through CREDICORP&apos;s C.L.I.C.K.D pipeline, with flexible repayment terms spanning 6 to 18 months.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fast-track NIN & Biometric Matching</span>
              </div>
            </div>
          </div>

          {/* Device Showcase Preview Strip */}
          <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-r from-[#071524] via-[#0B201A] to-[#071524] p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  FG CREDICORP HARDWARE ALLOCATIONS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                  Accessible Digital Hardware on Subsidized Credit
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Devices are pre-calibrated for high data security, verified against national identity databases, and distributed through accredited state tertiary and regional logistics hubs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={isAuthenticated ? "/dashboard?tab=credicorp" : "/register?next=/dashboard?tab=credicorp"}
                  className="px-6 py-3 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Apply on Citizen Dashboard &rarr;</span>
                </Link>

                <a
                  href="https://msmeafricaonline.com/call-for-applications-fg-credicorp-c-l-i-c-k-d-programme-for-students-and-entrepreneurs-credit-for-laptops-and-digital-devices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <span>Official Call for Applications</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Quick 3 Device Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    LAPTOP WORKSTATION
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">₦16,500/mo</span>
                </div>
                <h4 className="text-sm font-bold text-white">Pro-Book 15.6-inch GITH Workstation</h4>
                <p className="text-[11px] text-slate-400">Intel Core i5, 16GB RAM, 512GB SSD, Preloaded Ubuntu/Win11, CATCH-AM Portal</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    FIELD 5G SMARTPHONE
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">₦9,800/mo</span>
                </div>
                <h4 className="text-sm font-bold text-white">SecureCam 5G Reporter Phone</h4>
                <p className="text-[11px] text-slate-400">108MP Geotagging Sensor, 5000mAh Battery, Knox Security, GPS Watermark Camera</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    RUGGED FIELD TABLET
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">₦13,500/mo</span>
                </div>
                <h4 className="text-sm font-bold text-white">Atlas Rugged Field Tablet 11-inch</h4>
                <p className="text-[11px] text-slate-400">11-inch 2K High-Bright Display, 4G LTE + GPS/GLONASS, IP68 Waterproof, Stylus Included</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THE CATCH-AM DIFFERENCE (Platform Architecture & Pillars) */}
      <section id="architecture" className="scroll-mt-20 py-14 sm:py-20 bg-[#F1F5F9] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
            {/* Left Big Card with Institutional Focus */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-[#0A1118] text-white p-6 sm:p-10 flex flex-col justify-between sm:min-h-[420px] shadow-xl">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
                  alt="CATCHAM Security Command Operations"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  THE CATCH-AM DIFFERENCE
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-white mt-4 leading-tight">
                  Connecting Intelligence Across Fragmented Records
                </h3>
                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Traditional reporting systems operate independently with isolated databases and blind spots.
                  CATCH-AM provides a common digital infrastructure associating reports, evidence, geospatial
                  coordinates, and critical national infrastructure into unified workflows.
                </p>
              </div>

              <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/about"
                  className="w-full sm:w-auto justify-center text-center inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Explore Full Mandate & Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: 4 Architectural Pillars */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Multi-Agency Architecture</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Strict organizational workspace segregation. Information sharing is governed by explicit permissions,
                    statutory mandates, and lawful agreements.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center mb-4">
                    <FolderLock className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Unified Intelligence</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Correlates incident reports with recurring patterns, linked vehicles, persons of interest, and designated
                    infrastructure assets.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Whistleblower Protection</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Zero-knowledge cryptographic mechanisms that reduce unnecessary exposure of whistleblower identities and
                    protect sensitive disclosures.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">Critical Asset Intelligence</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Maintains digital representations of designated national pipelines, depots, refineries, stations, and ports,
                    linking threat reports directly to assets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW CATCH-AM WORKS (The 8-Stage Lifecycle from Section 7) */}
      <section id="workflow" className="scroll-mt-20 py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            HOW CATCH-AM WORKS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-950 mt-4 tracking-tight">
            The 8-Stage Incident & Intelligence Lifecycle
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            A structured, auditable procedure transitioning information from initial disclosure to legal resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black font-mono text-emerald-600/30">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-slate-950 mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. GUIDING INSTITUTIONAL PRINCIPLES (Section 9) */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              OUR GUIDING PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white tracking-tight mt-4 sm:mt-3">
              Built on Integrity, Legality & Public Safety
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {guidingPrinciples.map((pr, i) => {
              const Icon = pr.icon;
              return (
                <div
                  key={i}
                  className="bg-[#0B131E] rounded-2xl p-5 sm:p-7 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {pr.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pr.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. OFFICIAL PUBLIC SAFETY ADVISORY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="bg-[#0B131E] rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 sm:gap-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Official Public Safety & Security Advisories</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Subscribe to receive verified threat bulletins, compliance directives, and operational public safety updates.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to CATCH-AM public safety advisories.');
            }}
            className="flex flex-col sm:flex-row w-full lg:w-auto sm:items-center gap-2.5 sm:gap-2 lg:max-w-md"
          >
            <input
              type="email"
              placeholder="Official email address"
              required
              className="w-full sm:flex-1 min-w-0 bg-white text-slate-900 placeholder:text-slate-400 text-base sm:text-xs px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006B3C]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* 10. EXTENSIVE CORPORATE & INSTITUTIONAL FOOTER */}
      <footer id="contact" className="bg-[#060B12] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 sm:gap-10">
          {/* Col 1: Brand & Institutional Mandate */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-emerald-500/40 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="CATCHAM Emblem" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold text-white font-serif">CATCH-AM</span>
            </Link>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              National Crime Intelligence, Public Safety and Compliance Platform under Defence Industries Corporation of Nigeria (DICON) / GITH.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About CATCH-AM
                </Link>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-white transition-colors">
                  Operational Domains
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Platform Architecture
                </a>
              </li>
              <li>
                <a href="#credicorp-partnership" className="hover:text-emerald-400 text-emerald-300 font-semibold transition-colors flex items-center gap-1">
                  <span>CREDICORP Device Credit</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-400 font-bold">FG</span>
                </a>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track a Report
                </Link>
              </li>
              <li>
                <Link href={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-white transition-colors">
                  Login / Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Operational Domains */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">
              Operational Domains
            </h4>
            <ul className="space-y-2">
              <li>Fuel & Petroleum Security</li>
              <li>Border & Customs Interdiction</li>
              <li>Anti-Corruption & Whistleblowing</li>
              <li>Environmental Protection</li>
              <li>Traffic Safety & Road Corridors</li>
              <li>Emergencies & Disaster Response</li>
              <li>Critical Infrastructure Assets</li>
            </ul>
          </div>

          {/* Col 4: Compliance & Technical Standards */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">
              Security Standards
            </h4>
            <ul className="space-y-2">
              <li>SHA-256 Custody Hash Chain</li>
              <li>Zero-Knowledge Whistleblowing</li>
              <li>Argon2id Hash Authentication</li>
              <li>Segregated Agency Workspaces</li>
              <li>Role-Based Access Control (RBAC)</li>
              <li>Immutable Audit Logging</li>
            </ul>
          </div>

          {/* Col 5: Direct Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>DICON / GITH Operational Desk — Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+2347035922044" className="text-white font-mono font-bold hover:text-emerald-400">
                  +234 703 592 2044
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:dicongith@gmail.com" className="text-white hover:text-emerald-400">
                  dicongith@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Available 24/7 – 365 Days</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 py-5 sm:py-6 px-4 sm:px-8 text-center text-slate-500 text-[11px] leading-relaxed">
          <p>© 2026 CATCH-AM — Defence Industries Corporation of Nigeria (DICON) / GITH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
