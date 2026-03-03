"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";

export function HomePage({ content }: { content: SiteContent }) {
  const heroImgRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Navbar scroll
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("scrolled", window.scrollY > 80);
      }
      // Parallax
      if (heroImgRef.current && window.scrollY < window.innerHeight) {
        const p = window.scrollY * 0.35;
        heroImgRef.current.style.transform = `scale(1.1) translateY(${p}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Scroll reveal
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-[1000] px-6 md:px-12 py-5 flex items-center justify-between transition-all duration-500 ${menuOpen ? "menu-open" : ""}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      >
        <style>{`
          nav.scrolled { background: rgba(253,251,247,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding-top: 0.75rem; padding-bottom: 0.75rem; box-shadow: 0 1px 0 rgba(0,0,0,0.06); }
          nav.scrolled .nav-text { color: #1E3529 !important; }
          nav.scrolled .nav-link { color: #5A5A5A !important; }
          nav.scrolled .nav-link:hover { color: #2B4A3A !important; }
          nav.scrolled .burger span { background: #1C1C1C !important; }
          nav.menu-open { background: rgba(253,251,247,0.97); backdrop-filter: blur(20px); }
          nav.menu-open .nav-text { color: #1E3529 !important; }
          nav.menu-open .burger span { background: #1C1C1C !important; }
        `}</style>
        <a href="#" className="flex items-center gap-3 no-underline">
          <img
            src="https://despithold.nl/wp-content/uploads/2022/11/Screenshot-2022-11-07-at-21.31.39-123x117.png"
            alt="De Spithold logo"
            className="h-10 rounded"
          />
          <span
            className="nav-text text-xl font-semibold text-cream"
            style={{ fontFamily: "Fraunces, serif", letterSpacing: "-0.02em" }}
          >
            De Spithold
          </span>
        </a>
        {/* Desktop nav */}
        <ul className="hidden md:flex gap-10 list-none">
          {[
            ["over-ons", "Over Ons"],
            ["boerderij", "Boerderij"],
            ["geschiedenis", "Geschiedenis"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="nav-link bg-transparent border-none text-cream/90 text-[0.85rem] font-medium uppercase tracking-[0.08em] cursor-pointer hover:opacity-100 transition-colors"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        {/* Mobile hamburger */}
        <button
          className="burger md:hidden bg-transparent border-none cursor-pointer p-2 flex flex-col gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className="block w-6 h-[2px] bg-cream transition-all duration-300"
            style={menuOpen ? { transform: "rotate(45deg) translate(5px, 5px)" } : {}}
          />
          <span
            className="block w-6 h-[2px] bg-cream transition-all duration-300"
            style={menuOpen ? { opacity: 0 } : {}}
          />
          <span
            className="block w-6 h-[2px] bg-cream transition-all duration-300"
            style={menuOpen ? { transform: "rotate(-45deg) translate(5px, -5px)" } : {}}
          />
        </button>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/97 backdrop-blur-xl shadow-lg md:hidden">
            <ul className="flex flex-col list-none p-4 gap-1">
              {[
                ["over-ons", "Over Ons"],
                ["boerderij", "Boerderij"],
                ["geschiedenis", "Geschiedenis"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="w-full text-left bg-transparent border-none text-[#5A5A5A] text-[0.95rem] font-medium py-3 px-4 rounded-lg cursor-pointer hover:bg-[#f8f6f3] transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-[-2]">
          <img
            ref={heroImgRef}
            src={content.hero.image}
            alt="De Spithold boerderij"
            className="w-full h-full object-cover scale-110"
            style={{ objectPosition: "center 40%" }}
          />
        </div>
        <div
          className="absolute inset-0 z-[-1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(30,53,41,0.3) 0%, rgba(30,53,41,0.1) 40%, rgba(28,28,28,0.5) 70%, rgba(28,28,28,0.85) 100%)",
          }}
        />
        <div className="relative z-1 px-6 md:px-12 pb-16 md:pb-20 max-w-[900px]">
          <span className="animate-fade-up animate-fade-up-delay-1 inline-block text-[0.75rem] font-medium tracking-[0.2em] uppercase text-sage-muted mb-6 before:content-[''] before:inline-block before:w-8 before:h-[1.5px] before:bg-sage-muted before:align-middle before:mr-3">
            {content.hero.label}
          </span>
          <h1
            className="animate-fade-up animate-fade-up-delay-2 text-cream leading-[1.05] mb-6"
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
            }}
          >
            {content.hero.title}
            <br />
            <em className="italic font-normal text-sage-muted">
              {content.hero.titleEmphasis}
            </em>
          </h1>
          <p className="animate-fade-up animate-fade-up-delay-3 text-lg text-cream/60 max-w-[520px] font-light leading-relaxed">
            {content.hero.subtitle}
          </p>
        </div>
        <div className="absolute bottom-8 right-6 md:right-12 flex flex-col items-center gap-2 text-cream/40 text-[0.65rem] tracking-[0.15em] uppercase animate-fade-up animate-fade-up-delay-4 hidden md:flex">
          <span>Scroll</span>
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, rgba(246,241,233,0.4), transparent)",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* Over Ons */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-warm-white" id="over-ons">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-[1200px] mx-auto items-center">
          <div className="relative rounded-lg overflow-hidden reveal">
            <img
              src={content.about.image}
              alt="Familie Smallegoor"
              className="w-full aspect-[4/5] lg:aspect-[4/5] object-cover hover:scale-[1.03] transition-transform duration-600"
            />
          </div>
          <div>
            <span className="reveal inline-block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-earth mb-8 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-earth before:align-middle before:mr-2.5">
              Over Ons
            </span>
            <h2
              className="reveal mb-6"
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {content.about.title}{" "}
              <em className="italic font-normal text-forest">
                {content.about.titleEmphasis}
              </em>{" "}
              voor het land
            </h2>
            <p className="reveal text-[1.05rem] leading-[1.85] text-[#5A5A5A] mb-6 font-light">
              {content.about.paragraph1}
            </p>
            <p className="reveal text-[1.05rem] leading-[1.85] text-[#5A5A5A] mb-6 font-light">
              {content.about.paragraph2}
            </p>
            <div className="reveal flex gap-8 md:gap-12 mt-10 pt-10 border-t border-cream-dark">
              {[
                [content.about.stat1Number, content.about.stat1Label],
                [content.about.stat2Number, content.about.stat2Label],
                [content.about.stat3Number, content.about.stat3Label],
              ].map(([num, label]) => (
                <div key={label}>
                  <div
                    className="text-forest leading-none"
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "2.5rem",
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {num}
                  </div>
                  <div className="text-[0.75rem] tracking-[0.1em] uppercase text-[#5A5A5A] mt-2">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Onze Boerderij */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-forest-deep text-cream" id="boerderij">
        <div className="max-w-[700px] mb-12 reveal">
          <span className="inline-block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-sage-muted mb-8 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-sage-muted before:align-middle before:mr-2.5">
            Onze Boerderij
          </span>
          <h2
            className="text-cream mb-4"
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {content.farm.title}{" "}
            <em className="italic font-normal text-sage-muted">
              {content.farm.titleEmphasis}
            </em>
          </h2>
          <p className="text-[1.1rem] leading-[1.85] text-cream/60 font-light">
            {content.farm.description}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 max-w-[1200px] mx-auto">
          {[
            [content.farm.image1, content.farm.image1Caption, "16/10"],
            [content.farm.image2, content.farm.image2Caption, "4/3"],
          ].map(([src, cap, ratio]) => (
            <div
              key={cap}
              className="reveal relative rounded-lg overflow-hidden"
              style={{ aspectRatio: ratio }}
            >
              <img
                src={src}
                alt={cap}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div
                className="absolute bottom-0 left-0 right-0 p-6 pt-8"
                style={{
                  background:
                    "linear-gradient(to top, rgba(28,28,28,0.7), transparent)",
                }}
              >
                <span className="text-[0.7rem] tracking-[0.15em] uppercase text-cream/70">
                  {cap}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto mt-12">
          {[
            [
              content.farm.feature1Title,
              content.farm.feature1Text,
              "M12 22c4-4 8-7.5 8-12a8 8 0 10-16 0c0 4.5 4 8 8 12z M12 10a3 3 0 100-6 3 3 0 000 6z",
            ],
            [
              content.farm.feature2Title,
              content.farm.feature2Text,
              "M17 8C8 10 5.9 16.17 3.82 21.34L3 21l1.5-4.5M20 2l-1 1.5 M17 8c2-1 4.5-.5 6 1-1.5 1.5-3 2-4.5 2M17 8c-1 2-.5 4.5 1 6 1.5-1.5 2-3 2-4.5 M11.38 12.13A6 6 0 017 18c-.5 0-1.5 0-3-1",
            ],
            [
              content.farm.feature3Title,
              content.farm.feature3Text,
              "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83",
            ],
          ].map(([title, text, path]) => (
            <div
              key={title}
              className="reveal p-8 border border-cream/8 rounded-lg hover:border-cream/20 transition-colors"
            >
              <svg
                className="w-10 h-10 mb-5 text-sage-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={path} />
              </svg>
              <h3
                className="text-cream mb-3"
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                }}
              >
                {title}
              </h3>
              <p className="text-[0.9rem] leading-[1.7] text-cream/50 font-light">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Geschiedenis */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-cream" id="geschiedenis">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="reveal inline-block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-earth mb-8 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-earth before:align-middle before:mr-2.5">
              Geschiedenis
            </span>
            <h2
              className="reveal mb-6"
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {content.history.title}{" "}
              <em className="italic font-normal text-forest">
                {content.history.titleEmphasis}
              </em>
            </h2>
            <p className="reveal text-[1.05rem] leading-[1.85] text-[#5A5A5A] mb-6 font-light">
              {content.history.paragraph1}
            </p>
            <div className="reveal my-10 pl-8 py-8 border-l-2 border-earth-light">
              <p
                className="text-forest font-light"
                style={{
                  fontFamily: "Fraunces, serif",
                  fontSize: "1.3rem",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                }}
              >
                {content.history.quote}
              </p>
            </div>
            <p className="reveal text-[1.05rem] leading-[1.85] text-[#5A5A5A] font-light">
              {content.history.paragraph2}
            </p>
          </div>
          <div className="reveal relative lg:order-last order-first">
            <span
              className="absolute -top-8 -right-4 lg:-right-6 z-[-1] text-cream-dark leading-none"
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(5rem, 10vw, 8rem)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
              }}
            >
              {content.history.year}
            </span>
            <img
              src={content.history.image}
              alt="Historische locatie De Spithold"
              className="w-full aspect-[3/4] object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-warm-white" id="contact">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <span className="reveal inline-block text-[0.7rem] font-medium tracking-[0.2em] uppercase text-earth mb-8 before:content-[''] before:inline-block before:w-6 before:h-[1.5px] before:bg-earth before:align-middle before:mr-2.5">
              Contact
            </span>
            <h2
              className="reveal mb-6"
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {content.contact.title}{" "}
              <em className="italic font-normal text-forest">
                {content.contact.titleEmphasis}
              </em>{" "}
              met ons op
            </h2>
            <p className="reveal text-[1.05rem] leading-[1.85] text-[#5A5A5A] mb-10 font-light">
              {content.contact.description}
            </p>
            <ul className="reveal flex flex-col gap-6 list-none">
              {[
                [
                  "Locatie",
                  content.contact.location,
                  "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 100-6 3 3 0 000 6z",
                ],
                [
                  "Telefoon",
                  content.contact.phone,
                  "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
                  `tel:${content.contact.phone}`,
                ],
                [
                  "E-mail",
                  content.contact.email,
                  "M2 4h20v16H2z M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7",
                  `mailto:${content.contact.email}`,
                ],
              ].map(([label, value, path, href]) => (
                <li key={label} className="flex items-start gap-4">
                  <svg
                    className="w-5 h-5 text-forest mt-0.5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={path} />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[0.7rem] tracking-[0.15em] uppercase text-earth mb-1">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="text-charcoal no-underline border-b border-cream-dark hover:border-forest transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-charcoal">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal bg-cream rounded-lg overflow-hidden relative min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9735.63!2d6.31!3d52.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b7e2a0a0a0a0a0%3A0x0!2sAlmen!5e0!3m2!1snl!2snl!4v1"
              className="absolute inset-0 w-full h-full border-none saturate-[0.8] contrast-[1.05]"
              allowFullScreen
              loading="lazy"
              title="Locatie De Spithold"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-cream/40 py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://despithold.nl/wp-content/uploads/2022/11/Screenshot-2022-11-07-at-21.31.39-123x117.png"
            alt="De Spithold"
            className="h-7 rounded opacity-60"
          />
          <span
            className="text-cream/60"
            style={{ fontFamily: "Fraunces, serif", fontSize: "1rem" }}
          >
            De Spithold
          </span>
        </div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} De Spithold &mdash; Biologische
          Melkveehouderij, Almen
        </div>
      </footer>
    </>
  );
}
