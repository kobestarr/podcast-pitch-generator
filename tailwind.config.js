/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dealflow-midnight': '#0D2942',
        'dealflow-teal': '#0D7377',
        'dealflow-sky': '#14919B',
        'dealflow-orange': '#F39237',
        'dealflow-coral': '#E85D5D',
        'dealflow-cream': '#F5F5F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
