import crypto from 'crypto';

/**
 * Normalizes raw scraper data and generates a deterministic identity hash.
 * This ensures that the same cafe scraped multiple times always maps to the same DB record.
 */
export function normalizeLead(rawLead) {
  // 1. Sanitize and normalize fields
  const name = (rawLead.name || '').trim();
  const city = (rawLead.city || '').trim();
  // Strip all non-digit characters from phone for consistency
  const phone = (rawLead.phone || '').replace(/\D/g, ''); 
  const category = (rawLead.category || 'Unknown').trim();
  const website = (rawLead.website || '').trim();

  if (!name || !city) {
    throw new Error("Missing required fields for identity generation (name, city).");
  }

  // 2. Generate deterministic identity hash
  // Using lowercased values to prevent duplicates from case differences
  const hashInput = `${name.toLowerCase()}|${city.toLowerCase()}|${phone}`;
  const identity_hash = crypto.createHash('sha256').update(hashInput).digest('hex');

  return {
    identity_hash,
    name,
    city,
    category,
    phone,
    website,
    status: 'INGESTED'
  };
}
