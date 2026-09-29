import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  id: string;
  label: string;
  timestamp?: string;
  actor?: string;
}

interface WorkflowStepperProps {
  steps: StepItem[];
  currentStepIndex: number;
  className?: string;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  steps,
  currentStepIndex,
  className,
}) => {
  return (
    <div className={cn('w-full py-4', className)}>
      <nav aria-label="Workflow progress">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <li key={step.id} className="relative flex-1 flex flex-col items-center text-center">
                {/* Connector line between steps */}
                {index !== 0 && (
                  <div
                    className={cn(
                      'absolute top-4 -left-1/2 w-full h-0.5 -translate-y-1/2',
                      isCompleted ? 'bg-brand-600' : 'bg-neutral-200'
                    )}
                    aria-hidden="true"
                  />
                )}

                {/* Step Marker */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all',
                    isCompleted && 'bg-brand-600 border-brand-600 text-neutral-white',
                    isCurrent && 'bg-neutral-white border-brand-600 text-brand-600 ring-4 ring-brand-100',
                    isUpcoming && 'bg-neutral-100 border-neutral-300 text-neutral-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Labels */}
                <div className="mt-2 space-y-0.5">
                  <p
                    className={cn(
                      'text-xs font-semibold',
                      isCurrent && 'text-brand-600',
                      isCompleted && 'text-neutral-900',
                      isUpcoming && 'text-neutral-400'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.timestamp && (
                    <p className="text-[11px] text-neutral-400 font-mono">{step.timestamp}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
