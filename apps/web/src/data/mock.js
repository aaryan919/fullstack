export const plans = [
  {
    id: 'leaf',
    name: 'Leaf',
    price: 69,
    cycle: 'monthly',
    devices: 2,
    data: 10,
    description: 'Casual browsing with airtight privacy on the go.',
    features: ['2 devices', '10 GB / month', '40+ locations', 'No-logs policy'],
  },
  {
    id: 'grove',
    name: 'Grove',
    price: 149,
    cycle: 'monthly',
    devices: 5,
    data: 100,
    description: 'For households and remote workers who need more headroom.',
    features: ['5 devices', '100 GB / month', '80+ locations', 'Split tunneling', 'Priority routing'],
    popular: true,
  },
  {
    id: 'canopy',
    name: 'Canopy',
    price: 1490,
    cycle: 'yearly',
    devices: 10,
    data: 0,
    description: 'Unlimited bandwidth across every device you own.',
    features: ['10 devices', 'Unlimited data', 'All 90+ locations', 'Dedicated IP option', 'Priority support'],
  },
];

export const servers = [
  { id: 1, country: 'India', city: 'Mumbai', flag: 'IN', ping: 12, load: 34 },
  { id: 2, country: 'India', city: 'Bengaluru', flag: 'IN', ping: 18, load: 51 },
  { id: 3, country: 'Singapore', city: 'Singapore', flag: 'SG', ping: 46, load: 22 },
  { id: 4, country: 'United Kingdom', city: 'London', flag: 'GB', ping: 132, load: 61 },
  { id: 5, country: 'United States', city: 'New York', flag: 'US', ping: 214, load: 44 },
  { id: 6, country: 'United States', city: 'Los Angeles', flag: 'US', ping: 248, load: 29 },
  { id: 7, country: 'Germany', city: 'Frankfurt', flag: 'DE', ping: 118, load: 73 },
  { id: 8, country: 'Japan', city: 'Tokyo', flag: 'JP', ping: 88, load: 38 },
  { id: 9, country: 'Netherlands', city: 'Amsterdam', flag: 'NL', ping: 126, load: 19 },
  { id: 10, country: 'Australia', city: 'Sydney', flag: 'AU', ping: 172, load: 55 },
];

export const usageDaily = [
  { day: 'Mon', gb: 1.2 },
  { day: 'Tue', gb: 2.4 },
  { day: 'Wed', gb: 0.8 },
  { day: 'Thu', gb: 3.1 },
  { day: 'Fri', gb: 2.0 },
  { day: 'Sat', gb: 4.2 },
  { day: 'Sun', gb: 1.6 },
];

export const faqs = [
  { q: 'Do you keep any logs?', a: 'No. Verdant runs a strict no-logs policy. We never record your browsing history, traffic destination, or connection timestamps.' },
  { q: 'Which payment methods are supported?', a: 'We process payments securely through Razorpay in INR, supporting UPI, cards, netbanking and wallets.' },
  { q: 'Can I use one account on multiple devices?', a: 'Yes. Each plan includes a device limit — from 2 on Leaf up to 10 on Canopy. Manage active devices from your account settings.' },
  { q: 'Is there a free trial?', a: 'New accounts get a 7-day trial on the Grove plan. No charge until the trial ends, cancel anytime.' },
  { q: 'How do I cancel?', a: 'Cancel any time from your dashboard. Your plan stays active until the end of the current billing cycle.' },
];
