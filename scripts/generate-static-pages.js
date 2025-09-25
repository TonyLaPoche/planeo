#!/usr/bin/env node

const { generateAllStaticPages } = require('../src/utils/staticPageGenerator.ts');

console.log('🚀 Generating static pages for Google/AdSense...');
console.log('');

try {
  generateAllStaticPages();
  console.log('');
  console.log('✅ Static pages generated successfully!');
  console.log('📁 Files are located in: public/static-pages/');
  console.log('');
  console.log('🔗 URLs to test:');
  console.log('  - https://planneo.ch/static-pages/cgu.html');
  console.log('  - https://planneo.ch/static-pages/privacy.html');
  console.log('  - https://planneo.ch/static-pages/security.html');
  console.log('');
  console.log('🌍 Multilingual versions:');
  console.log('  - https://planneo.ch/static-pages/cgu-en.html');
  console.log('  - https://planneo.ch/static-pages/cgu-de.html');
  console.log('  - https://planneo.ch/static-pages/cgu-it.html');
  console.log('');
  console.log('📋 Next steps:');
  console.log('  1. Test these URLs in your browser');
  console.log('  2. Use Google Search Console "URL Inspection" tool');
  console.log('  3. Verify Google can see the content');
  console.log('  4. Submit for AdSense review');
} catch (error) {
  console.error('❌ Error generating static pages:', error);
  process.exit(1);
}
