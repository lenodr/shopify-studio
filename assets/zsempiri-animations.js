/**
 * Zsempiri Soft-Tech Animations (GSAP + ScrollTrigger)
 * 
 * Provides buttery-smooth high-end reveal animations globally.
 * Protected against running inside the Shopify Theme Editor to avoid layout breaks.
 */

document.addEventListener("DOMContentLoaded", (event) => {
    // Biztonsági öv: Ha a Shopify Theme Editorban vagyunk, NE fussanak le az animációk,
    // mert elrontják a blokkok szerkesztését és a drag & dropot.
    if (window.Shopify && window.Shopify.designMode) {
        console.log("Zsempiri Animations: Disabled in Theme Editor mode.");
        return;
    }

    // Ellenőrizzük, hogy betöltött-e a GSAP
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("Zsempiri Animations: GSAP or ScrollTrigger is missing.");
        return;
    }

    // ScrollTrigger regisztrálása
    gsap.registerPlugin(ScrollTrigger);

    // ── 1. Kártyák (Termékek, Kollekciók) Staggered (Késleltetett) Animációja ──
    // Minden gridet megkeresünk, és a benne lévő kártyákat hullámszerűen animáljuk be.
    const grids = document.querySelectorAll('.grid, .collection-list, .product-grid');

    grids.forEach((grid) => {
        const cards = grid.querySelectorAll('.product-card-wrapper, .collection-card-wrapper, .card-wrapper');

        if (cards.length > 0) {
            // Kezdeti állapot beállítása (css-ből is jöhetne, de GSAP-el biztosabb az időzítés)
            gsap.set(cards, { opacity: 0, y: 40 });

            ScrollTrigger.create({
                trigger: grid,
                start: "top 85%", // Amikor a grid teteje eléri az ablak 85%-át
                animation: gsap.to(cards, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.2)", // Finoman túllendülős, lágy érkezés ("Soft-Tech")
                    stagger: 0.1 // 0.1 másodperces csúszás a testvérek között
                }),
                toggleActions: "play none none none" // Csak egyszer játssza le
            });
        }
    });


    // ── 2. Nagyobb tartalom blokkok (Rich text, Image with text, Features) Animációja ──
    // Ezeket egyesével animáljuk, ahogy a képernyőre görgetnek.
    const standaloneElements = document.querySelectorAll('.rich-text, .image-with-text__media, .image-with-text__content, .zsempiri-features__inner, .zsempiri-tiles__wrapper');

    standaloneElements.forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: "power2.out", // Lágy lassulás a végén
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Gombok finom lebegtetős extra érkezése (Opcionális - kommenteld ki, ha sok)
    const primaryButtons = document.querySelectorAll('.button--primary');
    primaryButtons.forEach((btn) => {
        gsap.fromTo(btn,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: btn,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

});
