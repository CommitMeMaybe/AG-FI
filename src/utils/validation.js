const ALLOWED_CITIES = [
  'Kano', 'Ibadan', 'Lagos', 'Abuja', 'Benin City', 'Port Harcourt',
  'Kaduna', 'Jos', 'Ilorin', 'Abeokuta', 'Makurdi', 'Minna', 'Bauchi',
  'Owerri', 'Gombe', 'Yola', 'Maiduguri', 'Akure', 'Katsina', 'Ado Ekiti'
]

const CITY_NORMALIZATION = {
  'kano': 'Kano',
  'ibadan': 'Ibadan',
  'lagos': 'Lagos',
  'abuja': 'Abuja',
  'benin city': 'Benin City',
  'benincity': 'Benin City',
  'port harcourt': 'Port Harcourt',
  'portharcourt': 'Port Harcourt',
  'kaduna': 'Kaduna',
  'jos': 'Jos',
  'ilorin': 'Ilorin',
  'abeokuta': 'Abeokuta',
  'makurdi': 'Makurdi',
  'minna': 'Minna',
  'bauchi': 'Bauchi',
  'owerri': 'Owerri',
  'gombe': 'Gombe',
  'yola': 'Yola',
  'maiduguri': 'Maiduguri',
  'akure': 'Akure',
  'katsina': 'Katsina',
  'ado ekiti': 'Ado Ekiti',
  'adoekiti': 'Ado Ekiti',
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  return input
    .trim()
    .slice(0, 50)
    .replace(/[<>'";&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
}

export function validateCity(city) {
  const sanitized = sanitizeInput(city)
  if (!sanitized || sanitized.length < 2) {
    return { valid: false, error: 'Please enter a valid city name' }
  }

  const normalized = sanitized.toLowerCase()
  const matchedCity = CITY_NORMALIZATION[normalized]

  if (matchedCity) {
    return { valid: true, city: matchedCity }
  }

  const isAllowed = ALLOWED_CITIES.some(
    c => c.toLowerCase() === normalized
  )

  if (isAllowed) {
    return { valid: true, city: ALLOWED_CITIES.find(c => c.toLowerCase() === normalized) }
  }

  return { valid: false, error: 'Please select a city from the allowed list' }
}

export function sanitizeErrorMessage(error) {
  if (!error) return 'An unexpected error occurred'
  const message = String(error)
  return message
    .replace(/[<>'";&]/g, '')
    .slice(0, 200)
}

export function encodeURIComponentSafe(str) {
  return encodeURIComponent(str)
    .replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}
