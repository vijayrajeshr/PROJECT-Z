// src/utils/filterMenu.js
import { getApplicableOffers } from "./offerUtils";

/**
 * Returns a new array of categories, subcategories, and items,
 * keeping only items that have at least one matching offer.
 */
export function filterCategoriesByOffers(categories, offers) {
  return (
    categories
      .map((cat) => {
        // For each category, map subcategories
        const filteredSubcats = cat.subcategories
          .map((sub) => {
            // Filter items that have at least 1 matching offer
            const filteredItems = sub.items.filter((item) => {
              const matched = getApplicableOffers(item, offers);
              return matched.length > 0; // keep if there's at least one offer
            });

            return {
              ...sub,
              items: filteredItems,
            };
          })
          // Now remove subcategories that end up with 0 items
          .filter((sub) => sub.items.length > 0);

        return {
          ...cat,
          subcategories: filteredSubcats,
        };
      })
      // Remove categories that end up with 0 subcategories
      .filter((cat) => cat.subcategories.length > 0)
  );
}
