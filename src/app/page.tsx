"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IntroSplash from "../components/IntroSplash";
import CornerCountdown from "../components/CornerCountdown";
import NavSignpost from "../components/NavSignpost";

gsap.registerPlugin(ScrollTrigger);

const timelineSteps = [
  { id: 1, name: "TROY", desc: "The fall of Troy and the start of the return voyage." },
  { id: 2, name: "ISMARUS", desc: "Raid on the Cicones and coastal battles." },
  { id: 3, name: "LOTUS EATERS", desc: "Temptation of forgetfulness on foreign shores." },
  { id: 4, name: "CYCLOPS", desc: "Outsmarting Polyphemus in the cave of the giant." },
  { id: 5, name: "LAESTRYGONIANS", desc: "Escape from the terrifying man-eating giants." },
  { id: 6, name: "CIRCE", desc: "Magic and enchantment on the island of Aeaea." },
  { id: 7, name: "UNDERWORLD", desc: "Consulting the blind prophet Tiresias in Hades." },
  { id: 8, name: "SIRENS", desc: "Resisting the deadly song bound to the ship mast." },
  { id: 9, name: "SCYLLA & CHARYBDIS", desc: "Navigating between the monster and the whirlpool." },
  { id: 10, name: "ISLAND OF THE SUN", desc: "The fatal slaughter of Helios' sacred cattle." },
  { id: 11, name: "CALYPSO", desc: "Seven years held captive on Ogygia island." },
  { id: 12, name: "PHAEACIANS", desc: "Final hospitality before the homecoming ship." },
  { id: 13, name: "ITHACA", desc: "Reclaiming the throne and reuniting with Penelope." },
];

const faqs = [
  {
    question: "Who was Odysseus?",
    answer:
      "Odysseus was the legendary king of Ithaca, famed for his cunning, leadership, and brilliance during the Trojan War.",
  },
  {
    question: "Why did the journey take ten years?",
    answer:
      "After incurring the wrath of Poseidon by blinding Polyphemus, Odysseus faced endless storms, detours, and godly trials across sea realms.",
  },
  {
    question: "Who was Poseidon?",
    answer:
      "The powerful god of the sea and storms whose relentless anger drove Odysseus into a decade of dangerous obstacles.",
  },
  {
    question: "What happened with the Cyclops?",
    answer:
      "Trapped in Polyphemus' cave, Odysseus tricked the giant by calling himself 'Nobody', blinded him with a heated stake, and escaped under sheep.",
  },
  {
    question: "How did Odysseus return to Ithaca?",
    answer:
      "Disguised as a beggar with Athena's assistance, he entered his palace in secret, won the bow contest, and reclaimed his home.",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    let lenis: any;

    async function initLenis() {
      const LenisModule = await import("lenis");
      const LenisClass = LenisModule.default ?? LenisModule;

      lenis = new LenisClass({
        duration: 1.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        lerp: 0.08,
      });

      lenisRef.current = lenis;

      if (showIntro) {
        lenis.stop();
      }

      // Synchronize Lenis scroll updates with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      function update(time: number) {
        lenis.raf(time * 1000);
      }

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    }

    initLenis();

    const ctx = gsap.context(() => {
      // 3D HERO ENVIRONMENT ANIMATION (Butter Smooth Scrubbing)
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scene-container",
          start: "top top",
          end: "+=2400",
          pin: true,
          scrub: 1.5, // Ultra smooth inertia momentum
        },
      });

      // LAYER 1: BACKGROUND (Slow Parallax & Scale)
      heroTl.to(
        ".layer-bg-img",
        {
          yPercent: -6,
          scale: 1.04,
          ease: "none",
        },
        0
      );

      // LAYER 2: ODYSSEY LOGO (Vertical Movement & Scale)
      heroTl.to(
        ".layer-logo-container",
        {
          y: -75,
          scale: 0.84,
          opacity: 0.9,
          ease: "none",
        },
        0
      );

      // LAYER 3: GREEK WARRIOR (MOVES SMOOTHLY FROM DOWN TO UP ON SCROLL DOWN)
      heroTl.fromTo(
        ".layer-warrior-container",
        { y: 220, opacity: 0.8 },
        {
          y: -40,
          opacity: 1,
          ease: "none",
        },
        0
      );

      // SECTION 2 (ABOUT US): GREEK WARRIOR GLIDES IN ULTRA-SMOOTH FROM OFF-SCREEN RIGHT
      gsap.fromTo(
        ".about-warrior-layer",
        { xPercent: 45, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            end: "top 15%",
            scrub: 1.5,
          },
        }
      );

      // STEP-BY-STEP STACKING CARD ANIMATION FOR SUBSEQUENT SECTIONS
      const cards = gsap.utils.toArray<HTMLElement>(".stack-section-wrapper");

      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          const nextCard = cards[index + 1];

          gsap.to(card, {
            scale: 0.94,
            borderRadius: "20px",
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top top",
              scrub: 1.5,
            },
          });
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (lenis) lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = "hidden";
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    } else {
      document.body.style.overflow = "";
      if (lenisRef.current) {
        lenisRef.current.start();
      }
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [showIntro]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const scrollToSection = (id: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { duration: 1.5 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* ANCIENT GREEK SIGNPOST NAVIGATION MODAL (Slides Down to Up with Blurred Background) */}
      <NavSignpost
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onNavigate={scrollToSection}
      />

      {/* GLOBAL FIXED HOME CREST ICON (Visible on EVERY page & section in bottom-left corner, hidden when signpost is open) */}
      <AnimatePresence>
        {!isNavOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setIsNavOpen(true)}
            className="home-icon-wrapper group"
            aria-label="Open Odyssey Navigation"
            title="Odyssey Navigation"
          >
            <div className="home-icon-halo" />
            <img
              src="/home-crest.png"
              alt="Home"
              className="home-icon-img"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <main ref={containerRef} className="relative w-full bg-[#020305]">
      {/* 3D HERO ENVIRONMENT CONTAINER */}
      <div id="scene-container" className="cinematic-pinned-container">
        {/* CORNER COUNTDOWN TIMER (Small, Transparent, No extra text) */}
        <CornerCountdown />

        {/* IMAGE 1 = BACKGROUND */}
        <img
          src="/layer-bg.jpg"
          alt="Odyssey Background Environment"
          className="layer-bg-img"
        />

        {/* IMAGE 2 = ODYSSEY LOGO */}
        <div className="layer-logo-container">
          <img
            src="/layer-logo-clean.png"
            alt="Odyssey Logo Artwork"
            className="layer-logo-img"
          />
        </div>

        {/* IMAGE 3 = GREEK WARRIOR (Moves Smoothly Down to Up on Scroll Down) */}
        <div className="layer-warrior-container">
          <img
            src="/layer-warrior-clean.png"
            alt="Greek Warrior Foreground Layer"
            className="layer-warrior-img"
          />
        </div>

        {/* ATMOSPHERIC OVERLAYS */}
        <div className="cinematic-vignette" />
      </div>

      {/* DIVIDER: Hero → About */}
      <div className="section-divider">
        <img src="/divider.png" alt="" className="section-divider-img" />
      </div>

      {/* STEP-BY-STEP SECTIONS */}

      {/* STEP 1: ABOUT US */}
      <div className="stack-section-wrapper" id="about">
        <section className="stack-card-inner about-section">
          {/* SUNSET CITY BACKGROUND */}
          <img
            src="/image.png"
            alt="Ancient Greek Sunset City Background"
            className="about-bg"
          />
          <div className="vignette-overlay" />

          <h2 className="section-header-title">ABOUT US</h2>

          <div className="about-content-wrapper">
            {/* ABOUT US TEXT CARD ON LEFT SIDE */}
            <div className="about-text-card">
              <h3 className="about-card-heading">ABOUT US</h3>
              <p className="about-description">
                Odysseus, king of Ithaca, set sail for home after the fall of Troy.
                What should have been a short journey became a ten-year odyssey
                filled with monsters, gods, storms, and the ultimate test of wisdom,
                courage, and perseverance.
              </p>
              <button
                onClick={() => scrollToSection("timeline")}
                className="gold-outline-btn"
              >
                DISCOVER THE STORY
              </button>
            </div>
          </div>

          {/* GREEK WARRIOR TRANSPARENT LAYER */}
          <div className="about-warrior-layer">
            <img
              src="/about-warrior-transparent.png"
              alt="Greek Warrior Back-Facing Layer"
              className="about-warrior-img"
            />
          </div>
        </section>
      </div>

      {/* DIVIDER: About → Timeline */}
      <div className="section-divider">
        <img src="/divider.png" alt="" className="section-divider-img" />
      </div>

      {/* STEP 2: TIMELINE MAP (map.jpg.png) */}
      <div className="stack-section-wrapper" id="timeline">
        <section className="stack-card-inner timeline-section">
          <img
            src="/map.jpg.png"
            alt="Odyssey Map Timeline Background"
            className="timeline-bg"
          />
          <div className="vignette-overlay" />

          <h2 className="section-header-title">TIMELINE</h2>

          <div className="w-full">
            <div className="timeline-nodes-grid">
              {timelineSteps.map((step) => (
                <div
                  key={step.id}
                  className="timeline-node"
                  onMouseEnter={() => setActiveNode(step.id)}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  <div className="node-badge">
                    <span className="node-number">{step.id}</span>
                  </div>
                  <span className="node-label">{step.name}</span>
                  {activeNode === step.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-20 top-16 bg-black/95 border border-[#c89b52]/50 p-3 rounded text-xs text-[#d6d0c4] max-w-[180px] shadow-2xl pointer-events-none"
                    >
                      {step.desc}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* DIVIDER: Timeline → Sponsors */}
      <div className="section-divider">
        <img src="/divider.png" alt="" className="section-divider-img" />
      </div>

      {/* STEP 3: SPONSORS (spon.jpg.png - Ships Moving Background) */}
      <div className="stack-section-wrapper" id="sponsors">
        <section className="stack-card-inner sponsors-section">
          <img
            src="/spon.jpg.png"
            alt="Past Sponsors Ship Background"
            className="sponsors-bg"
          />
          <div className="vignette-overlay" />

          <h2 className="section-header-title">PAST SPONSORS</h2>

          <div className="sponsors-container">
            <div className="sponsors-logos-row">
              <div className="sponsor-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#c89b52">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                </svg>
                <span>SPARTAN</span>
              </div>
              <div className="sponsor-item">AEGEAN</div>
              <div className="sponsor-item">MYTHOS STUDIOS</div>
              <div className="sponsor-item">LEGENDS</div>
            </div>
          </div>
        </section>
      </div>

      {/* DIVIDER: Sponsors → FAQ */}
      <div className="section-divider">
        <img src="/divider.png" alt="" className="section-divider-img" />
      </div>

      {/* STEP 4: FAQ (faq.jpg.png - Ocean Waves Flowing Background) */}
      <div className="stack-section-wrapper" id="faq">
        <section className="stack-card-inner faq-section">
          <img
            src="/faq.jpg.png"
            alt="FAQ Storm Background"
            className="faq-bg"
          />
          <div className="vignette-overlay" />

          <h2 className="section-header-title">FAQ</h2>

          <div className="faq-container">
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className={`faq-chevron ${openFaq === index ? "open" : ""}`}>
                      ▼
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="faq-answer">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* DIVIDER: FAQ → Footer */}
      <div className="section-divider">
        <img src="/divider.png" alt="" className="section-divider-img" />
      </div>

      {/* STEP 5: FINAL FOOTER (logo.png.png) */}
      <div className="stack-section-wrapper" id="footer">
        <section className="stack-card-inner footer-section">
          <img
            src="/logo.png.png"
            alt="Final Odyssey Background"
            className="footer-bg"
          />
          <div className="vignette-overlay" />

          <div className="footer-content">
            <div className="footer-quote">
              <p>Every journey has an ending.</p>
              <p>Every legend lives forever.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
