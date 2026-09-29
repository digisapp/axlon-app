'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Truck,
  User,
  Camera,
  Target,
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { csrfFetch } from '@/lib/csrf-fetch';

interface TradeInFormProps {
  interestedListingId?: string;
  interestedCategoryId?: string;
}

type Step = 'equipment' | 'condition' | 'contact' | 'interest';

export function TradeInForm({ interestedListingId, interestedCategoryId }: TradeInFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('equipment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState({ year: false, email: false });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const [formData, setFormData] = useState({
    // Equipment info
    equipment_year: '',
    equipment_make: '',
    equipment_model: '',
    equipment_vin: '',
    equipment_mileage: '',
    equipment_hours: '',

    // Condition
    equipment_condition: '',
    equipment_description: '',

    // Contact
    contact_name: '',
    contact_email: '',
    contact_phone: '',

    // Interest
    interested_listing_id: interestedListingId || '',
    interested_category_id: interestedCategoryId || '',
    purchase_timeline: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await csrfFetch('/api/categories');
        if (response.ok) {
          const { data } = await response.json();
          // Flatten categories for the dropdown
          const flat: { id: string; name: string }[] = [];
          data?.forEach((parent: { id: string; name: string; children?: { id: string; name: string }[] }) => {
            flat.push({ id: parent.id, name: parent.name });
            parent.children?.forEach((child) => {
              flat.push({ id: child.id, name: `  ${child.name}` });
            });
          });
          setCategories(flat);
        }
      } catch (error) {
        logger.error('Error fetching categories', { error });
      }
    };
    fetchCategories();
  }, []);

  const steps: { key: Step; title: string; icon: React.ReactNode }[] = [
    { key: 'equipment', title: 'Equipment', icon: <Truck className="w-4 h-4" /> },
    { key: 'condition', title: 'Condition', icon: <Camera className="w-4 h-4" /> },
    { key: 'contact', title: 'Contact', icon: <User className="w-4 h-4" /> },
    { key: 'interest', title: 'Interest', icon: <Target className="w-4 h-4" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await csrfFetch('/api/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          equipment_year: formData.equipment_year ? parseInt(formData.equipment_year) : null,
          equipment_mileage: formData.equipment_mileage ? parseInt(formData.equipment_mileage) : null,
          equipment_hours: formData.equipment_hours ? parseInt(formData.equipment_hours) : null,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 429) {
        setSubmitError('Too many requests in a short time. Please wait a minute and try again.');
      } else {
        setSubmitError(
          'We couldn\'t submit your request. Check the details on the earlier steps and try again.'
        );
      }
    } catch (error) {
      logger.error('Submit error', { error });
      setSubmitError('Could not reach the server. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mirrors tradeInRequestSchema so a bad year/email is caught on its own
  // step instead of failing the final submit with a generic error.
  const maxYear = new Date().getFullYear() + 1;
  const yearNum = formData.equipment_year ? parseInt(formData.equipment_year, 10) : null;
  const yearInvalid = yearNum !== null && (Number.isNaN(yearNum) || yearNum < 1900 || yearNum > maxYear);
  const emailInvalid =
    formData.contact_email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email.trim());
  // Only flag a field once the visitor has finished with it (blur, or a full
  // 4-digit year) — not on the first keystroke of a value that will be valid.
  const showYearError = yearInvalid && (touched.year || formData.equipment_year.length >= 4);
  const showEmailError = emailInvalid && touched.email;

  const isStepValid = () => {
    switch (currentStep) {
      case 'equipment':
        return !!(formData.equipment_make.trim() && formData.equipment_model.trim()) && !yearInvalid;
      case 'condition':
        return !!formData.equipment_condition;
      case 'contact':
        return !!(formData.contact_name.trim() && formData.contact_email.trim()) && !emailInvalid;
      case 'interest':
        return true; // Optional step
      default:
        return false;
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Trade-In Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your interest. A dealer will review your trade-in and contact you
            within 24-48 hours with a valuation.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" className="h-11" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button className="h-11" onClick={() => router.push('/search')}>
              Browse Inventory
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Trade-In Request</CardTitle>
        <CardDescription>
          Get a quick valuation for your equipment. Most requests are reviewed within 24 hours.
        </CardDescription>

        {/* Progress Steps — connectors flex so the row always fits the card
            (CardHeader is an auto-sized grid, so a fixed-width row would widen it) */}
        <div className="flex items-center min-w-0 mt-6">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center min-w-0 ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                aria-current={index === currentStepIndex ? 'step' : undefined}
                className={`flex shrink-0 items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
                <span className="sm:hidden text-sm font-medium">{index + 1}</span>
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 min-w-2 h-0.5 mx-1 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Equipment Info */}
        {currentStep === 'equipment' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Equipment Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="2020"
                  min={1900}
                  max={maxYear}
                  aria-invalid={showYearError || undefined}
                  aria-describedby={showYearError ? 'year-error' : undefined}
                  value={formData.equipment_year}
                  onChange={(e) => setFormData({ ...formData, equipment_year: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, year: true }))}
                />
                {showYearError && (
                  <p id="year-error" className="text-xs text-destructive">
                    Enter a year between 1900 and {maxYear}.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  placeholder="Peterbilt"
                  value={formData.equipment_make}
                  onChange={(e) => setFormData({ ...formData, equipment_make: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="579"
                  value={formData.equipment_model}
                  onChange={(e) => setFormData({ ...formData, equipment_model: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN (Optional)</Label>
                <Input
                  id="vin"
                  placeholder="1XPWD40X1ED215307"
                  maxLength={17}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  value={formData.equipment_vin}
                  onChange={(e) => setFormData({ ...formData, equipment_vin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="450000"
                  value={formData.equipment_mileage}
                  onChange={(e) => setFormData({ ...formData, equipment_mileage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours (Equipment)</Label>
                <Input
                  id="hours"
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="5000"
                  value={formData.equipment_hours}
                  onChange={(e) => setFormData({ ...formData, equipment_hours: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Condition */}
        {currentStep === 'condition' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Equipment Condition</h3>
            <div className="space-y-2">
              <Label htmlFor="condition">Overall Condition *</Label>
              <Select
                value={formData.equipment_condition}
                onValueChange={(v) => setFormData({ ...formData, equipment_condition: v })}
              >
                <SelectTrigger id="condition" className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Like new, minimal wear</SelectItem>
                  <SelectItem value="good">Good - Normal wear, well maintained</SelectItem>
                  <SelectItem value="fair">Fair - Some issues, needs minor repairs</SelectItem>
                  <SelectItem value="poor">Poor - Significant issues, needs major work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe any issues, recent maintenance, upgrades, or other relevant details..."
                rows={5}
                value={formData.equipment_description}
                onChange={(e) => setFormData({ ...formData, equipment_description: e.target.value })}
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Mentioning recent maintenance, upgrades and any known issues
                helps dealers give you a more accurate valuation.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {currentStep === 'contact' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                autoComplete="name"
                placeholder="John Smith"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="john@example.com"
                  aria-invalid={showEmailError || undefined}
                  aria-describedby={showEmailError ? 'email-error' : undefined}
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  required
                />
                {showEmailError && (
                  <p id="email-error" className="text-xs text-destructive">
                    Enter a valid email address.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(555) 123-4567"
                  maxLength={20}
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Interest */}
        {currentStep === 'interest' && (
          <div className="space-y-4">
            <h3 className="font-semibold">What Are You Looking For?</h3>
            <p className="text-sm text-muted-foreground">
              Let us know if you&apos;re interested in trading towards a specific listing or category.
            </p>

            <div className="space-y-2">
              <Label htmlFor="category">Interested Category</Label>
              <Select
                value={formData.interested_category_id}
                onValueChange={(v) => setFormData({ ...formData, interested_category_id: v })}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Purchase Timeline</Label>
              <Select
                value={formData.purchase_timeline}
                onValueChange={(v) => setFormData({ ...formData, purchase_timeline: v })}
              >
                <SelectTrigger id="timeline" className="w-full">
                  <SelectValue placeholder="When are you looking to buy?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediately</SelectItem>
                  <SelectItem value="1-2_weeks">Within 1-2 weeks</SelectItem>
                  <SelectItem value="1_month">Within a month</SelectItem>
                  <SelectItem value="just_browsing">Just browsing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {submitError && currentStep === 'interest' && (
          <div role="alert" className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            className="h-11"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStepIndex === steps.length - 1 ? (
            <Button className="h-11" onClick={handleSubmit} disabled={isSubmitting || !isStepValid()}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Submit Request
            </Button>
          ) : (
            <Button className="h-11" onClick={handleNext} disabled={!isStepValid()}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
