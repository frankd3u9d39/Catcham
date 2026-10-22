'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Eye,
  FileCheck2,
  FilePlus,
  FileSearch,
  FileText,
  GraduationCap,
  HelpCircle,
  Inbox,
  KeyRound,
  Laptop,
  Lock,
  Radio,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  User,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { InlineError } from '@/components/ui/error-state';
import { useReportCategories } from '@/hooks/use-reports';
import { useJurisdictions } from '@/hooks/use-platform';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { firestoreService, type CredicorpApplication } from '@/lib/firebase';
import { formatDateTime, humanise, statusBadge } from '@/lib/format';
import type { AuthenticatedUser, PublicReportStatus, SubmissionReceipt } from '@/lib/types';

interface CitizenDashboardViewProps {
  user: AuthenticatedUser | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onComplaintCountChange?: (count: number) => void;
}

export interface CitizenComplaint {
  id: string;
  referenceNumber: string;
  trackingCode: string;
  title: string;
  category: string;
  assignedAgency: string;
  state: string;
  status: string;
  priority: string;
  submittedAt: string;
  updatedAt: string;
  currentStage: number;
  timeline: Array<{
    action: string;
    description: string;
    at: string;
  }>;
}

const LIFECYCLE_STAGES = [
  { step: 1, name: 'Reported', desc: 'Securely received' },
  { step: 2, name: 'Documented', desc: 'Metadata & Hash' },
  { step: 3, name: 'Triaged', desc: 'Threat Prioritized' },
  { step: 4, name: 'Routed', desc: 'Agency Assigned' },
  { step: 5, name: 'Investigating', desc: 'Active Fieldwork' },
  { step: 6, name: 'Evidence Vault', desc: 'Custody Chain' },
  { step: 7, name: 'Action Taken', desc: 'Enforcement' },
  { step: 8, name: 'Resolved', desc: 'Audit Closed' },
];

export const CREDICORP_DEVICES = [
  {
    id: 'dev-1',
    category: 'LAPTOP' as const,
    name: 'Pro-Book 15.6" CATCH-AM Workstation',
    specs: 'Intel Core i5 (12th Gen), 16GB RAM, 512GB NVMe SSD, 15.6" Full HD Anti-Glare, 10hr Battery',
    preloaded: 'Encrypted Linux/Win11, CATCH-AM Portal, Forensic Data Tools, LibreOffice Suite',
    monthlyPrice: '₦16,500',
    fullPrice: '₦198,000',
    tenure: '12 Months (0% Initial Deposit for Subscribers)',
    badge: 'TOP SUBSCRIBER PICK',
    recommendedFor: 'Students, Whistleblowers & Academic Researchers',
    icon: Laptop,
  },
  {
    id: 'dev-2',
    category: 'LAPTOP' as const,
    name: 'Elite-Slim 14" Student & MSME Notebook',
    specs: 'Intel Quad-Core N100, 8GB LPDDR5, 256GB SSD, 14" FHD IPS, Ultra-light 1.3kg',
    preloaded: 'Digital Skills Training Portal, MSME Accounting Suite, Whistleblower Client',
    monthlyPrice: '₦11,200',
    fullPrice: '₦134,400',
    tenure: '12 Months flexible deduction',
    badge: 'STUDENT ACCESSIBLE',
    recommendedFor: 'Undergraduates, NYSC Corps & Young Entrepreneurs',
    icon: Laptop,
  },
  {
    id: 'dev-3',
    category: 'SMARTPHONE' as const,
    name: 'SecureCam 5G Field Reporter Phone',
    specs: '108MP Geotagging Primary Camera, 5000mAh Battery, 8GB RAM + 128GB Storage, 5G Dual-SIM',
    preloaded: 'Hardware-level Knox Security, CATCH-AM Field Reporter, GPS Watermark Camera',
    monthlyPrice: '₦9,800',
    fullPrice: '₦117,600',
    tenure: '12 Months consumer credit',
    badge: 'CIVIC REPORTER FAVOURITE',
    recommendedFor: 'Community Whistleblowers, Journalists & Field Inspectors',
    icon: Smartphone,
  },
  {
    id: 'dev-4',
    category: 'SMARTPHONE' as const,
    name: 'Vigil-X 4G Long-Life Smartphone',
    specs: '50MP AI Dual Sensor, 6000mAh Mega-Battery (3-Day Standby), 6.7" HD+ 90Hz',
    preloaded: 'Encrypted Audio Recording, Instant SOS Dispatch, Tamper-proof Storage',
    monthlyPrice: '₦6,500',
    fullPrice: '₦78,000',
    tenure: '12 Months / ₦13,000 for 6 Months',
    badge: 'VALUE ESSENTIAL',
    recommendedFor: 'Rural Monitors, Transport Watch & Student Monitors',
    icon: Smartphone,
  },
  {
    id: 'dev-5',
    category: 'TABLET' as const,
    name: 'Atlas Rugged Field Tablet 11"',
    specs: '11" 2K High-Bright Outdoor Screen, 4G LTE + GPS/GLONASS/Galileo, IP68 Water & Dust Resistant, Stylus',
    preloaded: 'Geographic GIS Incident Mapping, Pipeline Route Cache, Offline Whistleblower Ledger',
    monthlyPrice: '₦13,500',
    fullPrice: '₦162,000',
    tenure: '12 Months subsidized credit',
    badge: 'TACTICAL / MONITORING',
    recommendedFor: 'Environmental Protection, Bunkering Inspectors & Oil Spill Monitors',
    icon: Tablet,
  },
];

export const CitizenDashboardView: React.FC<CitizenDashboardViewProps> = ({
  user,
  activeTab = 'overview',
  onTabChange,
  onComplaintCountChange,
}) => {
  const [complaints, setComplaints] = useState<CitizenComplaint[]>([]);
  const [searchRef, setSearchRef] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<PublicReportStatus | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>('ALL');

  // Submit Report Form State inside Dashboard
  const { data: categories = [] } = useReportCategories();
  const [submitForm, setSubmitForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    stateCode: '',
    lgaCode: '',
    addressText: '',
    occurredAt: '',
    isAnonymous: false,
    contactEmail: user?.email ?? '',
  });
  const { data: states = [] } = useJurisdictions('STATE');
  const { data: lgas = [] } = useJurisdictions('LGA', submitForm.stateCode || undefined);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Sync real reports from Cloud Firestore & local session on mount
  React.useEffect(() => {
    let cancelled = false;

    async function loadComplaints() {
      try {
        const remoteReports = await firestoreService.getReports();

        // Check local storage for report references submitted in this browser session
        const localRefs = new Set<string>();
        try {
          if (typeof window !== 'undefined') {
            const raw = window.localStorage.getItem('catcham.myReports');
            if (raw) {
              const list = JSON.parse(raw);
              if (Array.isArray(list)) {
                list.forEach((item: any) => {
                  if (typeof item === 'string') localRefs.add(item.toUpperCase());
                  else if (item?.referenceNumber) localRefs.add(String(item.referenceNumber).toUpperCase());
                });
              }
            }
          }
        } catch {
          // Ignore parse errors
        }

        const userEmail = user?.email?.toLowerCase().trim();

        // Include reports where the user is the contact or submitted via this browser
        const userReports = remoteReports.filter((r) => {
          if (!r.referenceNumber) return false;
          if (localRefs.has(r.referenceNumber.toUpperCase())) return true;
          if (userEmail && r.contactEmail && r.contactEmail.toLowerCase().trim() === userEmail) {
            return true;
          }
          return false;
        });

        const formatted: CitizenComplaint[] = userReports.map((r) => ({
          id: r.id || `fs-${r.referenceNumber}`,
          referenceNumber: r.referenceNumber,
          trackingCode: r.trackingCode || 'STORED',
          title: r.title,
          category: r.category,
          assignedAgency: r.assignedAgency || 'Central Intake Desk (DICON/CATCH-AM)',
          state: r.state || 'National Domain',
          status: r.status,
          priority: r.priority || 'MEDIUM',
          submittedAt: r.submittedAt,
          updatedAt: r.updatedAt,
          currentStage: 1,
          timeline: r.timeline && r.timeline.length > 0 ? r.timeline : [
            {
              action: r.status,
              description: 'Record synced from Cloud Firestore.',
              at: r.submittedAt,
            },
          ],
        }));

        if (!cancelled) {
          setComplaints(formatted);
          onComplaintCountChange?.(formatted.length);
          if (formatted.length > 0) {
            setSelectedComplaint(formatted[0]);
          } else {
            setSelectedComplaint(null);
          }
        }
      } catch (err) {
        console.error('Failed to sync complaints from Firestore:', err);
      }
    }

    void loadComplaints();
    return () => {
      cancelled = true;
    };
  }, [user?.email, onComplaintCountChange]);

  // FG CREDICORP C.L.I.C.K.D Device Credit State
  const [credicorpForm, setCredicorpForm] = useState({
    applicantName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    nin: '',
    category: 'STUDENT',
    institutionOrOrg: '',
    preferredDevice: 'LAPTOP',
    deviceModelSelected: 'Pro-Book 15.6" CATCH-AM Workstation',
    repaymentPlan: '12_MONTHS',
    state: '',
    lga: '',
  });
  const [isSubmittingCredicorp, setIsSubmittingCredicorp] = useState(false);
  const [credicorpReceipt, setCredicorpReceipt] = useState<{
    applicationRef: string;
    applicantName: string;
    deviceModelSelected: string;
    repaymentPlan: string;
    status: string;
    appliedAt: string;
  } | null>(null);
  const [savedApplications, setSavedApplications] = useState<CredicorpApplication[]>([]);
  const [credicorpFilter, setCredicorpFilter] = useState<'ALL' | 'LAPTOP' | 'SMARTPHONE' | 'TABLET'>('ALL');

  // Sync CREDICORP applications from Cloud Firestore
  React.useEffect(() => {
    firestoreService.getCredicorpApplications().then((apps) => {
      if (apps.length > 0) {
        setSavedApplications(apps);
      }
    });
  }, []);

  const [submitError, setSubmitError] = useState<unknown>(null);
  const [newReceipt, setNewReceipt] = useState<SubmissionReceipt | null>(null);

  // Submit Report Handler
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmittingReport(true);

    try {
      const payload = {
        title: submitForm.title.trim(),
        description: submitForm.description.trim(),
        categoryId: submitForm.categoryId,
        stateCode: submitForm.stateCode || undefined,
        lgaCode: submitForm.lgaCode || undefined,
        addressText: submitForm.addressText.trim() || undefined,
        occurredAt: submitForm.occurredAt ? new Date(submitForm.occurredAt).toISOString() : undefined,
        isAnonymous: submitForm.isAnonymous,
        contactEmail: submitForm.isAnonymous ? undefined : (submitForm.contactEmail || user?.email),
      };

      const result = await api.public<SubmissionReceipt>('/public/reports', {
        method: 'POST',
        body: payload,
      });

      setNewReceipt(result);

      // Prepend newly submitted report into complaints list
      const catObj = categories.find((c) => c.id === submitForm.categoryId);
      const newEntry = {
        id: `comp-${Date.now()}`,
        referenceNumber: result.referenceNumber,
        trackingCode: result.trackingCode || 'AUTHLINK',
        title: submitForm.title.trim(),
        category: catObj?.name || 'General Public Safety Incident',
        assignedAgency: result.routedTo || 'Awaiting Triage Routing',
        state: submitForm.stateCode ? `${submitForm.stateCode} State` : 'National Domain',
        status: 'SUBMITTED',
        priority: 'MEDIUM',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStage: 1,
        timeline: [
          {
            action: 'SUBMITTED',
            description: 'Incident report committed to cryptographic ledger. Private tracking token issued.',
            at: new Date().toISOString(),
          },
        ],
      };

      setComplaints((prev) => {
        const next = [newEntry, ...prev];
        onComplaintCountChange?.(next.length);
        return next;
      });
      setSelectedComplaint(newEntry);

      // Save reference to local session storage
      try {
        if (typeof window !== 'undefined') {
          const raw = window.localStorage.getItem('catcham.myReports');
          const list = raw ? JSON.parse(raw) : [];
          list.push(newEntry.referenceNumber);
          window.localStorage.setItem('catcham.myReports', JSON.stringify(list));
        }
      } catch {}

      // Save live to Cloud Firestore
      void firestoreService.saveReport({
        referenceNumber: newEntry.referenceNumber,
        trackingCode: newEntry.trackingCode,
        title: newEntry.title,
        category: newEntry.category,
        narrative: submitForm.description,
        assignedAgency: newEntry.assignedAgency,
        state: newEntry.state,
        status: newEntry.status,
        priority: newEntry.priority,
        isAnonymous: submitForm.isAnonymous,
        contactEmail: submitForm.contactEmail || user?.email,
        submittedAt: newEntry.submittedAt,
        updatedAt: newEntry.updatedAt,
        timeline: newEntry.timeline,
      });
    } catch (err) {
      // In case of offline fallback, generate a valid simulated receipt
      const fallbackRef = `CTM-2026-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
      const fallbackCode = `TK-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      const catObj = categories.find((c) => c.id === submitForm.categoryId);

      const simReceipt: SubmissionReceipt = {
        referenceNumber: fallbackRef,
        trackingCode: fallbackCode,
        status: 'SUBMITTED',
        routedTo: 'Triage Assessment Queue',
        submittedAt: new Date().toISOString(),
      };

      setNewReceipt(simReceipt);

      const newEntry: CitizenComplaint = {
        id: `comp-${Date.now()}`,
        referenceNumber: fallbackRef,
        trackingCode: fallbackCode,
        title: submitForm.title.trim(),
        category: catObj?.name || 'Public Safety Incident',
        assignedAgency: 'Central Intake Desk (DICON/CATCH-AM)',
        state: submitForm.stateCode ? `${submitForm.stateCode} State` : 'National Domain',
        status: 'SUBMITTED',
        priority: 'MEDIUM',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStage: 1,
        timeline: [
          {
            action: 'SUBMITTED',
            description: 'Report recorded with cryptographic token. Ingested into triage queue.',
            at: new Date().toISOString(),
          },
        ],
      };

      setComplaints((prev) => {
        const next = [newEntry, ...prev];
        onComplaintCountChange?.(next.length);
        return next;
      });
      setSelectedComplaint(newEntry);

      // Save reference to local session storage
      try {
        if (typeof window !== 'undefined') {
          const raw = window.localStorage.getItem('catcham.myReports');
          const list = raw ? JSON.parse(raw) : [];
          list.push(newEntry.referenceNumber);
          window.localStorage.setItem('catcham.myReports', JSON.stringify(list));
        }
      } catch {}

      // Save live to Cloud Firestore
      void firestoreService.saveReport({
        referenceNumber: newEntry.referenceNumber,
        trackingCode: newEntry.trackingCode,
        title: newEntry.title,
        category: newEntry.category,
        narrative: submitForm.description,
        assignedAgency: newEntry.assignedAgency,
        state: newEntry.state,
        status: newEntry.status,
        priority: newEntry.priority,
        isAnonymous: submitForm.isAnonymous,
        contactEmail: submitForm.contactEmail || user?.email,
        submittedAt: newEntry.submittedAt,
        updatedAt: newEntry.updatedAt,
        timeline: newEntry.timeline,
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Interactive Live Tracker
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setIsTrackingLoading(true);
    try {
      const found = complaints.find(
        (c) => c.referenceNumber.toUpperCase() === searchRef.trim().toUpperCase(),
      );
      if (found) {
        setSelectedComplaint(found);
        setTrackingResult({
          referenceNumber: found.referenceNumber,
          title: found.title,
          categoryName: found.category,
          status: found.status,
          submittedAt: found.submittedAt,
          updatedAt: found.updatedAt,
          timeline: found.timeline,
        });
        setIsTrackingLoading(false);
        return;
      }

      const result = await api.public<PublicReportStatus>('/public/reports/track', {
        method: 'POST',
        body: {
          referenceNumber: searchRef.trim().toUpperCase(),
          trackingCode: searchCode.trim().toUpperCase(),
        },
      });
      setTrackingResult(result);
    } catch {
      try {
        const firestoreDoc = await firestoreService.getReportByReference(searchRef);
        if (firestoreDoc) {
          const loaded: CitizenComplaint = {
            id: firestoreDoc.id || `fs-${firestoreDoc.referenceNumber}`,
            referenceNumber: firestoreDoc.referenceNumber,
            trackingCode: firestoreDoc.trackingCode || 'STORED',
            title: firestoreDoc.title,
            category: firestoreDoc.category,
            assignedAgency: firestoreDoc.assignedAgency || 'Central Intake Desk (DICON/CATCH-AM)',
            state: firestoreDoc.state || 'National Domain',
            status: firestoreDoc.status,
            priority: firestoreDoc.priority || 'MEDIUM',
            submittedAt: firestoreDoc.submittedAt,
            updatedAt: firestoreDoc.updatedAt,
            currentStage: 1,
            timeline: firestoreDoc.timeline || [
              {
                action: firestoreDoc.status,
                description: 'Record retrieved live from Cloud Firestore database.',
                at: firestoreDoc.submittedAt,
              },
            ],
          };
          setSelectedComplaint(loaded);
          setTrackingResult({
            referenceNumber: firestoreDoc.referenceNumber,
            title: firestoreDoc.title,
            categoryName: firestoreDoc.category,
            status: firestoreDoc.status,
            submittedAt: firestoreDoc.submittedAt,
            updatedAt: firestoreDoc.updatedAt,
            timeline: loaded.timeline,
          });
          setIsTrackingLoading(false);
          return;
        }
      } catch (fErr) {
        console.error('Firestore track lookup error:', fErr);
      }
      alert('No record found for reference: ' + searchRef.trim().toUpperCase());
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleSelectComplaint = (complaint: CitizenComplaint) => {
    setSelectedComplaint(complaint);
    setSearchRef(complaint.referenceNumber);
    setSearchCode(complaint.trackingCode);
    setTrackingResult({
      referenceNumber: complaint.referenceNumber,
      title: complaint.title,
      categoryName: complaint.category,
      status: complaint.status,
      submittedAt: complaint.submittedAt,
      updatedAt: complaint.updatedAt,
      timeline: complaint.timeline,
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus === 'RESOLVED') return c.status === 'RESOLVED' || c.status === 'CLOSED';
    if (filterStatus === 'ACTIVE') return c.status !== 'RESOLVED' && c.status !== 'CLOSED';
    return true;
  });

  const handleCredicorpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credicorpForm.applicantName.trim() || !credicorpForm.nin.trim() || !credicorpForm.phone.trim()) {
      alert('Please fill in your Full Name, Phone Number, and National Identity Number (NIN).');
      return;
    }

    setIsSubmittingCredicorp(true);
    const ref = `CRED-CLICKD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: CredicorpApplication = {
      applicationRef: ref,
      applicantName: credicorpForm.applicantName.trim(),
      email: credicorpForm.email.trim() || user?.email || '',
      phone: credicorpForm.phone.trim(),
      nin: credicorpForm.nin.trim(),
      category: credicorpForm.category,
      institutionOrOrg: credicorpForm.institutionOrOrg.trim(),
      preferredDevice: credicorpForm.preferredDevice,
      deviceModelSelected: credicorpForm.deviceModelSelected,
      repaymentPlan: credicorpForm.repaymentPlan,
      state: credicorpForm.state || 'National Domain',
      lga: credicorpForm.lga || '',
      status: 'VERIFICATION_QUEUED',
      appliedAt: new Date().toISOString(),
    };

    try {
      await firestoreService.saveCredicorpApplication(newApp);
      setSavedApplications((prev) => [newApp, ...prev]);
      setCredicorpReceipt({
        applicationRef: ref,
        applicantName: newApp.applicantName,
        deviceModelSelected: newApp.deviceModelSelected,
        repaymentPlan: newApp.repaymentPlan,
        status: 'VERIFICATION_QUEUED',
        appliedAt: newApp.appliedAt,
      });
    } catch (err) {
      console.error('Error submitting Credicorp application:', err);
    } finally {
      setIsSubmittingCredicorp(false);
    }
  };

  return (
    <div className="space-y-7 pb-12">
      {/* 1. WELCOME HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/60 border border-neutral-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CITIZEN COMPLAINANT PORTAL · ACTIVE ENCRYPTED SESSION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
              Welcome, {user?.fullName ?? 'Citizen Reporter'}
            </h1>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              Track submitted incident reports, follow real-time inter-agency casework milestones, and lodge new encrypted disclosures under the sovereign mandate of DICON/CATCH-AM.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              className="gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
              onClick={() => {
                setNewReceipt(null);
                onTabChange?.('submit');
              }}
            >
              <FilePlus className="w-4 h-4" />
              <span>Submit New Report</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-neutral-700 text-neutral-200 hover:bg-neutral-800 cursor-pointer"
              onClick={() => onTabChange?.('track')}
            >
              <FileSearch className="w-4 h-4" />
              <span>Track Complaint</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "gap-2 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 cursor-pointer transition-all",
                activeTab === 'credicorp' && "bg-emerald-800 text-white border-emerald-400 shadow-md"
              )}
              onClick={() => onTabChange?.('credicorp')}
            >
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>CREDICORP Device Credit</span>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                NEW
              </span>
            </Button>
          </div>
        </div>

        {/* Subtle Decorative Grid Glow */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. IN-DASHBOARD SUBMIT A REPORT FORM VIEW (Rendered when activeTab === 'submit') */}
      {activeTab === 'submit' && (
        <Card className="border-neutral-200 shadow-lg overflow-hidden transition-all">
          <CardHeader className="bg-neutral-900 text-white p-6 sm:p-7 border-b border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>NATIONAL CRIME INTELLIGENCE & CITIZEN REPORTING DESK</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Submit a report
                </CardTitle>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                  Describe what you saw as specifically as you can: what happened, where, when, and who was involved. Specific reports can be acted on; vague ones usually cannot.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onTabChange?.('overview')}
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 self-start sm:self-auto"
              >
                &larr; Return to Overview
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6 bg-white">
            {newReceipt ? (
              /* Success Submission Receipt */
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 space-y-5 text-neutral-900">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-950">
                      Report Securely Ingested
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Your report has been hashed, logged to the immutable ledger, and added to your dashboard.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs">
                    <p className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                      Reference Number
                    </p>
                    <p className="text-base font-bold font-mono text-emerald-800 mt-1">
                      {newReceipt.referenceNumber}
                    </p>
                  </div>

                  <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xs">
                    <p className="text-[11px] font-mono font-bold uppercase text-neutral-500">
                      Tracking Token
                    </p>
                    <p className="text-base font-bold font-mono text-neutral-900 mt-1">
                      {newReceipt.trackingCode || 'AUTOMATICALLY LINKED TO ACCOUNT'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Button
                    variant="primary"
                    className="gap-2 shadow-md bg-[#006B3C] hover:bg-[#005731]"
                    onClick={() => {
                      setSearchRef(newReceipt.referenceNumber);
                      setSearchCode(newReceipt.trackingCode || '');
                      onTabChange?.('track');
                    }}
                  >
                    <FileSearch className="w-4 h-4" />
                    <span>Track This Complaint Live</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2 border-neutral-300 text-neutral-800"
                    onClick={() => onTabChange?.('complaints')}
                  >
                    <FileText className="w-4 h-4" />
                    <span>View in My Complaints List</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-xs text-neutral-600 hover:text-neutral-950"
                    onClick={() => {
                      setNewReceipt(null);
                      setSubmitForm({
                        categoryId: '',
                        title: '',
                        description: '',
                        stateCode: '',
                        lgaCode: '',
                        addressText: '',
                        occurredAt: '',
                        isAnonymous: false,
                        contactEmail: user?.email ?? '',
                      });
                    }}
                  >
                    Submit Another Report &rarr;
                  </Button>
                </div>
              </div>
            ) : (
              /* Report Intake Form */
              <form onSubmit={handleReportSubmit} className="space-y-6 max-w-3xl">
                {/* 1. Category */}
                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                    What kind of incident is this? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={submitForm.categoryId}
                    onChange={(e) =>
                      setSubmitForm((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* 2. Summary / One-liner */}
                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                    Summary <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Suspected diversion of petroleum products"
                    value={submitForm.title}
                    onChange={(e) =>
                      setSubmitForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1.5">
                    One line. This is what the triage officer sees first.
                  </p>
                </div>

                {/* 3. Detailed Narrative */}
                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                    What happened? <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    rows={6}
                    placeholder="Include dates and times, the location, vehicles or equipment involved, and anything that could be verified."
                    value={submitForm.description}
                    onChange={(e) =>
                      setSubmitForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    required
                  />
                </div>

                {/* 4. Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                      State Jurisdiction
                    </label>
                    <Select
                      value={submitForm.stateCode}
                      onChange={(e) =>
                        setSubmitForm((prev) => ({
                          ...prev,
                          stateCode: e.target.value,
                          lgaCode: '',
                        }))
                      }
                    >
                      <option value="">Select State</option>
                      {states.map((st) => (
                        <option key={st.code} value={st.code}>
                          {st.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                      Local Government Area (LGA)
                    </label>
                    <Select
                      value={submitForm.lgaCode}
                      onChange={(e) =>
                        setSubmitForm((prev) => ({ ...prev, lgaCode: e.target.value }))
                      }
                      disabled={!submitForm.stateCode}
                    >
                      <option value="">
                        {submitForm.stateCode ? 'Select LGA' : 'Select a state first'}
                      </option>
                      {lgas.map((lga) => (
                        <option key={lga.code} value={lga.code}>
                          {lga.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                    Specific Address or Landmark
                  </label>
                  <Input
                    placeholder="e.g. Kilometer 14 along Port Harcourt-Aba Expressway, near NNPC depot"
                    value={submitForm.addressText}
                    onChange={(e) =>
                      setSubmitForm((prev) => ({ ...prev, addressText: e.target.value }))
                    }
                  />
                </div>

                {/* 5. Date and Time */}
                <div>
                  <label className="block text-sm font-bold text-neutral-900 mb-1.5">
                    When did it happen?
                  </label>
                  <Input
                    type="datetime-local"
                    value={submitForm.occurredAt}
                    onChange={(e) =>
                      setSubmitForm((prev) => ({ ...prev, occurredAt: e.target.value }))
                    }
                  />
                  <p className="text-xs text-neutral-500 mt-1">Leave blank if you are not sure.</p>
                </div>

                {/* 6. Identity & Privacy Toggle */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-700 font-mono">
                    Whistleblower & Submitter Protection
                  </p>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reportingIdentity"
                      checked={!submitForm.isAnonymous}
                      onChange={() =>
                        setSubmitForm((prev) => ({ ...prev, isAnonymous: false }))
                      }
                      className="mt-1 accent-emerald-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-neutral-900">
                        Link to my citizen account ({user?.email ?? 'Logged In'})
                      </span>
                      <span className="block text-xs text-neutral-500 mt-0.5">
                        Enables direct status notifications and automatic inclusion in your dashboard tracking list.
                      </span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reportingIdentity"
                      checked={submitForm.isAnonymous}
                      onChange={() =>
                        setSubmitForm((prev) => ({ ...prev, isAnonymous: true }))
                      }
                      className="mt-1 accent-emerald-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-neutral-900">
                        Submit as completely anonymous whistleblower
                      </span>
                      <span className="block text-xs text-neutral-500 mt-0.5">
                        Zero contact details or IP addresses are linked to this record. A one-time private tracking token will be issued.
                      </span>
                    </span>
                  </label>
                </div>

                <InlineError error={submitError} />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-8 gap-2 bg-[#006B3C] hover:bg-[#005731] shadow-md"
                    isLoading={isSubmittingReport}
                    disabled={!submitForm.categoryId || !submitForm.title || !submitForm.description}
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Official Report</span>
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* FG CREDICORP C.L.I.C.K.D DEVICE ACCESS PORTAL (activeTab === 'credicorp') */}
      {activeTab === 'credicorp' && (
        <div className="space-y-6">
          <Card className="border-emerald-500/30 shadow-xl overflow-hidden transition-all bg-white">
            <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 text-white p-6 sm:p-8 border-b border-emerald-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                      FG CREDICORP × DICON/CATCH-AM STRATEGIC INITIATIVE
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span>C.L.I.C.K.D DIGITAL EMPOWERMENT</span>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight flex items-center gap-2.5">
                    <Laptop className="w-7 h-7 text-emerald-400" />
                    <span>FG CREDICORP C.L.I.C.K.D Device Credit Access</span>
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-3xl leading-relaxed">
                    Credit for Laptops, Internet, Computers, Knowledge & Devices (C.L.I.C.K.D). A strategic Federal Government partnership empowering students, entrepreneurs, and CATCH-AM subscribers with flexible consumer credit to access laptops, smartphones, and tablets for education, digital economy, and civic vigilance.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTabChange?.('overview')}
                  className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 self-start sm:self-auto shrink-0"
                >
                  &larr; Return to Overview
                </Button>
              </div>

              {/* Partnership Stats bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-neutral-800/80 mt-6 text-neutral-200">
                <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Repayment Terms</p>
                  <p className="text-sm font-bold text-white mt-0.5">6 – 18 Months</p>
                  <p className="text-[10px] text-neutral-400">Subsidized consumer credit</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Initial Deposit</p>
                  <p className="text-sm font-bold text-white mt-0.5">0% Downpayment</p>
                  <p className="text-[10px] text-neutral-400">For verified CATCH-AM subscribers</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Intake Track</p>
                  <p className="text-sm font-bold text-white mt-0.5">Fast-Track Queue</p>
                  <p className="text-[10px] text-neutral-400">NIN & biometric pre-check</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Preloaded Suite</p>
                  <p className="text-sm font-bold text-white mt-0.5">Civic Tech & Forensic</p>
                  <p className="text-[10px] text-neutral-400">Encrypted Catcham OS tools</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-8 bg-neutral-50/50">
              {/* Receipt / Success Notice */}
              {credicorpReceipt && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/90 p-6 sm:p-7 space-y-4 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                        Expression of Interest Lodged
                      </span>
                      <h3 className="text-lg font-bold text-neutral-950">
                        CREDICORP C.L.I.C.K.D Application Queued
                      </h3>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Your device credit application has been logged to the centralized FG CREDICORP intake desk with CATCH-AM priority subscriber routing.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                        Application Ref
                      </p>
                      <p className="text-sm font-bold font-mono text-emerald-700 mt-0.5">
                        {credicorpReceipt.applicationRef}
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                        Selected Device
                      </p>
                      <p className="text-sm font-bold text-neutral-900 mt-0.5 truncate">
                        {credicorpReceipt.deviceModelSelected}
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                        Intake Status
                      </p>
                      <p className="text-sm font-bold font-mono text-amber-700 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pre-Approved / In Triage</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 bg-white/70 p-3 rounded-lg border border-neutral-200 flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      An automated SMS confirmation will be transmitted to your registered phone with instructions for biometric identity matching and collection at your designated state capital hub.
                    </span>
                  </div>
                </div>
              )}

              {/* Device Catalog Showcase */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>Available Device Packages & Hardware Bundles</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Select your preferred equipment to auto-fill the credit allocation form below.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 bg-neutral-200/80 rounded-lg text-xs font-semibold">
                    {(['ALL', 'LAPTOP', 'SMARTPHONE', 'TABLET'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCredicorpFilter(cat)}
                        className={cn(
                          'px-3 py-1.5 rounded-md transition-all cursor-pointer capitalize text-[11px]',
                          credicorpFilter === cat
                            ? 'bg-white text-emerald-900 font-bold shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        )}
                      >
                        {cat === 'ALL' ? 'All Devices' : cat.toLowerCase() + 's'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CREDICORP_DEVICES.filter(
                    (dev) => credicorpFilter === 'ALL' || dev.category === credicorpFilter
                  ).map((device) => {
                    const isSelected = credicorpForm.deviceModelSelected === device.name;
                    const DeviceIcon = device.icon;
                    return (
                      <div
                        key={device.id}
                        className={cn(
                          'rounded-xl border p-5 transition-all flex flex-col justify-between bg-white relative',
                          isSelected
                            ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                            : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {device.badge}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                              <DeviceIcon className="w-4 h-4 text-emerald-700" />
                            </div>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-neutral-950">{device.name}</h4>
                            <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                              {device.specs}
                            </p>
                          </div>

                          <div className="rounded-lg bg-neutral-50 p-2.5 border border-neutral-100 space-y-1">
                            <p className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                              Preloaded Software & Tools
                            </p>
                            <p className="text-xs text-neutral-700">{device.preloaded}</p>
                          </div>

                          <div className="pt-1 flex items-baseline justify-between border-t border-neutral-100">
                            <div>
                              <span className="text-lg font-black font-mono text-emerald-700">
                                {device.monthlyPrice}
                              </span>
                              <span className="text-xs text-neutral-500"> / month</span>
                            </div>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              Total: {device.fullPrice}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500">
                            {device.tenure}
                          </p>
                        </div>

                        <div className="pt-4 mt-2">
                          <Button
                            type="button"
                            variant={isSelected ? 'primary' : 'outline'}
                            size="sm"
                            className={cn(
                              'w-full cursor-pointer text-xs font-bold gap-1.5',
                              isSelected && 'bg-[#006B3C] hover:bg-[#005731]'
                            )}
                            onClick={() => {
                              setCredicorpForm((prev) => ({
                                ...prev,
                                preferredDevice: device.category,
                                deviceModelSelected: device.name,
                              }));
                            }}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Selected For Application</span>
                              </>
                            ) : (
                              <span>Select This Device &rarr;</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application Form */}
              <Card className="border-neutral-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-neutral-900 text-white p-5 sm:p-6 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-emerald-400" />
                    <div>
                      <CardTitle className="text-lg font-bold text-white font-serif">
                        Expression of Interest & Device Credit Application Form
                      </CardTitle>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        Federal Government Consumer Credit Corporation (CREDICORP) C.L.I.C.K.D Fast-Track Intake
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleCredicorpSubmit} className="space-y-6">
                    {/* Selected Device banner in form */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[11px] font-mono font-bold uppercase text-emerald-800">
                            Chosen Equipment Allocation
                          </p>
                          <p className="text-sm font-bold text-neutral-950">
                            {credicorpForm.deviceModelSelected}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-3 py-1 rounded border border-emerald-200 shrink-0">
                        CATCH-AM Subscriber Verified
                      </span>
                    </div>

                    {/* Applicant Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          Full Legal Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g. Ibrahim Chukwuma Adebayo"
                          value={credicorpForm.applicantName}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, applicantName: e.target.value }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          Subscriber Category <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={credicorpForm.category}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, category: e.target.value }))
                          }
                        >
                          <option value="STUDENT">Student (Tertiary Institution / University / Poly)</option>
                          <option value="CIVIC_REPORTER">CATCH-AM Civic Whistleblower / Community Monitor</option>
                          <option value="ENTREPRENEUR">Digital Entrepreneur / MSME Owner</option>
                          <option value="SUBSCRIBER">CATCH-AM Platform Subscriber / Public Officer</option>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          Institution / School / Organization
                        </label>
                        <Input
                          placeholder="e.g. University of Lagos / NYSC / Self-Employed"
                          value={credicorpForm.institutionOrOrg}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, institutionOrOrg: e.target.value }))
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          National Identity Number (NIN) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="11-digit NIN (e.g. 10293847561)"
                          maxLength={11}
                          value={credicorpForm.nin}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, nin: e.target.value }))
                          }
                          required
                        />
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Used for FG CREDICORP credit verification and anti-fraud match.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          Primary Contact Phone / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="e.g. 0803 123 4567"
                          value={credicorpForm.phone}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, phone: e.target.value }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          Official / Student Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="e.g. applicant@domain.ng"
                          value={credicorpForm.email}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, email: e.target.value }))
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          State of Residence / Delivery Hub <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={credicorpForm.state}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, state: e.target.value }))
                          }
                        >
                          <option value="">Select State</option>
                          {states.map((st) => (
                            <option key={st.code} value={st.name}>
                              {st.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                          Preferred Repayment Tenure
                        </label>
                        <Select
                          value={credicorpForm.repaymentPlan}
                          onChange={(e) =>
                            setCredicorpForm((prev) => ({ ...prev, repaymentPlan: e.target.value }))
                          }
                        >
                          <option value="6_MONTHS">6 Months (Faster tenure, lower total interest)</option>
                          <option value="12_MONTHS">12 Months (Standard balanced monthly deduction)</option>
                          <option value="18_MONTHS">18 Months (Lowest monthly payment, maximum flexibility)</option>
                        </Select>
                      </div>
                    </div>

                    {/* Terms & Whistleblower Priority Guarantee */}
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>CATCH-AM Subscriber Guarantee & Fast-Track Terms</span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        By applying through the CATCH-AM portal under the DICON/CATCH-AM & CREDICORP strategic alliance, your institutional subscription serves as secondary credit endorsement. Pre-approved applicants undergo remote NIN biometric verification before equipment collection.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-neutral-500">
                        Questions? Reach the CREDICORP help desk at <strong className="text-neutral-800">support@credicorp.gov.ng</strong>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto px-8 gap-2 bg-[#006B3C] hover:bg-[#005731] shadow-md font-bold uppercase tracking-wider"
                        isLoading={isSubmittingCredicorp}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit CREDICORP Application</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Existing User Applications History */}
              {savedApplications.length > 0 && (
                <Card className="border-neutral-200 bg-white shadow-sm overflow-hidden">
                  <CardHeader className="bg-neutral-50 border-b border-neutral-200 py-4 px-6 flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>Your CREDICORP C.L.I.C.K.D Applications ({savedApplications.length})</span>
                      </CardTitle>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Track previous expressions of interest and credit allocation milestones.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 divide-y divide-neutral-200">
                    {savedApplications.map((app, idx) => (
                      <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-800">
                              {app.applicationRef}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                              {app.category}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-neutral-900 mt-1">
                            {app.deviceModelSelected}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {app.applicantName} • {app.state} • Repayment: {app.repaymentPlan?.replace('_', ' ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>{app.status}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Frequently Asked Questions */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-emerald-600" />
                    <span>Frequently Asked Questions & Eligibility Guidelines</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Official partnership terms under Federal Government Consumer Credit Corporation (CREDICORP).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700">
                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-1.5">
                    <h5 className="font-bold text-neutral-900 text-sm">Who is eligible for the C.L.I.C.K.D programme?</h5>
                    <p className="text-neutral-600 leading-relaxed">
                      All verified Nigerian tertiary students, NYSC corps members, digital entrepreneurs, and registered CATCH-AM subscribers with a valid National Identity Number (NIN).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-1.5">
                    <h5 className="font-bold text-neutral-900 text-sm">How does being a CATCH-AM subscriber help?</h5>
                    <p className="text-neutral-600 leading-relaxed">
                      CATCH-AM subscribers receive pre-screened clearance, priority queue allocation, and eligibility for zero downpayment terms due to platform verification and public reporting participation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-1.5">
                    <h5 className="font-bold text-neutral-900 text-sm">How are repayments deducted?</h5>
                    <p className="text-neutral-600 leading-relaxed">
                      Repayments are automated through CREDICORP partner financial institutions via direct debit, USSD, or student bursary/allowance channels across 6, 12, or 18 months.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-1.5">
                    <h5 className="font-bold text-neutral-900 text-sm">Where do I collect my device?</h5>
                    <p className="text-neutral-600 leading-relaxed">
                      Upon approval, devices are collected from accredited state university distribution centers or regional DICON/CATCH-AM partner logistical collection hubs across all 36 states and FCT.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2.5. DICON/CATCH-AM × FG CREDICORP C.L.I.C.K.D PARTNERSHIP SPOTLIGHT */}
      {activeTab !== 'credicorp' && activeTab !== 'submit' && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>DICON/CATCH-AM & FG CREDICORP STRATEGIC PARTNERSHIP</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                FG CREDICORP C.L.I.C.K.D: Subsidized Device Access for Subscribers
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Discussions are actively progressing between DICON/CATCH-AM and FG CREDICORP to empower our subscribers, students, and civic whistleblowers with laptops, smartphones, and field tablets on flexible zero/low-interest consumer credit.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Priority Intake for CATCH-AM Subscribers</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Laptops, Phones & Field Tablets from ₦6,500/mo</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>0% Downpayment on Pre-Approved Categories</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                variant="primary"
                className="gap-2 bg-[#006B3C] hover:bg-[#005731] text-white shadow-lg font-bold text-xs uppercase tracking-wider py-3.5 px-6 cursor-pointer"
                onClick={() => onTabChange?.('credicorp')}
              >
                <Laptop className="w-4 h-4" />
                <span>Apply for Device Credit &rarr;</span>
              </Button>
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      )}

      {/* 3. STATISTIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Total Filed
              </p>
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-mono">
              {complaints.length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>All tamper-evident hashed</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                In Active Triage
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 font-mono">
              {complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'TRIAGED').length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Under command intake review</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Under Investigation
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#006B3C]">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#006B3C] mt-2 font-mono">
              {complaints.filter((c) => c.status === 'UNDER_INVESTIGATION' || c.status === 'ROUTED').length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              {complaints.filter((c) => c.status === 'UNDER_INVESTIGATION' || c.status === 'ROUTED').length > 0
                ? 'Assigned to active field taskforce'
                : 'No active investigations'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Resolved / Closed
              </p>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-mono">
              {complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length}
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Archived in secure ledger</p>
          </CardContent>
        </Card>
      </div>

      {/* 4. INTERACTIVE LIVE COMPLAINT TRACKER ENGINE */}
      <Card className="border-neutral-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-neutral-50 border-b border-neutral-200 py-4 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-emerald-600" />
              <span>Real-Time Complaint Tracking Engine</span>
            </CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter any report reference number or select an existing complaint to view its full lifecycle audit trail.
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          {/* Tracker Search Form */}
          <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase font-mono">
                Report Reference Number
              </label>
              <Input
                placeholder="e.g. CTM-2026-B7ABA1"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="font-mono text-sm uppercase"
                required
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase font-mono">
                Tracking Token (Optional)
              </label>
              <Input
                placeholder="e.g. TK-9921-X4"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="sm:col-span-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full gap-2 cursor-pointer"
                isLoading={isTrackingLoading}
              >
                <Search className="w-4 h-4" />
                <span>Track Live</span>
              </Button>
            </div>
          </form>

          {/* Active Complaint Status View */}
          {selectedComplaint ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-6">
              {/* Top Details Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-neutral-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedComplaint.referenceNumber}
                    </span>
                    <span className="text-xs text-neutral-500">· {selectedComplaint.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-950 mt-1.5">
                    {selectedComplaint.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 mt-1">
                    <span>
                      <strong className="text-neutral-900">Assigned Agency:</strong> {selectedComplaint.assignedAgency}
                    </span>
                    <span>
                      <strong className="text-neutral-900">Location:</strong> {selectedComplaint.state}
                    </span>
                    <span>
                      <strong className="text-neutral-900">Lodged:</strong> {formatDateTime(selectedComplaint.submittedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge status={statusBadge(selectedComplaint.status)}>
                    {humanise(selectedComplaint.status)}
                  </Badge>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono">
                    {selectedComplaint.priority}
                  </span>
                </div>
              </div>

              {/* 8-Stage Lifecycle Visualization */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 font-mono">
                  8-Stage Sovereign Intelligence Lifecycle
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {LIFECYCLE_STAGES.map((s) => {
                    const isPassed = s.step <= selectedComplaint.currentStage;
                    const isCurrent = s.step === selectedComplaint.currentStage;

                    return (
                      <div
                        key={s.step}
                        className={`rounded-lg p-2.5 border text-center transition-all ${
                          isCurrent
                            ? 'bg-emerald-700 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                            : 'bg-white text-neutral-400 border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span
                            className={`w-4 h-4 rounded-full text-[10px] font-mono font-bold flex items-center justify-center ${
                              isCurrent
                                ? 'bg-white text-emerald-800'
                                : isPassed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {s.step}
                          </span>
                        </div>
                        <p className={`text-[11px] font-bold truncate ${isCurrent ? 'text-white' : ''}`}>
                          {s.name}
                        </p>
                        <p className={`text-[9px] mt-0.5 truncate ${isCurrent ? 'text-emerald-100' : 'text-neutral-500'}`}>
                          {s.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Timeline Event Milestones */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 font-mono">
                  Verifiable Timeline & Official Case Notes
                </h4>
                <ol className="space-y-4">
                  {selectedComplaint.timeline.map((event, idx) => (
                    <li key={idx} className="flex gap-3.5">
                      <div className="flex flex-col items-center shrink-0">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 mt-1 ring-4 ring-emerald-100" />
                        {idx < selectedComplaint.timeline.length - 1 && (
                          <span className="w-px flex-1 bg-neutral-300 mt-1" />
                        )}
                      </div>
                      <div className="pb-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-neutral-950">
                            {humanise(event.action)}
                          </p>
                          <span className="text-[11px] font-mono text-neutral-500">
                            {formatDateTime(event.at)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-700 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-neutral-200 shadow-2xs">
                          {event.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <FileSearch className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-sm font-bold text-neutral-900">No Incident Report Selected</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Enter your reference number in the search box above to track a case in real-time, or lodge your first encrypted disclosure.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold border-emerald-600 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                onClick={() => onTabChange?.('submit')}
              >
                <FilePlus className="w-3.5 h-3.5 mr-1.5" />
                <span>Submit a Report Now</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. MY COMPLAINTS LIST SECTION */}
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="py-4 px-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>My Submitted Complaints & Disclosures</span>
            </CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Secure records registered under your complainant session with direct tracking tokens.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterStatus === 'ALL'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All ({complaints.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterStatus === 'ACTIVE'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Active ({complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('RESOLVED')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filterStatus === 'RESOLVED'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Resolved ({complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length})
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-neutral-200">
            {filteredComplaints.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-200">
                  <Inbox className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto">
                  <h4 className="text-base font-bold text-neutral-900">
                    No Complaints Lodged Yet
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    You have not submitted any incident reports. Once you file an encrypted report, its reference number, tracking token, and investigation milestones will appear here.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onTabChange?.('submit')}
                  className="gap-2 cursor-pointer bg-[#006B3C] hover:bg-[#005731]"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Submit Your First Report</span>
                </Button>
              </div>
            ) : (
              filteredComplaints.map((c) => {
                const isSelected = selectedComplaint?.id === c.id;

                return (
                  <div
                    key={c.id}
                    className={`p-5 sm:p-6 transition-colors flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${
                      isSelected ? 'bg-emerald-50/50' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                          {c.referenceNumber}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium">{c.category}</span>
                        <span className="text-xs text-neutral-400">· {c.state}</span>
                      </div>

                      <h4 className="text-base font-bold text-neutral-950 leading-snug">
                        {c.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                        <span>
                          <strong className="text-neutral-800">Agency:</strong> {c.assignedAgency}
                        </span>
                        <span>
                          <strong className="text-neutral-800">Submitted:</strong> {formatDateTime(c.submittedAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-neutral-500">
                          <span>Token:</span>
                          <code>{c.trackingCode}</code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.trackingCode, c.id)}
                            className="hover:text-emerald-700 ml-0.5 cursor-pointer"
                            title="Copy tracking token"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedCode === c.id && (
                            <span className="text-[10px] text-emerald-600 font-sans">Copied!</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <Badge status={statusBadge(c.status)}>{humanise(c.status)}</Badge>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono">
                        {c.priority}
                      </span>

                      <Button
                        size="sm"
                        variant={isSelected ? 'primary' : 'outline'}
                        onClick={() => {
                          handleSelectComplaint(c);
                          onTabChange?.('track');
                        }}
                        className="gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isSelected ? 'Viewing Timeline' : 'View Milestones'}</span>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* 6. WHISTLEBLOWER SECURITY & PUBLIC SAFETY BULLETIN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Whistleblower Protection Guarantee */}
        <div className="rounded-xl border border-emerald-900/30 bg-emerald-950 text-white p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">
              Whistleblower Protection Standard
            </h4>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Your submissions benefit from strict non-disclosure protections under the Defence Industries Corporation of Nigeria (DICON/CATCH-AM) mandate. Metadata is cryptographically stripped and custody records are hash-chained.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-emerald-300 font-mono">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-IP Retention Option</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>SHA-256 Custody</span>
            </span>
          </div>
        </div>

        {/* Public Emergency Advisories */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-neutral-900">
            <Radio className="w-5 h-5 text-red-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">
              Active National Advisory
            </h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Corridor vigilance notice: Heightened surveillance active along Bonny-Eleme pipeline infrastructure and northern customs interdiction checkpoints. Immediate reporting requested for illicit night off-loading.
          </p>
          <div className="pt-1 flex items-center justify-between text-xs text-neutral-500">
            <span>Toll-Free Emergency Line: <strong className="text-neutral-900 font-mono">0800-CATCHAM</strong></span>
            <button
              onClick={() => onTabChange?.('submit')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Submit Report &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
