'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import {
  Shield,
  ShieldCheck,
  Eye,
  Lock,
  LogIn,
  Globe,
  Database,
  Users,
  Compass,
  FileText,
  AlertTriangle,
  Building2,
  Cpu,
  MapPin,
  Flame,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Award,
  Layers,
  Search,
  Fuel,
  TrendingUp,
  FolderLock,
  Target,
  Menu,
  X
} from 'lucide-react';

export default function AboutPage() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const architecturalPillars = [
    {
      letter: 'A',
      title: 'Multi-Agency Architecture',
      desc: 'Shared technological environment supporting multiple government ministries, law enforcement agencies, regulatory bodies, and authorized private entities with strict data segregation and permissioned information sharing.',
      icon: Users,
    },
    {
      letter: 'B',
      title: 'Unified Intelligence & Incident Management',
      desc: 'Consolidates reports, multimedia evidence, incident ledgers, and investigative milestones into unified digital records, uncovering hidden correlations across recurring patterns, vehicles, assets, or persons.',
      icon: Database,
    },
    {
      letter: 'C',
      title: 'Whistleblower-Centred Reporting',
      desc: 'Empowers public-interest reporting with zero-knowledge cryptographic anonymity, confidential channels, encrypted verification receipts, and protection against identity exposure.',
      icon: Lock,
    },
    {
      letter: 'D',
      title: 'Geospatial Intelligence',
      desc: 'Associates reports and incidents with precise GPS coordinates, transit corridors, geopolitical jurisdictions, hotspot clusters, and route-compliance parameters for real-time situational awareness.',
      icon: Compass,
    },
    {
      letter: 'E',
      title: 'Evidence & Investigation Management',
      desc: 'Structured intake for incident narratives, photos, videos, audio recordings, and documents, governed by SHA-256 hash chains, immutable audit trails, and strict judicial chain-of-custody protocols.',
      icon: FolderLock,
    },
    {
      letter: 'F',
      title: 'Critical Infrastructure Intelligence',
      desc: 'Maintains live digital representations of designated national infrastructure—pipelines, fuel depots, refineries, stations, and ports—linking reported threats directly to affected assets.',
      icon: Building2,
    },
  ];

  const operationalUseCases = [
    {
      id: '5.1',
      title: 'Fuel & Petroleum Security',
      badge: 'National Energy Defense',
      desc: 'Comprehensive reporting, monitoring, and forensic tracking across Nigeria’s energy value chain.',
      points: [
        'Suspected fuel diversion & depot irregular discharges',
        'Illegal bunkering & pipeline vandalism incidents',
        'Fuel tanker GPS route compliance & unauthorized offloading',
        'Suspected petroleum product theft and black market distribution',
      ],
      icon: Fuel,
    },
    {
      id: '5.2',
      title: 'Border Security & Customs Intelligence',
      badge: 'Border Interdiction',
      desc: 'Supports intelligence collection and inter-agency coordination along sovereign land, maritime, and air borders.',
      points: [
        'Documentation of suspected smuggling & contraband transit',
        'Illegal border crossings and irregular entry points',
        'Customs duty evasion and non-declaration of restricted cargo',
        'Inter-agency notification for prompt enforcement',
      ],
      icon: Globe,
    },
    {
      id: '5.3',
      title: 'Anti-Corruption & Public Accountability',
      badge: 'Governance & Integrity',
      desc: 'Structured whistleblower disclosures and institutional compliance oversight for public resources.',
      points: [
        'Bribery, extortion, and procurement bid-rigging disclosures',
        'Abuse of office, nepotism, and regulatory circumvention',
        'Misappropriation of public funds and capital project tracking',
        'Preservation of tamper-proof evidentiary disclosures',
      ],
      icon: ShieldCheck,
    },
    {
      id: '5.4',
      title: 'Environmental Protection',
      badge: 'Ecological Defense',
      desc: 'Geotagged monitoring of ecological hazards, industrial non-compliance, and wildlife crimes.',
      points: [
        'Oil spill detection, pipeline leaks, and marine contamination',
        'Illegal artisanal mining and toxic chemical runoff',
        'Deforestation, illegal logging, and national park encroachment',
        'Coordination with environmental compliance authorities (NESREA/NOSDRA)',
      ],
      icon: Layers,
    },
    {
      id: '5.5',
      title: 'Traffic Safety & Road Corridors',
      badge: 'Corridor Safety',
      desc: 'Incident logging and hazard management across major interstate highways and commercial arteries.',
      points: [
        'Dangerous driving, reckless transit, and overloaded haulage trucks',
        'Interstate road traffic collisions and hazard hotspots',
        'Suspicious or unsafe transport and illegal roadblocks',
        'Corridor telemetry feeding into highway safety authorities',
      ],
      icon: Eye,
    },
    {
      id: '5.6',
      title: 'Emergencies & Disaster Response',
      badge: 'Civil Defense',
      desc: 'Situational awareness and community alerting during natural disasters and critical incidents.',
      points: [
        'Flash flooding, severe weather impacts, and dam breaches',
        'Industrial fire outbreaks and major explosions',
        'Bridge collapses, grid blackouts, and infrastructure failures',
        'Immediate routing to official emergency rescue responders (NEMA/SEMA)',
      ],
      icon: Flame,
    },
    {
      id: '5.7',
      title: 'Corporate Security & Ethics',
      badge: 'Enterprise Compliance',
      desc: 'Enterprise-grade whistleblowing and confidential investigation portals for corporations.',
      points: [
        'Internal employee misconduct, payroll fraud, and theft',
        'Procurement irregularities and supply-chain leakage',
        'Whistleblowing compliance hotlines (ISO 37002 aligned)',
        'Segregated private workspaces with strict NDA boundaries',
      ],
      icon: Building2,
    },
  ];

  const workflowSteps = [
    { num: '01', title: 'Report', desc: 'A citizen, employee, organization, or authorized official submits an incident through encrypted digital channels.' },
    { num: '02', title: 'Document', desc: 'Narratives, GPS coordinates, timestamps, photographs, video captures, and digital files are securely attached.' },
    { num: '03', title: 'Register', desc: 'The platform commits the submission to the cryptographic ledger and generates a unique private tracking token.' },
    { num: '04', title: 'Screen', desc: 'Configured workflows and authorized triage officers assess completeness, urgency, duplicate reports, and credibility.' },
    { num: '05', title: 'Route', desc: 'The case is routed directly to the competent authorized authority, enforcement division, or corporate compliance desk.' },
    { num: '06', title: 'Investigate', desc: 'Authorized investigators document field notes, evidence chain of custody, witness follow-ups, and case findings.' },
    { num: '07', title: 'Connect', desc: 'Cross-agency analytics associate recurring patterns, linked vehicles, suspects, and infrastructure assets.' },
    { num: '08', title: 'Resolve & Learn', desc: 'Official case outcomes are recorded, feeding actionable data into national security risk models and preventive policy.' },
  ];

  const principles = [
    { name: 'Public Interest', desc: 'Supporting the protection of lives, sovereign resources, and vital infrastructure.' },
    { name: 'Integrity', desc: 'Encouraging accurate, good-faith disclosures and disciplined, objective investigation.' },
    { name: 'Confidentiality', desc: 'Protecting whistleblower identities and sensitive data with end-to-end safeguards.' },
    { name: 'Accountability', desc: 'Preserving traceable, immutable, reviewable audit logs of all access and actions.' },
    { name: 'Legality', desc: 'Conducting evidence handling, reporting, and routing in full accordance with national law.' },
    { name: 'Fairness', desc: 'Treating allegations responsibly, ensuring due process before adverse administrative actions.' },
    { name: 'Interoperability', desc: 'Fostering seamless inter-agency collaboration without granting unrestricted access.' },
    { name: 'Innovation', desc: 'Deploying advanced cryptography, AI indexing, and GIS mapping to protect public safety.' },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900 font-sans selection:bg-[#006B3C] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0B131E] border-b border-slate-800 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-between gap-x-6">
          <div className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Operational Network: DICON/CATCH-AM — Federal Republic of Nigeria</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 whitespace-nowrap">
            <a href="tel:+2347035922044" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <Phone className="w-2.5 h-2.5 text-emerald-400" />
              <span>+234 703 592 2044</span>
            </a>
            <a href="mailto:diconcatcham@gmail.com" className="hover:text-emerald-400 flex items-center gap-1 transition-colors">
              <Mail className="w-2.5 h-2.5 text-emerald-400" />
              <span>diconcatcham@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 shadow-xs border border-slate-200 bg-white p-0.5 group-hover:border-[#006B3C] transition-colors flex items-center justify-center">
              <img src="/logo.png" alt="CATCHAM Emblem" className="w-full h-full object-contain" />
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
            <Link href="/" className="hover:text-[#006B3C] transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-[#006B3C] font-bold border-b-2 border-[#006B3C] pb-0.5">
              About
            </Link>
            <Link href="/#use-cases" className="hover:text-[#006B3C] transition-colors">
              Operational Domains
            </Link>
            <Link href="/#workflow" className="hover:text-[#006B3C] transition-colors">
              How It Works
            </Link>
            <Link href="/track" className="hover:text-[#006B3C] transition-colors">
              Track Report
            </Link>
          </nav>

          {/* Action CTAs */}
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
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-[#006B3C] py-3 border-b border-slate-100"
            >
              About
            </Link>
            <Link
              href="/#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100"
            >
              Operational Domains
            </Link>
            <Link
              href="/#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-slate-800 hover:text-[#006B3C] py-3 border-b border-slate-100"
            >
              How It Works (8-Stage Workflow)
            </Link>
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
      <section className="relative bg-[#090F17] text-white py-14 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,107,60,0.25),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.8),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-semibold max-w-full mb-5 sm:mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>National Institutional Framework & Technical Mandate</span>
            </div>

            <h1 className="text-[2rem] sm:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight leading-[1.1]">
              ABOUT <span className="text-emerald-400">CATCH-AM</span>
            </h1>

            <p className="mt-4 text-lg sm:text-2xl font-serif text-emerald-400/95 font-semibold">
              A National Crime Intelligence, Public Safety and Compliance Platform
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-sm">
              <p className="text-sm sm:text-base text-slate-200 font-medium italic">
                “CATCH-AM: Connecting Intelligence. Protecting Lives. Safeguarding National Assets.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 1: WHO WE ARE */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
              1. WHO WE ARE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-950 mt-4 leading-tight">
              A Unified Digital Public Safety Operating System
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                <strong>CATCH-AM</strong> is a technology-driven National Crime Intelligence and Public Safety Platform
                designed to support critical public-interest reporting, intelligence coordination, lawful investigations,
                regulatory compliance, and emergency response across the Federal Republic of Nigeria.
              </p>
              <p>
                The platform is envisioned as a shared digital infrastructure capable of serving multiple government agencies,
                law enforcement bodies, regulatory institutions, emergency management organizations, and private-sector
                enterprises through a coordinated but strictly access-controlled technological environment.
              </p>
              <p>
                CATCH-AM provides a rigorous framework for receiving disclosures, documenting incidents, managing evidence,
                identifying multi-jurisdictional patterns, tracking investigations, and presenting actionable intelligence in a
                structured manner.
              </p>
              <p>
                Its core purpose is to help authorized institutions move from fragmented reporting channels and disconnected
                paper records toward a synchronized, data-informed approach to public safety, national asset protection, and
                institutional accountability.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0B131E] rounded-2xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Shared Digital Foundation</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Instead of each sector building isolated, vulnerable reporting silos, CATCH-AM delivers a hardened, scalable
              common foundation for all operational mandates.
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Multi-Agency Data Segregation with Explicit Access Grants</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero-Knowledge Cryptographic Whistleblower Anonymity</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Immutable SHA-256 Hash-Chained Evidentiary Ledger</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Live Critical Infrastructure & Asset Corroboration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTIONS 2 & 3: VISION & MISSION */}
      <section className="py-12 sm:py-16 bg-[#F1F5F9] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#006B3C]">
                  2. OUR VISION
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-950 mt-2 mb-4">
                  The National Operating Standard
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To evolve into a trusted <strong>National Digital Public Safety Operating System</strong> that strengthens
                  crime intelligence, protects critical infrastructure, supports lawful investigations, promotes accountability,
                  and dramatically improves coordination among authorized public and private institutions.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#006B3C]">
                  3. OUR MISSION
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-950 mt-2 mb-4">
                  Harnessing Secure Digital Systems
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our mission is to harness technology, responsible citizen participation, structured intelligence, and secure
                  digital systems to help prevent crime, identify suspicious activities, protect national assets, strengthen
                  institutional compliance, and support timely responses to public safety threats.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mt-3">
                  We provide a scalable platform through which relevant information can be submitted, assessed, organized, and
                  made available to authorized users according to their statutory responsibilities and legal authority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: THE CATCH-AM DIFFERENCE */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
            4. THE CATCH-AM DIFFERENCE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-950 mt-4 tracking-tight">
            Architected for Interoperability & Evidence Integrity
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Traditional reporting systems operate independently with disconnected databases, manual handoffs, and zero cross-agency visibility.
            CATCH-AM introduces a revolutionary multi-tier technical architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
          {architecturalPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.letter}
                className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      PILLAR {pillar.letter}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. SECTION 5: OPERATIONAL USE CASES */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
              5. OUR OPERATIONAL USE CASES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white mt-4 tracking-tight">
              Engineered for Cross-Sector National Public Safety
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              CATCH-AM powers specialized intelligence workflows tailored to sovereign enforcement priorities and enterprise governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {operationalUseCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.id}
                  className="bg-[#0B131E] rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {useCase.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {useCase.id} {useCase.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {useCase.desc}
                    </p>

                    <ul className="space-y-2 border-t border-slate-800/80 pt-3">
                      {useCase.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: CRITICAL INFRASTRUCTURE */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
              6. CRITICAL INFRASTRUCTURE & ASSET INTELLIGENCE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-950 mt-4 leading-tight">
              Connecting Threat Reports to Physical Sovereign Assets
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              An essential innovation of the CATCH-AM architecture is maintaining a digital twin of designated national infrastructure.
              Reports are never isolated text—they link directly to affected pipelines, depots, refineries, terminals, and transport corridors.
            </p>
            <div className="mt-6 grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 text-xs font-semibold text-slate-800">
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                <Fuel className="w-4 h-4 text-[#006B3C]" />
                <span>Pipelines & Corridors</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#006B3C]" />
                <span>Fuel Depots & Terminals</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#006B3C]" />
                <span>Refineries & Ports</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#006B3C]" />
                <span>National Grid Facilities</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-[#0A1811] text-white p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold font-serif mb-3">Actionable Situational Awareness</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              By connecting incidents to assets, CATCH-AM enables authorized operational commands to observe recurring threats,
              geographical clusters, route deviations, and preventive intervention points in real time.
            </p>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 text-xs text-emerald-300">
              <p className="font-mono">
                Access to designated critical infrastructure telemetry is restricted strictly in accordance with statutory mandates,
                operational clearance, and institutional security classifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION 7: HOW CATCH-AM WORKS (8 Steps) */}
      <section className="py-14 sm:py-20 bg-[#F8FAFC] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
              7. HOW CATCH-AM WORKS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-950 mt-4 tracking-tight">
              The 8-Stage Intelligence Lifecycle
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              From citizen disclosure to institutional case closure, every step follows strict verification, auditing, and routing standards.
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
        </div>
      </section>

      {/* 10. SECTION 8 & 9: PRIVACY, SECURITY & GUIDING PRINCIPLES */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Privacy & Safeguards */}
          <div className="lg:col-span-6">
            <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
              8. PRIVACY, SECURITY & WHISTLEBLOWER PROTECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-950 mt-4 mb-4">
              Cryptographic Safeguards by Design
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              CATCH-AM recognizes that public-interest reporting involves sensitive disclosures. The platform implements:
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
                <Lock className="w-4 h-4 text-[#006B3C] shrink-0 mt-0.5" />
                <span><strong>Role-Based Access Control (RBAC):</strong> Granular permissions restricting sensitive data to validated mandates.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
                <Layers className="w-4 h-4 text-[#006B3C] shrink-0 mt-0.5" />
                <span><strong>Organizational Segregation:</strong> Strict workspace isolation between government bodies, agencies, and corporations.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#006B3C] shrink-0 mt-0.5" />
                <span><strong>Whistleblower Anonymity:</strong> Zero-knowledge architecture preventing unauthorized identity revelation.</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-3">
                <FileText className="w-4 h-4 text-[#006B3C] shrink-0 mt-0.5" />
                <span><strong>Immutable Audit Trails:</strong> Cryptographic verification of all viewing, forwarding, and case modifications.</span>
              </div>
            </div>
          </div>

          {/* Guiding Principles */}
          <div className="lg:col-span-6">
            <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
              9. OUR GUIDING PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-950 mt-4 mb-4">
              Core Institutional Values
            </h2>
            <div className="grid sm:grid-cols-2 gap-3.5 mt-6">
              {principles.map((pr, i) => (
                <div key={i} className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-950 mb-1 text-[#006B3C]">
                    {pr.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {pr.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. SECTIONS 10, 11 & 12: PARTNERSHIPS, AMBITION & COMMITMENT */}
      <section className="py-14 sm:py-20 bg-[#0B131E] text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-16">
            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                10. GOVERNANCE & PARTNERSHIPS
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-2 mb-3">
                Institutional Mandates
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Actual participation, access to government databases, institutional endorsements, and operational enforcement
                depend on formal statutory authorizations and bilateral agreements. CATCH-AM does not independently exercise
                statutory police powers, but provides the secure technology that empowers competent authorities.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                11. LONG-TERM AMBITION
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-2 mb-3">
                National Public Safety OS
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                CATCH-AM is evolving into a comprehensive National Digital Public Safety Operating System, unifying incident reporting,
                geospatial intelligence, asset telemetry, and multi-agency coordination to drive data-informed security governance.
              </p>
            </div>

            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                12. OUR COMMITMENT
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-2 mb-3">
                Safeguarding Society
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By connecting citizens, reports, evidence, critical national assets, and authorized institutions through a secure
                digital framework, CATCH-AM contributes to a safer, more accountable, and resilient nation.
              </p>
            </div>
          </div>

          {/* Institutional Banner */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 rounded-2xl p-6 sm:p-12 border border-emerald-500/40 text-center">
            <h2 className="text-xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
              CATCH-AM — One Platform. Multiple Missions. Intelligence for Public Safety.
            </h2>
            <p className="mt-3 text-sm text-emerald-300/90 max-w-2xl mx-auto">
              Connecting Intelligence. Protecting Lives. Safeguarding National Assets.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/report"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-[#006B3C] hover:bg-[#005731] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                Submit an Incident Report
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                Track Existing Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. DIRECT CONTACT CARD (DICON/CATCH-AM) */}
      <section id="contact" className="scroll-mt-20 py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-md">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <span className="text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#006B3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl sm:rounded-full inline-block max-w-full leading-snug">
                OPERATIONAL CONTACT & INSTITUTIONAL LIAISON
              </span>
              <h3 className="text-2xl font-bold font-serif text-slate-950 mt-3">
                DICON/CATCH-AM Operational Desk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                For agency onboarding, multi-agency data integration agreements, operational inquiries,
                and technical liaisons with the Defence Industries Corporation of Nigeria.
              </p>
            </div>

            <div className="md:col-span-5 bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200 space-y-3.5 min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Division</span>
                  <span className="text-xs font-bold text-slate-950">DICON/CATCH-AM Institutional Operations</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Email Liaison</span>
                  <a href="mailto:diconcatcham@gmail.com" className="text-xs font-bold text-[#006B3C] hover:underline">
                    diconcatcham@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-[#006B3C] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Hotline & Operations</span>
                  <a href="tel:+2347035922044" className="text-xs font-bold text-slate-950 hover:text-[#006B3C]">
                    +234 703 592 2044
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. EXTENSIVE FOOTER */}
      <footer className="bg-[#060B12] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 sm:gap-10">
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white border border-emerald-500/40 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="CATCHAM Emblem" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-bold text-white font-serif">CATCH-AM</span>
            </Link>
            <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
              National Crime Intelligence, Public Safety and Compliance Platform under DICON/CATCH-AM.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-emerald-400 font-bold">About CATCH-AM</Link></li>
              <li><Link href="/#use-cases" className="hover:text-white transition-colors">Operational Domains</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Report</Link></li>
              <li><Link href={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-white transition-colors">Login / Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Operations</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Petroleum & Energy Defense</li>
              <li>Border & Customs Intelligence</li>
              <li>Anti-Corruption & Whistleblowing</li>
              <li>Environmental Compliance</li>
              <li>Critical Infrastructure Security</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Security Standards</h4>
            <ul className="space-y-2 text-slate-400">
              <li>SHA-256 Custody Ledgers</li>
              <li>Zero-Knowledge Privacy</li>
              <li>Argon2id Hash Authentication</li>
              <li>Multi-Agency Workspaces</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4">Direct Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>DICON Headquarters & Operations Center, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+2347035922044" className="text-white font-mono font-bold hover:text-emerald-400">+234 703 592 2044</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:diconcatcham@gmail.com" className="text-white hover:text-emerald-400">diconcatcham@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 py-5 sm:py-6 px-4 sm:px-8 text-center text-slate-500 text-[11px] leading-relaxed">
          <p>© 2026 CATCH-AM — Defence Industries Corporation of Nigeria (DICON/CATCH-AM). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
