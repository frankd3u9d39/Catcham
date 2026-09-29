'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function OfficerLoginPage() {
  const [email, setEmail] = useState('oladipo.adeleke@efcc.gov.ng');
  const [password, setPassword] = useState('password123');

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 text-neutral-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="DICON Logo"
            className="w-16 h-16 object-contain rounded-full bg-white p-1 mx-auto mb-3 shadow-md border border-neutral-700"
          />
          <h1 className="text-2xl font-bold tracking-tight text-neutral-white mt-3">CATCHAM SOVEREIGN</h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
            Official Agency & Investigator Portal
          </p>
        </div>

        <Card className="border-neutral-800 bg-neutral-900 text-neutral-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg text-neutral-white">Officer Sign In</CardTitle>
            <CardDescription className="text-neutral-400">
              Authorized Nigerian law enforcement and regulatory personnel only.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              type="email"
              label="Official Agency Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@agency.gov.ng"
              className="bg-neutral-800 border-neutral-700 text-neutral-white"
              required
            />

            <Input
              type="password"
              label="Security Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-neutral-white"
              required
            />

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-neutral-700 text-brand-600" />
                <span>Remember session</span>
              </label>
              <Link href="/forgot-password" className="hover:text-neutral-200">
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Link href="/dashboard" className="w-full">
              <Button variant="primary" className="w-full h-11 text-base">
                <span>Authenticate & Access</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <div className="p-2.5 bg-neutral-800/80 rounded-md border border-neutral-700 text-[11px] text-neutral-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span>Multi-Factor Authentication (MFA) token will be verified.</span>
            </div>
          </CardFooter>
        </Card>

        <div className="text-center mt-6 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-300">
            ← Return to Public Reporting Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
