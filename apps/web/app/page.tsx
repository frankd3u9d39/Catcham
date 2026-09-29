'use client';
import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  ArrowRight,
  Landmark,
  Zap,
  ShieldAlert,
  Droplet,
  FileCheck,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-neutral-white text-neutral-950 font-sans">
      {/* Sovereign Federal Top Strip */}
      <div className="bg-brand-900 text-neutral-white py-1.5 px-6 text-xs text-center border-b border-brand-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <span>Federal Republic of Nigeria • Multi-Agency Public Whistleblowing Platform</span>
          </div>
          <span className="hidden sm:inline font-mono">COURT-ADMISSIBLE • 100% ENCRYPTED</span>
        </div>
      </div>

      {/* Public Header */}
      <header className="border-b border-neutral-200 bg-neutral-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="DICON Logo"
              className="w-11 h-11 object-contain rounded-full shadow-xs bg-white p-0.5 border border-brand-100"
            />
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-950">CATCHAM</span>
              <span className="block text-[11px] text-brand-600 font-semibold uppercase tracking-wider">
                Federal Whistleblower Platform
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/track"
              className="text-sm font-medium text-neutral-700 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Track Report</span>
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-700 hover:text-neutral-950 px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors"
            >
              Agency Officer Sign In
            </Link>
            <Link
              href="/report"
              className="text-sm font-semibold text-neutral-white bg-brand-600 hover:bg-brand-500 px-4 py-2.5 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>Submit Report</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-950 tracking-tight leading-tight max-w-5xl mx-auto">
          A secure platform for reporting incidents, connecting agencies, and supporting investigations.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          CATCHAM coordinates law enforcement, defence authorities, regulatory commissions, and emergency services across Nigeria with cryptographic evidence chain of custody, spatial routing, and sovereign whistleblower protection.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/report"
            className="px-7 py-4 bg-brand-600 hover:bg-brand-500 text-neutral-white font-semibold rounded-xl shadow-md text-base flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <Shield className="w-5 h-5" />
            <span>Submit a Confidential Report</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/track"
            className="px-7 py-4 bg-neutral-white hover:bg-neutral-100 text-neutral-900 font-semibold rounded-xl text-base flex items-center gap-2 border border-neutral-300 shadow-xs transition-all"
          >
            <Search className="w-5 h-5 text-neutral-500" />
            <span>Track Dossier Reference</span>
          </Link>
        </div>

        {/* Live Platform Metrics Strip */}
        <div className="mt-14 pt-8 border-t border-neutral-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="bg-neutral-white border border-neutral-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Territorial Scope</span>
            <h4 className="text-2xl font-black text-neutral-950 mt-1">36 States + FCT</h4>
            <p className="text-xs text-brand-700 font-medium mt-0.5">Full Nationwide Coverage</p>
          </div>
          <div className="bg-neutral-white border border-neutral-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Spatial Resolution</span>
            <h4 className="text-2xl font-black text-neutral-950 mt-1">774 LGAs</h4>
            <p className="text-xs text-brand-700 font-medium mt-0.5">PostGIS Point-in-Polygon</p>
          </div>
          <div className="bg-neutral-white border border-neutral-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Digital Custody</span>
            <h4 className="text-2xl font-black text-neutral-950 mt-1">256-Bit SHA</h4>
            <p className="text-xs text-brand-700 font-medium mt-0.5">Sec. 84 Evidence Certified</p>
          </div>
          <div className="bg-neutral-white border border-neutral-200/80 rounded-xl p-4 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Anonymity Assurance</span>
            <h4 className="text-2xl font-black text-neutral-950 mt-1">Zero Logs</h4>
            <p className="text-xs text-brand-700 font-medium mt-0.5">No IP or Metadata Retained</p>
          </div>
        </div>
      </section>

      {/* SECTION: Core Incident Reporting Classifications */}
      <section className="py-16 px-6 bg-neutral-100/70 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
              Report Direct to Designated Lead Agencies
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              Every report is cryptographically parsed and mapped to the statutory agency holding legal jurisdiction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Link
              href="/report"
              className="bg-neutral-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-neutral-900">Economic & Financial Crimes</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  EFCC • ICPC
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Money laundering, contract inflation, public treasury diversion, bribery, extortion, and illicit financial flows.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>File Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/report"
              className="bg-neutral-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-neutral-900">Critical Infrastructure Vandalism</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  Joint Taskforce
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Pipeline tapping, power transmission sabotage, rail line theft, and undersea cable interference.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>File Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href="/report"
              className="bg-neutral-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-neutral-900">Arms, Defence & Public Security</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
                  DICON • NPF
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Illicit small arms trafficking, unauthorized ordinance manufacturing, sabotage of defence assets, and violent threats.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>File Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              href="/report"
              className="bg-neutral-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Droplet className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-neutral-900">Oil Spills & Environmental Crimes</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  NOSDRA • NUPRC
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Crude spills, artisanal illegal refining (kpo-fire), hazardous chemical dumping, and corporate regulatory concealment.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>File Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5 */}
            <Link
              href="/report"
              className="bg-neutral-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-neutral-900">Procurement Fraud & Checkpoints</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                  BPP • Oversight
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Ghost workers, unexecuted federal capital projects, kickback solicitation, and extortion along transportation corridors.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>File Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6 */}
            <Link
              href="/report"
              className="bg-neutral-white rounded-2xl border border-neutral-200 p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <Flame className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-base font-bold text-neutral-900">Emergency & Public Safety</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                  NEMA • Fire
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Building structural failures, major factory fires, gas explosions, flood blockages, and acute public hazards.
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                <span>File Report</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: How It Works - Whistleblower Lifecycle */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
            How Whistleblowing Operates on CATCHAM
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Engineered with strict zero-knowledge confidentiality and statutory evidentiary compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md mb-4 ring-8 ring-brand-50">
              1
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1.5">Air-Gapped Submission</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Files and narratives are stripped of all device metadata (EXIF, GPS, serial numbers). Zero IP addresses or browser fingerprints are retained.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md mb-4 ring-8 ring-brand-50">
              2
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1.5">PostGIS Routing</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Location coordinates are evaluated against 774 LGA boundary polygons and 36 State boundaries to assign the statutory lead agency automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md mb-4 ring-8 ring-brand-50">
              3
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1.5">Cryptographic Seal</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Every digital asset receives a SHA-256 bitstream fingerprint and Section 84 certificate to ensure court admissibility under the Nigerian Evidence Act.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-md mb-4 ring-8 ring-brand-50">
              4
            </div>
            <h3 className="font-bold text-base text-neutral-900 mb-1.5">Dossier Tracking</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Whistleblowers receive a 16-character alphanumeric reference to view investigation milestones and communicate securely without revealing identity.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: Sovereign Inter-Agency Ecosystem */}
      <section className="py-16 px-6 bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Coordinated Sovereign Institutions
            </h2>
            <p className="text-xs text-neutral-400 mt-2">
              Cross-agency collaboration protocols eliminate inter-agency friction and jurisdiction disputes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">D</span>
              <h4 className="font-bold text-sm text-white">DICON</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Defence Industries Corp</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">E</span>
              <h4 className="font-bold text-sm text-white">EFCC</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Financial Crimes Commission</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">P</span>
              <h4 className="font-bold text-sm text-white">NPF</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Nigeria Police Force</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">I</span>
              <h4 className="font-bold text-sm text-white">ICPC</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Corrupt Practices Commission</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">N</span>
              <h4 className="font-bold text-sm text-white">NOSDRA</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Oil Spill Detection Agency</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">U</span>
              <h4 className="font-bold text-sm text-white">NUPRC</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Petroleum Regulatory Comm.</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">C</span>
              <h4 className="font-bold text-sm text-white">NSCDC</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Civil Defence Corps</p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-2">M</span>
              <h4 className="font-bold text-sm text-white">NEMA</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">Emergency Management</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Evidence Act Section 84 & Legal Security */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight leading-snug">
              Compliant with Section 84 of the Nigerian Evidence Act (2011)
            </h2>
            <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
              Digital evidence collected on CATCHAM is formatted specifically for court admissibility in Nigerian High Courts and Tribunals. From the microsecond an image, video, audio recording, or PDF is received, the bitstream is permanently hashed.
            </p>

            <div className="mt-6 space-y-3.5 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-neutral-900">Immutable SHA-256 Bitstream Fingerprinting:</strong> Any subsequent alteration of evidence invalidates the cryptographic signature immediately.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-neutral-900">Dual-Officer Custody Sign-Off:</strong> Evidence transfers between lead agencies require multi-signature cryptographic authorization.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-neutral-900">Automated Court Certificate Generation:</strong> Ready-to-file Section 84 compliance certificates exported with one click for federal prosecutors.
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Preview Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4 text-xs">
              <span className="font-mono text-brand-400">CERTIFICATE_SEC84_EVIDENCE.PDF</span>
              <span className="px-2 py-0.5 bg-brand-600/30 text-brand-300 rounded font-mono text-[10px]">
                VERIFIED ADMISSIBLE
              </span>
            </div>
            <div className="space-y-3 font-mono text-[11px] text-neutral-300">
              <div>
                <span className="text-neutral-500">EXHIBIT_ID:</span>
                <span className="text-white font-bold"> EVD-2026-00000042</span>
              </div>
              <div>
                <span className="text-neutral-500">INTAKE_TIME:</span>
                <span className="text-white"> 2026-09-28T14:32:19+01:00 (WAT)</span>
              </div>
              <div>
                <span className="text-neutral-500">SHA256_HASH:</span>
                <p className="text-brand-400 break-all bg-neutral-950 p-2 rounded border border-neutral-800 mt-1">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
              </div>
              <div>
                <span className="text-neutral-500">CUSTODY_CHAIN:</span>
                <span className="text-white"> CITIZEN_INTAKE → ENCRYPTION_VAULT → EFCC_FORENSICS</span>
              </div>
              <div className="pt-3 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
                <span>Federal High Court Rules 2019</span>
                <span className="text-brand-400">STATUS: SEALED & ADMISSIBLE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Frequently Asked Questions */}
      <section className="py-16 px-6 bg-neutral-100/60 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-950 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-neutral-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
              <h3 className="font-bold text-sm text-neutral-900 mb-1.5">Will my identity or phone number ever be revealed?</h3>
              <p className="text-neutral-600 leading-relaxed">
                No. If you choose anonymous submission, CATCHAM does not collect your name, phone number, email address, or device IP. Your report is identified only by a generated 16-character dossier reference.
              </p>
            </div>

            <div className="bg-neutral-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
              <h3 className="font-bold text-sm text-neutral-900 mb-1.5">How can I follow up on my report without logging in?</h3>
              <p className="text-neutral-600 leading-relaxed">
                When your report is submitted, you are given a Dossier Reference (e.g., <code className="bg-neutral-100 px-1 py-0.5 rounded text-brand-700">CAT-2026-00000001</code>). You can enter this anytime on the Track Report page to view progress, read encrypted investigator notes, or supply additional evidence.
              </p>
            </div>

            <div className="bg-neutral-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
              <h3 className="font-bold text-sm text-neutral-900 mb-1.5">What formats of evidence can I attach?</h3>
              <p className="text-neutral-600 leading-relaxed">
                CATCHAM accepts high-resolution photographs (JPEG, PNG), audio recordings (MP3, WAV, M4A), video footage (MP4, MOV), and document files (PDF, DOCX, XLSX). All files are automatically scrubbed of metadata and hashed upon upload.
              </p>
            </div>

            <div className="bg-neutral-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
              <h3 className="font-bold text-sm text-neutral-900 mb-1.5">What happens if an incident covers multiple jurisdictions?</h3>
              <p className="text-neutral-600 leading-relaxed">
                CATCHAM’s PostGIS Spatial Engine automatically forms a Joint Multi-Agency Taskforce when an incident spans inter-state boundaries or involves multiple statutory bodies (such as oil theft involving both the EFCC and the Nigeria Police Force).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Final High-Impact Call to Action Banner */}
      <section className="py-16 px-6 bg-brand-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Protect the Commonwealth of Nigeria. Report with Confidence.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-100 max-w-2xl mx-auto leading-relaxed">
            Every submission strengthens our national security, integrity, and rule of law. Your courage is protected by federal encryption standards.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/report"
              className="px-7 py-3.5 bg-white text-neutral-950 font-bold rounded-xl shadow-lg hover:bg-neutral-100 text-sm flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-brand-700" />
              <span className="text-neutral-950 font-bold">Start Encrypted Report</span>
            </Link>
            <Link
              href="/track"
              className="px-7 py-3.5 bg-brand-800 text-white font-semibold rounded-xl border border-brand-700 hover:bg-brand-700 text-sm flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Active Dossier</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Federal Institutional Footer */}
      <footer className="bg-neutral-950 text-neutral-400 py-12 px-6 border-t border-neutral-800 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo.png"
                alt="DICON Logo"
                className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-neutral-700"
              />
              <span className="font-bold text-white text-sm">CATCHAM NIGERIA</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Sovereign Multi-Agency Whistleblowing, Digital Evidence Vault & Incident Investigation Platform.
            </p>
            <span className="mt-3 block text-[10px] text-brand-400 font-mono">DICON DEFENCE SPECIFICATION</span>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Public Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Submit Incident Report
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Dossier Progress
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Whistleblower Protections
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Section 84 Evidence Standards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Official Agencies</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Agency Officer Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Investigator Command Workspace
                </Link>
              </li>
              <li>
                <Link href="/jurisdictions" className="hover:text-white transition-colors">
                  PostGIS Territorial Matrix
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-white transition-colors">
                  Routing Policy Rules Engine
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Legal & Statutory Framework</h4>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Governed under the Evidence Act 2011 (Sec. 84), Freedom of Information Act, and the Cybercrimes (Prohibition, Prevention) Act of the Federal Republic of Nigeria.
            </p>
            <div className="mt-3 flex items-center gap-2 text-brand-400 font-mono text-[10px]">
              <Lock className="w-3.5 h-3.5" />
              <span>256-BIT SOVEREIGN CIPHER</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <span>© 2026 Federal Republic of Nigeria. CATCHAM Sovereign Platform. All statutory rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Security Protocol</span>
            <span className="hover:underline cursor-pointer">Whistleblower Charter</span>
            <span className="hover:underline cursor-pointer">Privacy & Air-Gap Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
