'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowRight, ArrowLeft, Check, Upload, MapPin, Calendar, Lock, AlertCircle, FileCheck } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'What Happened?' },
  { id: 2, title: 'Where Did It Happen?' },
  { id: 3, title: 'When Did It Happen?' },
  { id: 4, title: 'Add Evidence' },
  { id: 5, title: 'Details & Narrative' },
  { id: 6, title: 'Anonymity Preference' },
  { id: 7, title: 'Review Report' },
  { id: 8, title: 'Receipt & Secret' },
];

export default function GuidedReportingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: 'INFRASTRUCTURE_VANDALISM',
    title: '',
    state: 'Rivers',
    lga: 'Port Harcourt',
    landmark: '',
    latitude: '4.8156',
    longitude: '7.0498',
    incidentDate: '2026-09-28',
    incidentTime: '14:30',
    evidenceFile: 'pipeline_valve_tampering_photo.jpg',
    evidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    description: '',
    involvedParties: '',
    isAnonymous: true,
    fullName: '',
    phone: '',
  });

  const nextStep = () => {
    if (currentStep === 7) {
      // Simulate submission
      setSubmittedRef('CAT-2026-00000001');
      setCurrentStep(8);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 8));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      {/* Top Banner */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <img
            src="/logo.png"
            alt="DICON Logo"
            className="w-7 h-7 object-contain rounded-full bg-white p-0.5 border border-brand-100"
          />
          <span>CATCHAM NIGERIA</span>
        </Link>
        <span className="text-xs font-mono text-neutral-500">
          Step {currentStep} of {STEPS.length}
        </span>
      </div>

      {/* Main Form Container */}
      <div className="max-w-2xl mx-auto">
        {/* Step Progress Bar */}
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-brand-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>

        <Card className="shadow-sm border-neutral-200">
          <CardHeader>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-semibold uppercase tracking-wider">
              <span>Guided Intake Protocol</span>
            </div>
            <CardTitle className="text-2xl mt-1">{STEPS[currentStep - 1]?.title}</CardTitle>
            <CardDescription>
              Provide accurate information to assist federal and state investigation teams.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* STEP 1: What Happened? */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Select
                  label="Incident Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'CORRUPTION', label: 'Public Sector Corruption & Bribery' },
                    { value: 'FINANCIAL_FRAUD', label: 'Financial Crimes & Cyber Malpractice' },
                    { value: 'DRUG_TRAFFICKING', label: 'Narcotics & Illicit Substance Trafficking' },
                    { value: 'INFRASTRUCTURE_VANDALISM', label: 'Critical National Infrastructure Vandalism (Power/Oil)' },
                    { value: 'ENVIRONMENTAL_HAZARD', label: 'Environmental Degradation & Toxic Spills' },
                    { value: 'PUBLIC_SAFETY', label: 'Immediate Public Safety Threat' },
                  ]}
                  required
                />
                <Input
                  label="Incident Title / Summary Headline"
                  placeholder="e.g. Illegal oil pipeline valve tapping observed near riverbank"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  helperText="A short, clear headline describing the incident."
                  required
                />
              </div>
            )}

            {/* STEP 2: Where Did It Happen? */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    options={[
                      { value: 'Rivers', label: 'Rivers State' },
                      { value: 'Lagos', label: 'Lagos State' },
                      { value: 'FCT', label: 'Federal Capital Territory (Abuja)' },
                      { value: 'Delta', label: 'Delta State' },
                      { value: 'Bayelsa', label: 'Bayelsa State' },
                      { value: 'Kano', label: 'Kano State' },
                    ]}
                    required
                  />
                  <Input
                    label="Local Government Area (LGA)"
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                    placeholder="e.g. Port Harcourt, Ikeja, Garki"
                    required
                  />
                </div>

                <Input
                  label="Specific Location or Landmark"
                  placeholder="e.g. Near Kilometer 14, East-West Road, opposite pipeline corridor"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />

                <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-brand-800">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span>GPS Coordinates Detected: {formData.latitude}° N, {formData.longitude}° E</span>
                  </div>
                  <Badge status="success">Verified PostGIS Point</Badge>
                </div>
              </div>
            )}

            {/* STEP 3: When Did It Happen? */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Date of Incident"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    required
                  />
                  <Input
                    type="time"
                    label="Approximate Time"
                    value={formData.incidentTime}
                    onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                  />
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg text-xs text-neutral-600 flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <span>If the incident occurred over multiple days or is ongoing, indicate the most recent date observed.</span>
                </div>
              </div>
            )}

            {/* STEP 4: Add Evidence */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center bg-neutral-50/50 hover:bg-neutral-100/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-800">Upload Photos, Videos, Documents, or Audio Statements</p>
                  <p className="text-xs text-neutral-500 mt-1">Accepted: JPG, PNG, MP4, PDF, MP3 (Max 100MB)</p>
                </div>

                {/* Simulated Attached Evidence */}
                <div className="p-3 bg-neutral-white border border-neutral-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-brand-600" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">{formData.evidenceFile}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">SHA-256: {formData.evidenceHash.substring(0, 24)}...</p>
                    </div>
                  </div>
                  <Badge status="success">Hash Verified</Badge>
                </div>
              </div>
            )}

            {/* STEP 5: Narrative Details */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <Textarea
                  label="Detailed Description"
                  rows={4}
                  placeholder="Provide detailed observations: What did you see? How was the action carried out? Vehicle numbers, names, or equipment used..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <Input
                  label="Involved Persons or Organizations (Optional)"
                  placeholder="e.g. Contractors, security personnel, company name if visible"
                  value={formData.involvedParties}
                  onChange={(e) => setFormData({ ...formData, involvedParties: e.target.value })}
                />
              </div>
            )}

            {/* STEP 6: Anonymity Preference */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div
                  onClick={() => setFormData({ ...formData, isAnonymous: true })}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.isAnonymous ? 'border-brand-600 bg-brand-50/50' : 'border-neutral-200 bg-neutral-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-brand-600" />
                      <h4 className="font-semibold text-sm text-neutral-900">100% Anonymous Submission</h4>
                    </div>
                    {formData.isAnonymous && <Check className="w-5 h-5 text-brand-600" />}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 pl-7">
                    No name or contact information will be recorded. You will be provided a private tracking token to follow investigation progress.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, isAnonymous: false })}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    !formData.isAnonymous ? 'border-brand-600 bg-brand-50/50' : 'border-neutral-200 bg-neutral-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-neutral-700" />
                      <h4 className="font-semibold text-sm text-neutral-900">Identified Submission</h4>
                    </div>
                    {!formData.isAnonymous && <Check className="w-5 h-5 text-brand-600" />}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 pl-7">
                    Provide your contact details so federal investigators may follow up directly for clarification where needed.
                  </p>
                </div>

                {!formData.isAnonymous && (
                  <div className="space-y-3 pt-2">
                    <Input
                      label="Full Legal Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number (Nigerian)"
                      placeholder="+234 80X XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: Review */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="p-4 bg-neutral-100 rounded-lg space-y-3 text-xs">
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">Category:</span>
                    <strong className="text-neutral-900">{formData.category}</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">Location:</span>
                    <strong className="text-neutral-900">{formData.state}, {formData.lga}</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">Mode:</span>
                    <Badge status={formData.isAnonymous ? 'info' : 'success'}>
                      {formData.isAnonymous ? 'Anonymous Whistleblower' : 'Identified Submitter'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Evidence Attached:</span>
                    <strong className="text-neutral-900">{formData.evidenceFile}</strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>By submitting, you certify that this report is submitted in good faith under Nigerian law.</span>
                </div>
              </div>
            )}

            {/* STEP 8: Submission Complete */}
            {currentStep === 8 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-brand-50 border border-brand-200 rounded-full flex items-center justify-center mx-auto text-brand-600">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-neutral-950">Report Successfully Submitted</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Your report has been cryptographically registered and forwarded for multi-agency triage.
                </p>

                <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl max-w-sm mx-auto text-left space-y-2">
                  <div className="text-[11px] text-neutral-500 font-semibold uppercase">Tracking Reference</div>
                  <div className="text-lg font-mono font-bold text-brand-700">{submittedRef}</div>
                  <div className="text-[11px] text-neutral-400">Save this reference code to track investigation updates.</div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <Link href="/track">
                    <Button variant="primary">Track Report Now</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">Return Home</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>

          {currentStep < 8 && (
            <CardFooter className="flex justify-between border-t border-neutral-100 pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Previous
              </Button>

              <Button variant="primary" onClick={nextStep}>
                <span>{currentStep === 7 ? 'Submit Report' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
