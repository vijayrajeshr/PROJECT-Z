// src/utils/offerUtils.js

/**
 * Returns ALL active offers that match a given item's ID, subCategory, or category.
 * Later, you can decide how to handle multiple offers (combine them, pick the best, etc.).
 */
export function getApplicableOffers(item, allOffers) {
  // Item-level offers
  const itemLevel = allOffers.filter(
    (offer) =>
      offer.scope === "item" && offer.itemIds.includes(item.id) && offer.active
  );

  // Subcategory-level offers
  const subcatLevel = allOffers.filter(
    (offer) =>
      offer.scope === "subcategory" &&
      offer.subCategoryName === item.subCategory &&
      offer.active
  );

  // Category-level offers
  const catLevel = allOffers.filter(
    (offer) =>
      offer.scope === "category" &&
      offer.categoryName === item.category &&
      offer.active
  );

  return [...itemLevel, ...subcatLevel, ...catLevel];
}

/**
 * If you only want to show ONE matching offer per item:
 */
export function getFirstApplicableOffer(item, allOffers) {
  const matches = getApplicableOffers(item, allOffers);
  return matches.length ? matches[0] : null;
}
