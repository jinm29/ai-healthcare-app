'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

// Onboarding steps components
import Introduction from '@/components/onboarding/Introduction';
import PersonalInfo from '@/components/onboarding/PersonalInfo';
import HealthConcerns from '@/components/onboarding/HealthConcerns';
import MedicalRecords from '@/components/onboarding/MedicalRecords';
import Analysis from '@/components/onboarding/Analysis';
import ProgressBar from '@/components/onboarding/ProgressBar';
import NavigationButtons from '@/components/onboarding/NavigationButtons';
import type { PersonalInfoData } from '@/components/onboarding/PersonalInfo';

const steps = [
  { id: 1, component: Introduction },
  { id: 2, component: HealthConcerns },
  { id: 3, component: PersonalInfo },
  { id: 4, component: MedicalRecords },
  { id: 5, component: Analysis },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [healthConcerns, setHealthConcerns] = useState('');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
    gender: '',
    birthDate: '',
    height: '',
    heightUnit: 'cm',
    weight: '',
    weightUnit: 'kg',
    ethnicity: '',
    country: '',
  });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 2: // HealthConcerns
        if (!healthConcerns.trim()) {
          setTouchedFields(prev => ({ ...prev, healthConcerns: true }));
          toast.error('Please describe your health concerns');
          return false;
        }
        break;
      case 3: // PersonalInfo
        const requiredFields = ['gender', 'birthDate', 'height', 'weight', 'country', 'ethnicity'];
        let isValid = true;
        
        const newTouchedFields = { ...touchedFields };
        requiredFields.forEach(field => {
          if (!personalInfo[field]) {
            newTouchedFields[field] = true;
            isValid = false;
          }
        });
        setTouchedFields(newTouchedFields);

        if (!isValid) {
          toast.error('Please fill in all required fields');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 4) { // Skip only available on Medical Records step
      setCurrentStep(5);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          {currentStep > 1 && (
            <div className="mb-8">
              <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 2 ? (
                <HealthConcerns
                  value={healthConcerns}
                  onChange={setHealthConcerns}
                  isInvalid={touchedFields.healthConcerns && !healthConcerns.trim()}
                />
              ) : currentStep === 3 ? (
                <PersonalInfo
                  value={personalInfo}
                  onChange={setPersonalInfo}
                  touchedFields={touchedFields}
                />
              ) : (
                <CurrentStepComponent />
              )}
            </motion.div>
          </AnimatePresence>

          <NavigationButtons
            onNext={handleNext}
            onBack={handlePrevious}
            onSkip={handleSkip}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
            showSkip={currentStep === 4}
          />
        </CardContent>
      </Card>
    </div>
  );
} 