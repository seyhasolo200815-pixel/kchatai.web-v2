import { FeatureCard, QuickPrompt, PricingPlan } from '../types';

export const HERO_FEATURES: FeatureCard[] = [
  {
    id: 'chat',
    iconName: 'MessageSquare',
    title: 'សន្ទនា AI',
    description: 'សំណួរ និងចម្លើយទូទៅ'
  },
  {
    id: 'writing',
    iconName: 'FileText',
    title: 'សរសេរ & កែអត្ថបទ',
    description: 'បង្កើតមាតិកាគ្រប់ប្រភេទ'
  },
  {
    id: 'coding',
    iconName: 'Code',
    title: 'សរសេរកូដ',
    description: 'ជួយសរសេរ និងពន្យល់កូដ'
  },
  {
    id: 'websearch',
    iconName: 'Globe',
    title: 'ស្វែងរកព័ត៌មាន',
    description: 'ព័ត៌មានថ្មីៗពីអ៊ីនធឺណិត'
  },
  {
    id: 'vision',
    iconName: 'Image',
    title: 'វិភាគរូបភាព',
    description: 'ពន្យល់ និងបកស្រាយរូបភាព'
  },
  {
    id: 'voice',
    iconName: 'Mic',
    title: 'សំឡេង & Voice',
    description: 'និយាយ និងស្តាប់សំឡេង'
  }
];

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'p-writing',
    icon: 'FileEdit',
    title: 'សរសេរអត្ថបទ',
    description: 'អត្ថបទ ប្លុក អ៊ីមែល...',
    samplePrompt: 'ជួយសរសេរអ៊ីមែលផ្លូវការជាភាសាខ្មែរ សម្រាប់ស្នើសុំការប្រជុំជាមួយអតិថិជន'
  },
  {
    id: 'p-news',
    icon: 'Globe',
    title: 'ស្វែងរកព័ត៌មានថ្មីៗ',
    description: 'បច្ចុប្បន្នភាព ពិភពលោក...',
    samplePrompt: 'តើមានបច្ចេកវិទ្យា AI អ្វីខ្លះដែលកំពុងរីកចម្រើនខ្លាំងនៅឆ្នាំ ២០២៦?'
  },
  {
    id: 'p-learning',
    icon: 'Lightbulb',
    title: 'ពន្យល់មេរៀន',
    description: 'វិទ្យាសាស្ត្រ វិស្វកម្ម ភាសា...',
    samplePrompt: 'ជួយពន្យល់ពីដំណើរការនៃ Artificial Intelligence ដោយសាមញ្ញ និងងាយយល់'
  },
  {
    id: 'p-translate',
    icon: 'Languages',
    title: 'បកប្រែភាសា',
    description: 'ខ្មែរ អង់គ្លេស និងភាសាផ្សេងទៀត',
    samplePrompt: 'ជួយបកប្រែពាក្យបច្ចេកទេស Computer Science ពីអង់គ្លេសទៅខ្មែរ'
  },
  {
    id: 'p-code',
    icon: 'Code2',
    title: 'សរសេរកូដ',
    description: 'HTML, Python, JavaScript...',
    samplePrompt: 'សរសេរកូដ JavaScript បង្កើត Countdown Timer ដ៏ស្រស់ស្អាត'
  },
  {
    id: 'p-image',
    icon: 'Sparkles',
    title: 'បង្ហាញរូបភាព',
    description: 'បង្កើត និងពន្យល់រូបភាព',
    samplePrompt: 'បង្កើតគំនិត Design Poster ផ្សព្វផ្សាយបច្ចេកវិទ្យាទំនើបសម្រាប់យុវជន'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'SkyPro ឥតគិតថ្លៃ',
    price: '$0',
    period: '/រៀងរហូត',
    features: [
      'សន្ទនា AI មិនកំណត់ជាមួយ SkyPro 3.8',
      'ស្វែងរកព័ត៌មាន និងឆ្លើយតបជាភាសាខ្មែរ',
      'ជួយសរសេរកូដ និងកែសម្រួលអត្ថបទ',
      'ល្បឿនឆ្លើយតបធម្មតា'
    ]
  },
  {
    id: 'pro',
    name: 'SkyPro Pro',
    price: '$9.99',
    period: '/ខែ',
    popular: true,
    features: [
      'ទទួលបានម៉ូដែល AI កម្រិតខ្ពស់បំផុត',
      'ល្បឿនឆ្លើយតបលឿនបំផុត (Ultra-fast)',
      'វិភាគរូបភាព និងបង្កើតរូបភាពកម្រិត 4K',
      'សំឡេង Voice AI ធម្មជាតិជាភាសាខ្មែរ',
      'ការគាំទ្រអាទិភាព ២៤/៧',
      'គ្មានការកំណត់ការប្រើប្រាស់'
    ]
  },
  {
    id: 'team',
    name: 'SkyPro Enterprise',
    price: '$29.99',
    period: '/ខែ',
    features: [
      'សមាជិកក្រុមមិនកំណត់',
      'API Key សម្រាប់ភ្ជាប់ជាមួយប្រព័ន្ធក្រុមហ៊ុន',
      'សុវត្ថិភាពទិន្នន័យកម្រិតធនាគារ',
      'Custom Model សម្រាប់អាជីវកម្មផ្ទាល់ខ្លួន'
    ]
  }
];
