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
        // Primary Brand Colors
        'dealflow-midnight': '#223843',
        'dealflow-teal': '#223843', // Alias for midnight-teal
        'dealflow-sky': '#38A1DB',
        'dealflow-orange': '#FF5733',
        'dealflow-light-grey': '#C2C2C2',
        'dealflow-cream': '#FFFCF6',
        // Complementary Colors (for future use)
        'dealflow-warm-green': '#6DA34D',
        'dealflow-golden-yellow': '#F4D35E',
        'dealflow-muted-red': '#D64933',
        'dealflow-dusty-purple': '#826AED',
        'dealflow-deep-coral': '#E07A5F',
        'dealflow-soft-peach': '#FFD6BA',
        'dealflow-steel-blue': '#4A6FA5',
        'dealflow-cool-mint': '#A8E6CF',
        'dealflow-earthy-brown': '#8E735B',
        'dealflow-blush-pink': '#F7B2AD',
      },
      fontFamily: {
        heading: ['Merriweather', 'serif'],
        body: ['Nunito', 'sans-serif'],
        sans: ['Nunito', 'sans-serif'], // Default to Nunito
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulsate': 'pulsate 2s ease-in-out infinite',
        'pulse-locked': 'pulse-locked 2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(56, 161, 219, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(56, 161, 219, 0.6), 0 0 40px rgba(56, 161, 219, 0.4)' },
        },
        'pulsate': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'pulse-locked': {
          '0%, 100%': { 
            borderColor: 'rgba(194, 194, 194, 0.3)',
            boxShadow: '0 0 0 0 rgba(244, 211, 94, 0.4)',
            transform: 'scale(1)',
          },
          '50%': { 
            borderColor: 'rgba(244, 211, 94, 0.6)',
            boxShadow: '0 0 0 4px rgba(244, 211, 94, 0.2)',
            transform: 'scale(1.02)',
          },
        },
      },
    },
  },
  plugins: [],
};
