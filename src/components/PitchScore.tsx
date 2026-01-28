'use client';

import { useMemo } from 'react';
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
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);
  const barColor = getScoreBarColor(score);
  const showSparkle = shouldShowSparkle(score);

  // Memoize field statuses to prevent unnecessary recalculations
  const fieldStatuses = useMemo(() => getAllFieldStatuses(formData), [formData]);

  // Calculate completion stats for screen readers
  const completedCount = fieldStatuses.filter(f => f.completed).length;
  const totalCount = fieldStatuses.length;

  return (
    <div className="space-y-3">
      {/* Score Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass} relative`}
            role="status"
            aria-label={`Pitch strength score: ${score} percent, ${label}`}
          >
            {score}%
            {showSparkle && (
              <span
                className="absolute -top-1 -right-1 text-yellow-400 animate-pulse"
                aria-hidden="true"
              >
                ✨
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-700" aria-hidden="true">
            Pitch Strength: {label}
          </span>
        </div>

        {/* Progress bar - Desktop */}
        <div className="hidden md:block flex-1 mx-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${barColor} transition-all duration-300`}
              style={{ width: `${score}%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Pitch completion progress: ${score} percent`}
            />
          </div>
        </div>
      </div>

      {/* Progress bar - Mobile (show ABOVE field grid for better UX) */}
      <div className="md:hidden">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${score}%` }}
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Pitch completion progress: ${score} percent`}
          />
        </div>
        {/* Screen reader summary */}
        <div className="sr-only" role="status" aria-live="polite">
          {completedCount} of {totalCount} fields completed. {label}.
        </div>
      </div>

      {/* Field Breakdown - Mobile Optimized */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs"
        role="list"
        aria-label="Field completion checklist"
      >
        {fieldStatuses.map((field, index) => {
          let icon = '';
          let iconColor = '';
          let labelColor = 'text-gray-600';
          let statusText = '';

          if (field.completed) {
            icon = '✅';
            iconColor = 'text-green-600';
            labelColor = 'text-gray-700';
            statusText = 'completed';
          } else if (field.isOptional && field.isRecommended) {
            icon = '⚠️';
            iconColor = 'text-yellow-600';
            labelColor = 'text-gray-600';
            statusText = 'optional but recommended';
          } else {
            icon = '❌';
            iconColor = 'text-red-500';
            labelColor = 'text-gray-500';
            statusText = 'incomplete';
          }

          return (
            <div
              key={index}
              role="listitem"
              aria-label={`${field.label}: ${statusText}, ${field.points} points${field.completed ? ', earned' : ''}`}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              title={field.hint || `${field.label} - ${statusText}`}
            >
              <span className={iconColor} aria-hidden="true">
                {icon}
              </span>
              <span className={`${labelColor} font-medium`}>{field.label}</span>
              <span className="text-gray-400" aria-hidden="true">
                (+{field.points})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
