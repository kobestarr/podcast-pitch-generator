/**
 * Go High Level (GHL) API Integration
 * Creates or updates contacts in GHL CRM after email verification
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
 * Lookup contact by email in GHL
 * @returns Contact data if found, null if not
 */
async function lookupContactByEmail(
  email: string,
  apiKey: string
): Promise<{ id: string; tags: string[] } | null> {
  try {
    const response = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/lookup?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const contact = data.contacts?.[0];
    if (!contact) return null;

    return {
      id: contact.id,
      tags: contact.tags || [],
    };
  } catch (error) {
    console.error('Error looking up contact:', error);
    return null;
  }
}

/**
 * Create or update a contact in GHL with form data (upsert)
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

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    // Check if contact already exists
    const existingContact = await lookupContactByEmail(email, apiKey);

    let response: Response;

    if (existingContact) {
      // UPDATE existing contact - merge tags with existing ones
      console.log('Updating existing GHL contact:', existingContact.id);

      // Merge new tags with existing tags (avoid duplicates)
      const mergedTags = Array.from(new Set([...existingContact.tags, ...tags]));

      response = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/${existingContact.id}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            ...contact,
            tags: mergedTags,
          }),
        }
      );
    } else {
      // CREATE new contact
      console.log('Creating new GHL contact for:', email);
      response = await fetch(
        `https://rest.gohighlevel.com/v1/contacts/`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(contact),
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `GHL API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    console.log('GHL contact saved successfully:', result.contact?.id || result.id || existingContact?.id);
  } catch (error) {
    console.error('Failed to save GHL contact:', error);
    throw error;
  }
}
