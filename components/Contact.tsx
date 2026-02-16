import ScrollReveal from "@/components/ScrollReveal";

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-white/10 px-6 py-32 text-center md:px-16 lg:px-24"
    >
      <ScrollReveal>
        <h2 className="text-4xl font-medium text-white md:text-5xl">
          I love Shipping.{" "}
          <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
            Fast.
          </span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <p className="mt-6 font-mono text-xs text-white/30">
          Built this in a day :)
        </p>
      </ScrollReveal>

      <ScrollReveal delay={200}>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="mailto:lksujins@gmail.com"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-white/60 transition-all duration-200 hover:border-white/30 hover:text-foreground"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Email
        </a>

        <a
          href="https://github.com/sujink1999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-white/60 transition-all duration-200 hover:border-white/30 hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
          </svg>
          GitHub
        </a>

        <a
          href="https://t.me/sujin0x"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-mono text-sm text-white/60 transition-all duration-200 hover:border-white/30 hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Telegram
        </a>
      </div>
      </ScrollReveal>
    </section>
  );
}
