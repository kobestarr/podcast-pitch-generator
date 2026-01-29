'use client';

import { useState, useMemo } from 'react';
import {
  type FormData,
  getAllFieldStatuses,
  getScoreColor,
  getScoreLabel,
  getScoreBarColor,
  shouldShowSparkle,
} from '@/lib/scoring';

interface Props {
  formData: FormData;
  score: number;
}

export function PitchScore({ formData, score }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);
  const barColor = getScoreBarColor(score);
  const showSparkle = shouldShowSparkle(score);

  // Memoize field statuses to prevent unnecessary recalculations
  const fieldStatuses = useMemo(() => getAllFieldStatuses(formData), [formData]);

  // Calculate completion stats for screen readers
  const completedCount = fieldStatuses.filter(f => f.completed).length;
  const totalCount = fieldStatuses.length;
  const incompleteCount = totalCount - completedCount;

  return (
    <div className="space-y-2">
      {/* Compact Score Header - Always Visible */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`px-2 py-1 rounded-lg text-xs font-body font-bold ${colorClass} relative shadow-sm`}
            role="status"
            aria-label={`Pitch strength score: ${score} percent, ${label}`}
          >
            {score}%
            {showSparkle && (
              <span
                className="absolute -top-0.5 -right-0.5 text-dealflow-golden-yellow animate-pulse text-xs"
                aria-hidden="true"
              >
                ✨
              </span>
            )}
          </div>
          <span className="text-xs font-body font-semibold text-dealflow-midnight">
            Pitch Strength: {label}
          </span>
        </div>

        {/* Progress bar - Always visible */}
        <div className="flex-1 max-w-xs">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${barColor} transition-all duration-500 ease-out rounded-full`}
              style={{ width: `${score}%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Pitch completion progress: ${score} percent`}
            />
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2 py-0.5 text-xs font-body font-semibold text-dealflow-sky hover:text-dealflow-midnight hover:bg-dealflow-sky/10 rounded transition-all duration-200 flex items-center gap-1"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Hide field details' : 'Show field details'}
        >
          {isExpanded ? 'Hide' : 'Show'}
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Screen reader summary */}
      <div className="sr-only" role="status" aria-live="polite">
        {completedCount} of {totalCount} fields completed. {label}.
      </div>

      {/* Field Breakdown - Collapsible */}
      {isExpanded && (
        <div
          className="pt-3 border-t border-dealflow-light-grey/30 animate-in slide-in-from-top-2 duration-200"
          role="list"
          aria-label="Field completion checklist"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {fieldStatuses.map((field, index) => {
              let icon = '';
              let iconColor = '';
              let labelColor = 'text-dealflow-light-grey';
              let statusText = '';
              let bgColor = 'bg-dealflow-cream/50';

              if (field.completed) {
                icon = '✅';
                iconColor = 'text-dealflow-warm-green';
                labelColor = 'text-dealflow-midnight';
                bgColor = 'bg-dealflow-warm-green/10';
                statusText = 'completed';
              } else if (field.isOptional && field.isRecommended) {
                icon = '⚠️';
                iconColor = 'text-dealflow-golden-yellow';
                labelColor = 'text-dealflow-midnight';
                bgColor = 'bg-dealflow-golden-yellow/10';
                statusText = 'optional but recommended';
              } else {
                icon = '❌';
                iconColor = 'text-dealflow-muted-red';
                labelColor = 'text-dealflow-light-grey';
                bgColor = 'bg-dealflow-muted-red/10';
                statusText = 'incomplete';
              }

              return (
                <div
                  key={index}
                  role="listitem"
                  aria-label={`${field.label}: ${statusText}, ${field.points} points${field.completed ? ', earned' : ''}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${bgColor} hover:shadow-sm transition-all duration-200 border border-transparent hover:border-dealflow-light-grey/30`}
                  title={field.hint || `${field.label} - ${statusText}`}
                >
                  <span className={iconColor} aria-hidden="true">
                    {icon}
                  </span>
                  <span className={`${labelColor} font-body font-medium flex-1 text-xs`}>{field.label}</span>
                  <span className="text-dealflow-light-grey font-body font-semibold text-xs" aria-hidden="true">
                    (+{field.points})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
