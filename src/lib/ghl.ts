/**
 * Go High Level (GHL) API Integration
 * Creates contacts in GHL CRM after email verification
 */

interface FormData {
  firstName: string;
  lastName: string;
  title: string[];
  expertise: string;
  credibility: string;
  podcastName: string;
  hostName: string;
  guestName: string;
  episodeTopic: string;
  whyPodcast: string;
  socialPlatform: string;
  followers: string;
  topic1: string;
  topic2: string;
  topic3: string;
  uniqueAngle: string;
  audienceBenefit: string;
}

interface GHLContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  customFields?: Array<{
    key: string;
    field_value: string;
  }>;
  source?: string;
}

/**
 * Create a contact in GHL with form data
 * @param email - Verified email address
 * @param formData - All form data from the pitch generator
 */
export async function createGHLContact(
  email: string,
  formData: FormData
): Promise<void> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!apiKey || !locationId) {
    throw new Error('GHL API credentials not configured');
  }

  // Build custom fields array
  const customFields: Array<{ key: string; field_value: string }> = [];

  // Add title (array of roles)
  if (formData.title && formData.title.length > 0) {
    customFields.push({
      key: 'title',
      field_value: formData.title.join(', '),
    });
  }

  // Add all other form fields as custom fields
  const fieldMappings: Array<{ key: string; value: string }> = [
    { key: 'expertise', value: formData.expertise },
    { key: 'credibility', value: formData.credibility },
    { key: 'podcast_name', value: formData.podcastName },
    { key: 'host_name', value: formData.hostName },
    { key: 'guest_name', value: formData.guestName },
    { key: 'episode_topic', value: formData.episodeTopic },
    { key: 'why_podcast', value: formData.whyPodcast },
    { key: 'social_platform', value: formData.socialPlatform },
    { key: 'followers', value: formData.followers },
    { key: 'topic_1', value: formData.topic1 },
    { key: 'topic_2', value: formData.topic2 },
    { key: 'topic_3', value: formData.topic3 },
    { key: 'unique_angle', value: formData.uniqueAngle },
    { key: 'audience_benefit', value: formData.audienceBenefit },
  ];

  // Only add non-empty fields
  fieldMappings.forEach(({ key, value }) => {
    if (value && value.trim()) {
      customFields.push({
        key,
        field_value: value.trim(),
      });
    }
  });

  // Build tags array
  const tags: string[] = [
    'Podcast Pitch Generator',
    'Content Catalyst Newsletter', // Subscribe to newsletter
  ];
  if (formData.title && formData.title.length > 0) {
    tags.push(...formData.title.map(t => `Role: ${t}`));
  }
  if (formData.podcastName) {
    tags.push(`Podcast: ${formData.podcastName}`);
  }

  // Build contact object
  const contact: GHLContact = {
    email: email.toLowerCase(),
    firstName: formData.firstName?.trim() || undefined,
    lastName: formData.lastName?.trim() || undefined,
    tags: tags.length > 0 ? tags : undefined,
    customFields: customFields.length > 0 ? customFields : undefined,
    source: 'Podcast Pitch Generator',
  };

  try {
    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
        },
        body: JSON.stringify(contact),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GHL API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    console.log('GHL contact created successfully:', result.contact?.id || result.id);
  } catch (error) {
    // Log error but don't throw - we don't want to block email verification
    console.error('Failed to create GHL contact:', error);
    throw error; // Re-throw so caller can log it, but verification will still succeed
  }
}
