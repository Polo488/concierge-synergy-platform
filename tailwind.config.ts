
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // Glass effect colors
        glass: {
          bg: 'hsl(var(--glass-bg))',
          border: 'hsl(var(--glass-border))',
        },
        // Status colors
        status: {
          success: {
            DEFAULT: 'hsl(var(--status-success))',
            light: 'hsl(var(--status-success-light))'
          },
          warning: {
            DEFAULT: 'hsl(var(--status-warning))',
            light: 'hsl(var(--status-warning-light))'
          },
          error: {
            DEFAULT: 'hsl(var(--status-error))',
            light: 'hsl(var(--status-error-light))'
          },
          info: {
            DEFAULT: 'hsl(var(--status-info))',
            light: 'hsl(var(--status-info-light))'
          },
          pending: {
            DEFAULT: 'hsl(var(--status-pending))',
            light: 'hsl(var(--status-pending-light))'
          }
        },
        // Navigation section colors
        nav: {
          pilotage: {
            DEFAULT: 'hsl(var(--nav-pilotage))',
            light: 'hsl(var(--nav-pilotage-light))'
          },
          operations: {
            DEFAULT: 'hsl(var(--nav-operations))',
            light: 'hsl(var(--nav-operations-light))'
          },
          revenus: {
            DEFAULT: 'hsl(var(--nav-revenus))',
            light: 'hsl(var(--nav-revenus-light))'
          },
          experience: {
            DEFAULT: 'hsl(var(--nav-experience))',
            light: 'hsl(var(--nav-experience-light))'
          },
          organisation: {
            DEFAULT: 'hsl(var(--nav-organisation))',
            light: 'hsl(var(--nav-organisation-light))'
          }
        },
        // Channel colors
        channel: {
          airbnb: 'hsl(var(--channel-airbnb))',
          booking: 'hsl(var(--channel-booking))',
          other: 'hsl(var(--channel-other))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "notification-pop": {
          "0%": { transform: "translateY(10px) scale(0.95)", opacity: "0" },
          "60%": { transform: "translateY(-2px) scale(1.02)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "check-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "typing": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "blink": {
          "0%, 50%": { borderColor: "transparent" },
          "51%, 100%": { borderColor: "currentColor" },
        },
        "shimmer-fast": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in": "slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "float": "float 4s ease-in-out infinite",
        "float-delayed": "float-delayed 5s ease-in-out infinite 1s",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "notification-pop": "notification-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "check-in": "check-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "typing": "typing 2s steps(30) forwards",
        "blink": "blink 1s step-end infinite",
        "shimmer-fast": "shimmer-fast 1.5s infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
      },
      boxShadow: {
        'glass': '0 4px 30px hsla(220, 13%, 18%, 0.05)',
        'glass-lg': '0 8px 40px hsla(220, 13%, 18%, 0.08)',
        'glass-dark': '0 4px 30px hsla(0, 0%, 0%, 0.3)',
        'soft': '0 2px 8px hsla(220, 13%, 18%, 0.04)',
        'card': '0 4px 16px -4px hsla(220, 13%, 18%, 0.06)',
        'elevated': '0 8px 32px -8px hsla(220, 13%, 18%, 0.1)',
        'float': '0 12px 40px -12px hsla(220, 13%, 18%, 0.12)',
        'glow': '0 0 20px hsla(var(--primary) / 0.2)',
        'inner-glow': 'inset 0 1px 0 hsla(0, 0%, 100%, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
