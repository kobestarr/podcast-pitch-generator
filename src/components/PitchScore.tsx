'use client';

import { useMemo } from 'react';

interface FormData {
  name: string;
  title: string;
  expertise: string;
  credibility: string;
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  socialPlatform: string;
  followers: string;
}

interface Props {
  formData: FormData;
  score: number;
}

interface FieldStatus {
  label: string;
  points: number;
  completed: boolean;
  isOptional: boolean;
  isRecommended: boolean;
}

function getScoreColor(score: number): string {
  if (score <= 40) return 'text-red-500 bg-red-100';
  if (score <= 70) return 'text-yellow-600 bg-yellow-100';
  if (score <= 90) return 'text-green-600 bg-green-100';
  return 'text-green-600 bg-green-100';
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'Weak pitch';
  if (score <= 70) return 'Getting there';
  if (score <= 90) return 'Strong pitch';
  return 'Excellent pitch';
}

function getScoreBarColor(score: number): string {
  if (score <= 40) return 'bg-red-500';
  if (score <= 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

function getFieldStatuses(formData: FormData): FieldStatus[] {
  return [
    {
      label: 'Name',
      points: 5,
      completed: !!formData.name,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Title/Role',
      points: 5,
      completed: !!formData.title,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Expertise',
      points: 10,
      completed: !!formData.expertise,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Credibility',
      points: 15,
      completed: formData.credibility.length > 20,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Podcast Name',
      points: 5,
      completed: !!formData.podcastName,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Host Name',
      points: 5,
      completed: !!formData.hostName,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Recent Guest',
      points: 15,
      completed: !!formData.guestName,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Episode Topic',
      points: 10,
      completed: formData.episodeTopic.length > 10,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Why This Podcast?',
      points: 20,
      completed: formData.whyPodcast.length > 50,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Topic Idea 1',
      points: 10,
      completed: !!formData.topic1,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Topic Idea 2',
      points: 5,
      completed: !!formData.topic2,
      isOptional: true,
      isRecommended: true,
    },
    {
      label: 'Topic Idea 3',
      points: 5,
      completed: !!formData.topic3,
      isOptional: true,
      isRecommended: true,
    },
    {
      label: 'Unique Angle',
      points: 15,
      completed: formData.uniqueAngle.length > 30,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Social Platform',
      points: 5,
      completed: !!formData.socialPlatform,
      isOptional: false,
      isRecommended: false,
    },
    {
      label: 'Follower Count',
      points: 10,
      completed: !!formData.followers,
      isOptional: false,
      isRecommended: false,
    },
  ];
}

export function PitchScore({ formData, score }: Props) {
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);
  const barColor = getScoreBarColor(score);
  const showSparkle = score >= 91;

  // Memoize field statuses to prevent unnecessary recalculations
  const fieldStatuses = useMemo(() => getFieldStatuses(formData), [formData]);

  return (
    <div className="space-y-3">
      {/* Score Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass} relative`}>
            {score}%
            {showSparkle && (
              <span className="absolute -top-1 -right-1 text-yellow-400 animate-pulse">✨</span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">
            Pitch Strength: {label}
          </span>
        </div>

        {/* Progress bar - Desktop */}
        <div className="hidden md:block flex-1 mx-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${barColor} transition-all duration-300 ${showSparkle ? 'animate-pulse' : ''}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Field Breakdown - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
        {fieldStatuses.map((field, index) => {
          let icon = '';
          let iconColor = '';
          let labelColor = 'text-gray-600';

          if (field.completed) {
            icon = '✅';
            iconColor = 'text-green-600';
            labelColor = 'text-gray-700';
          } else if (field.isOptional && field.isRecommended) {
            icon = '⚠️';
            iconColor = 'text-yellow-600';
            labelColor = 'text-gray-600';
          } else {
            icon = '❌';
            iconColor = 'text-red-500';
            labelColor = 'text-gray-500';
          }

          return (
            <div 
              key={index}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50"
            >
              <span className={iconColor}>{icon}</span>
              <span className={`${labelColor} font-medium`}>{field.label}</span>
              <span className="text-gray-400">(+{field.points})</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar - Mobile */}
      <div className="md:hidden">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColor} transition-all duration-300 ${showSparkle ? 'animate-pulse' : ''}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
