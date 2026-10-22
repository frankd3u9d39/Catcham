'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  HelpCircle,
  Laptop,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { RequireAuth } from '@/components/layout/require-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/providers/auth-provider';
import { useJurisdictions } from '@/hooks/use-platform';
import { DEFAULT_STATES } from '@/lib/reference-data';
import { addNotification } from '@/lib/notifications';
import { firestoreService, type CredicorpApplication } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { CREDICORP_DEVICES } from '@/components/portal/citizen-dashboard-view';

export default function CredicorpPage() {
  const { user } = useAuth();
  const { data: rawStates = [] } = useJurisdictions('STATE');
  const states = rawStates.length > 0 ? rawStates : DEFAULT_STATES;

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    applicationRef: string;
    applicantName: string;
    deviceModelSelected: string;
    repaymentPlan: string;
    status: string;
    appliedAt: string;
  } | null>(null);

  const [savedApplications, setSavedApplications] = useState<CredicorpApplication[]>([]);
  const [credicorpFilter, setCredicorpFilter] = useState<'ALL' | 'LAPTOP' | 'SMARTPHONE' | 'TABLET'>('ALL');

  useEffect(() => {
    firestoreService.getCredicorpApplications().then((apps) => {
      if (apps.length > 0) {
        setSavedApplications(apps);
      }
    });
  }, []);

  const handleCredicorpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credicorpForm.applicantName.trim() || !credicorpForm.nin.trim() || !credicorpForm.phone.trim()) {
      alert('Please fill in your Full Name, Phone Number, and National Identity Number (NIN).');
      return;
    }

    setIsSubmitting(true);
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

      addNotification({
        id: `notif-credicorp-${ref}`,
        channel: 'PORTAL',
        subject: `CREDICORP Hardware Allocation Queued (${ref})`,
        body: `Your application for "${newApp.deviceModelSelected}" under repayment tenure ${newApp.repaymentPlan.replace('_', ' ')} has been recorded and submitted for remote NIN verification.`,
        readAt: null,
      });

      setReceipt({
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
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <AppShell breadcrumbs={[{ label: 'Citizen Portal', href: '/dashboard' }, { label: 'FG CREDICORP C.L.I.C.K.D' }]}>
        <div className="space-y-6 max-w-6xl pb-12">
          {/* Main Hero Header */}
          <Card className="border-emerald-500/30 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-neutral-950 via-[#071912] to-neutral-900 text-white p-6 sm:p-8 border-b border-emerald-900/40">
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

              {/* Stats Bar */}
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
              {/* Receipt / Confirmation */}
              {receipt && (
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
                        {receipt.applicationRef}
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-200 bg-white p-3.5 shadow-2xs">
                      <p className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                        Selected Device
                      </p>
                      <p className="text-sm font-bold text-neutral-900 mt-0.5 truncate">
                        {receipt.deviceModelSelected}
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

              {/* Device Packages Showcase */}
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
                          <p className="text-[10px] text-neutral-500">{device.tenure}</p>
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
                        className="w-full sm:w-auto px-8 gap-2 bg-[#006B3C] hover:bg-[#005731] shadow-md font-bold uppercase tracking-wider cursor-pointer"
                        isLoading={isSubmitting}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit CREDICORP Application</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* History */}
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

              {/* FAQs */}
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
      </AppShell>
    </RequireAuth>
  );
}
