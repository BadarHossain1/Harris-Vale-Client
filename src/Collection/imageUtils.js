// Simple utility function to get product images array
export const parseProductImages = (product) => {
    // If product has images array, use it directly
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        console.log(`🖼️ Using ${product.images.length} images for product: ${product.name}`);
        return product.images;
    }
    
    // Fallback to single image
    console.log(`🖼️ Using single image for product: ${product.name}`);
    return product.image ? [product.image] : [];
};

// Utility function to clean and truncate product descriptions
export const cleanProductDescription = (description, maxLength = 50) => {
    if (!description) return 'Premium quality product';
    
    // Remove extra whitespace and newlines
    const cleaned = description.trim().replace(/\s+/g, ' ');
    
    // Truncate if needed
    if (cleaned.length > maxLength) {
        return cleaned.substring(0, maxLength) + '...';
    }
    
    return cleaned;
};

export default parseProductImages;