'use client';

import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Corrected import path if needed, but should be fine now
import { Label } from '@/components/ui/label';
import { Star, Zap, ShieldCheck, Cloud, History } from 'lucide-react'; // Example icons

interface PremiumSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to format currency (adjust as needed for VND)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export function PremiumSheet({ open, onOpenChange }: PremiumSheetProps) {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');

  const annualPrice = 699000;
  const monthlyPrice = 93000;
  const annualMonthlyEquivalent = 58250; // annualPrice / 12
  const originalAnnualPrice = 1116000; // Example original price for discount calculation

  const features = [
    { icon: Star, title: 'Exclusive Features', description: 'Unlock premium-only functionalities.' },
    { icon: Zap, title: 'Faster Responses', description: 'Get priority access and quicker replies.' },
    { icon: Cloud, title: 'Increased Limits', description: 'Higher usage limits for various features.' },
    { icon: History, title: 'Extended History', description: 'Access longer conversation history.' },
    { icon: ShieldCheck, title: 'Priority Support', description: 'Get faster help from our support team.' },
  ];

  const handleSubscribe = () => {
    // TODO: Implement subscription logic (e.g., call API)
    console.log(`Subscribing to ${selectedPlan} plan`);
    onOpenChange(false); // Close sheet after action
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[95vh] rounded-t-xl px-0">
        <SheetHeader className="p-6 pb-4 text-center bg-gradient-to-b from-primary/10 to-background">
           {/* You can add a graphic/icon here like the Telegram star */}
           <Star className="mx-auto h-16 w-16 text-primary mb-4" strokeWidth={1.5} />
          <SheetTitle className="text-2xl font-bold">AiSucKhoe Premium</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Go beyond the limits and unlock exclusive features by subscribing.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Pricing Options */}
          <RadioGroup value={selectedPlan} onValueChange={(value: 'annual' | 'monthly') => setSelectedPlan(value)} className="space-y-3">
            <Label
              htmlFor="annual"
              className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-colors ${
                selectedPlan === 'annual' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="annual" id="annual" />
                <div className="flex flex-col">
                  <span className="font-semibold flex items-center">
                    Annual
                    <span className="ml-2 inline-flex items-center rounded-full bg-destructive/80 px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground">
                      -35% {/* Calculate discount dynamically if needed */}
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <span className="line-through mr-1">{formatCurrency(originalAnnualPrice)}</span>
                    {formatCurrency(annualPrice)}/year
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium">{formatCurrency(annualMonthlyEquivalent)}/month</span>
            </Label>

            <Label
              htmlFor="monthly"
              className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-colors ${
                selectedPlan === 'monthly' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="monthly" id="monthly" />
                <span className="font-semibold">Monthly</span>
              </div>
              <span className="text-sm font-medium">{formatCurrency(monthlyPrice)}/month</span>
            </Label>
          </RadioGroup>

          {/* Features List */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">What is Included</h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

           {/* About Section (Optional - similar to first image) */}
           {/* <div className="pt-4 border-t border-border">
             <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">About Premium</h3>
             <p className="text-sm text-muted-foreground">
                While the free version already offers great features, Premium pushes capabilities even further...
             </p>
           </div> */}

        </div>

        <SheetFooter className="p-6 pt-4 border-t border-border bg-background">
           {/* Terms of Service */}
           <p className="text-xs text-muted-foreground text-center mb-4">
             By subscribing, you agree to the{' '}
             <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
               Terms of Service
             </a>{' '}
             and{' '}
             <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
               Privacy Policy
             </a>.
           </p>
          <Button onClick={handleSubscribe} className="w-full custom-button bg-primary hover:bg-primary/90 text-primary-foreground">
            Subscribe for {selectedPlan === 'annual' ? formatCurrency(annualPrice) + '/year' : formatCurrency(monthlyPrice) + '/month'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
