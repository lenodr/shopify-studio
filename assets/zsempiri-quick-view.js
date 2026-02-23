/**
 * Zsempiri Soft-Tech Quick View Module
 * Fetches product form via AJAX and displays it in a beautifully rounded modal.
 */

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("ZsempiriQuickViewModal");
    const closeBtn = document.getElementById("ZsempiriQuickViewClose");
    const contentArea = document.getElementById("ZsempiriQuickViewContent");

    if (!overlay || !closeBtn || !contentArea) return;

    const closeModal = () => {
        overlay.classList.remove("is-open");
        // Clear content after animation ends to prevent layout jumping
        setTimeout(() => {
            contentArea.innerHTML = '';
        }, 300);
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    // Fetch product sections using Dawn's Section Rendering API
    const fetchProduct = async (url) => {
        contentArea.innerHTML = ''; // Clear previous
        contentArea.classList.add("is-loading");
        overlay.classList.add("is-open");

        try {
            // Dawn's main product section is typically 'main-product'
            const separator = url.includes('?') ? '&' : '?';
            const response = await fetch(`${url}${separator}section_id=main-product`);

            if (!response.ok) throw new Error("Failed to load product details");

            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const productSection = doc.querySelector('.shopify-section');

            if (productSection) {
                contentArea.innerHTML = productSection.innerHTML;

                // Re-initialize any Shopify custom elements (Dawn relies on these)
                // For example, if Dawn uses web components like <variant-selects>, 
                // they usually self-hydrate when added to the DOM.
            } else {
                contentArea.innerHTML = "<p style='text-align: center; font-family: Jost;'>Sajnos a termék adatai jelenleg nem tölthetők be.</p>";
            }
        } catch (err) {
            console.error("Zsempiri Quick View Error:", err);
            contentArea.innerHTML = "<p style='text-align: center; font-family: Jost;'>Hiba történt a betöltés során.</p>";
        } finally {
            contentArea.classList.remove("is-loading");
        }
    };

    // Delegate click events for trigger buttons (works for dynamically loaded grids too)
    document.body.addEventListener("click", (e) => {
        const triggerBtn = e.target.closest(".zsempiri-quick-view-trigger");
        if (!triggerBtn) return;

        // Aggressive hijack (stops parent <a> links from navigating)
        e.preventDefault();
        e.stopPropagation();

        const productUrl = triggerBtn.getAttribute("data-product-url");
        if (productUrl) {
            fetchProduct(productUrl);
        }
    }, true); // Use capture phase to intercept before generic link handlers
});
