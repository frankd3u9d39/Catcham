import React from 'react';
import { Check } from 'lucide-react';
import { humanise } from '@/lib/format';
import { INVESTIGATION_STATUSES } from '@/lib/options';

interface WorkflowStepperProps {
  currentState: string;
  /** States the case has already passed through, from the workflow history. */
  history: string[];
}

/**
 * Progress along the seeded case workflow.
 *
 * The workflow is data, not code, so a published definition can contain states
 * this list does not know about. Those are appended rather than dropped, which
 * keeps the stepper honest about where the case actually is.
 */
export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentState, history }) => {
  const known = INVESTIGATION_STATUSES.filter((state) => state !== 'REFERRED');
  const extra = [...new Set([...history, currentState])].filter(
    (state) => !known.includes(state as never),
  );
  const states = [...known, ...extra];

  const currentIndex = states.indexOf(currentState);
  const visited = new Set(history);

  return (
    <ol className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
      {states.map((state, index) => {
        const isCurrent = state === currentState;
        // A state counts as complete if it is behind the current one in the
        // sequence, or the case has demonstrably been through it.
        const isComplete = !isCurrent && (visited.has(state) || (currentIndex > -1 && index < currentIndex));

        return (
          <li key={state} className="flex items-center gap-3 sm:flex-1 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isCurrent
                    ? 'bg-brand-600 text-neutral-white ring-4 ring-brand-100'
                    : isComplete
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-neutral-100 text-neutral-400'
                }`}
                aria-hidden="true"
              >
                {isComplete ? <Check className="w-3 h-3" /> : index + 1}
              </span>
              <span
                className={`text-xs truncate ${
                  isCurrent
                    ? 'font-semibold text-neutral-950'
                    : isComplete
                      ? 'text-neutral-600'
                      : 'text-neutral-400'
                }`}
              >
                {humanise(state)}
                {isCurrent && <span className="sr-only"> (current state)</span>}
              </span>
            </div>

            {index < states.length - 1 && (
              <span
                className={`hidden sm:block flex-1 h-px mx-2 ${
                  isComplete ? 'bg-brand-200' : 'bg-neutral-200'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};
