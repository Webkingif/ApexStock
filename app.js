
const LOCAL_BACKUP_PRODUCTS = [
  {
    id: 101,
    title: "Apex High-Performance Server Cabinet",
    description: "Multi-layered enterprise rack enclosure with active thermal circulation fans, tempered safety glass, and heavy-duty casters.",
    category: "servers",
    price: 1249.99,
    discountPercentage: 12.5,
    rating: 4.88,
    stock: 4,
    tags: ["Enterprise", "Rackmount", "Hardware"],
    brand: "ApexHardware",
    sku: "APX-SRV-CAB-89",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80",
    dimensions: { width: 60, height: 120, depth: 80 },
    warrantyInformation: "3 year limited warranty",
    shippingInformation: "Free inside-delivery shipping",
    returnPolicy: "30 days easy return policy",
    reviews: [
      { reviewerName: "Marcus Sterling", rating: 5, comment: "Keeps our high-density rigs incredibly cool. Worth every cent." },
      { reviewerName: "Janet Vance", rating: 4, comment: "Impeccable build quality, though extremely heavy to position." }
    ]
  },
  {
    id: 102,
    title: "Quantum Flux Cat-6 Ethernet Reel",
    description: "Solid copper oxygen-free bulk cable spool with low attenuation shielding, suitable for extreme bandwidth runs.",
    category: "cabling",
    price: 349.00,
    discountPercentage: 8,
    rating: 4.65,
    stock: 58,
    tags: ["Networking", "Cabling", "Infrastructure"],
    brand: "QuantumFlux",
    sku: "QNT-CAT6-RL-01",
    thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80",
    dimensions: { width: 35, height: 35, depth: 30 },
    warrantyInformation: "Generous lifetime guarantee",
    shippingInformation: "Ships in 24 hours",
    returnPolicy: "60 days complete cashback guarantee",
    reviews: [
      { reviewerName: "Elena Rostova", rating: 5, comment: "Pristine signal clarity over long 100-meter stretches." }
    ]
  },
  {
    id: 103,
    title: "Apex Layer-3 Managed Switch (48-Port)",
    description: "Enterprise access layer PoE+ hub with four 10G SFP+ uplink ports, advanced spanning tree protocols, and redundant modular electricity inputs.",
    category: "networking",
    price: 899.99,
    discountPercentage: 15.0,
    rating: 4.92,
    stock: 8,
    tags: ["Enterprise", "Networking", "PoE"],
    brand: "ApexHardware",
    sku: "APX-NSW-48P-L3",
    thumbnail: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&auto=format&fit=crop&q=80",
    dimensions: { width: 44, height: 4.4, depth: 32 },
    warrantyInformation: "5 year premium replacement",
    shippingInformation: "Ships in 2 business days",
    returnPolicy: "14 days return policy",
    reviews: [
      { reviewerName: "DevOps David", rating: 5, comment: "Incredible CLI interface and solid backplane bandwidth." }
    ]
  },
  {
    id: 104,
    title: "Vortex Omni-Directional 5G Antenna Mast",
    description: "Weather-hardened pole-mounted relay station engineered to boost microwave cellular transit capabilities.",
    category: "telecom",
    price: 189.50,
    discountPercentage: 5,
    rating: 3.84,
    stock: 2,
    tags: ["Antenna", "Cellular", "Relay"],
    brand: "VortexComm",
    sku: "VTX-5GN-MST-03",
    thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&auto=format&fit=crop&q=80",
    dimensions: { width: 12, height: 180, depth: 12 },
    warrantyInformation: "1 year standard coverage",
    shippingInformation: "Heavy cargo freight shipping",
    returnPolicy: "No return on open antennas",
    reviews: [
      { reviewerName: "Bill Murphy", rating: 3, comment: "Great gain index but tricky to ground properly in thunder zones." }
    ]
  }
];

// App State
let allProducts = [];
let displayedProducts = [];
let sourceOfData = 'api'; // 'api' or 'backup'

// Multi-criteria filters
let activeCategory = 'all';
let searchQuery = '';
let minPrice = 0;
let maxPrice = 2000;
let minRating = 0;
let showLowStockOnly = false;
let currentSort = 'featured';

// DOM Selectors
const productGrid = document.getElementById('product-grid');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const emptyState = document.getElementById('empty-state');
const errorMessageText = document.getElementById('error-message-text');
const retryFetchBtn = document.getElementById('retry-fetch-btn');

const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const sortSelect = document.getElementById('sort-select');
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const advancedDrawer = document.getElementById('advanced-drawer');
const activeFilterIndicator = document.getElementById('active-filter-indicator');
const quickResetBtn = document.getElementById('quick-reset-btn');

const minPriceSlider = document.getElementById('min-price-slider');
const maxPriceSlider = document.getElementById('max-price-slider');
const priceRangeLabel = document.getElementById('price-range-label');
const lowStockCheckbox = document.getElementById('low-stock-checkbox');
const ratingFilterRow = document.getElementById('rating-filter-row');

const sidebarTotalCount = document.getElementById('sidebar-total-count');
const lowStockWarning = document.getElementById('low-stock-warning');
const sidebarLowStockCount = document.getElementById('sidebar-low-stock-count');
const sidebarDataSource = document.getElementById('sidebar-data-source');
const categoryFilterList = document.getElementById('category-filter-list');
const resultsCountBadge = document.getElementById('results-count-badge');
const clearActiveFiltersLink = document.getElementById('clear-active-filters-link');
const resetEmptyBtn = document.getElementById('reset-empty-btn');

// Detail Modal Dialog Selectors
const detailModal = document.getElementById('detail-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalDismissFooterBtn = document.getElementById('modal-dismiss-footer-btn');
const modalImage = document.getElementById('modal-image');
const modalDiscountTag = document.getElementById('modal-discount-tag');
const modalCategoryTag = document.getElementById('modal-category-tag');
const modalBrand = document.getElementById('modal-brand');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalStockBadge = document.getElementById('modal-stock-badge');
const modalPrice = document.getElementById('modal-price');
const modalOriginalPrice = document.getElementById('modal-original-price');
const modalSku = document.getElementById('modal-sku');
const modalDescription = document.getElementById('modal-description');
const specDimensions = document.getElementById('spec-dimensions');
const specWarranty = document.getElementById('spec-warranty');
const specShipping = document.getElementById('spec-shipping');
const specReturns = document.getElementById('spec-returns');
const modalReviewsContainer = document.getElementById('modal-reviews-container');

// Mobile Navigation Toggles
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const sidebar = document.getElementById('sidebar');

// 1. Core API Fetching
async function fetchProductsLedger() {
  showLoading();
  try {
    const res = await fetch('https://dummyjson.com/products?limit=100');
    if (!res.ok) {
      throw new Error(`Server returned error code ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data.products || data.products.length === 0) {
      throw new Error('API returned an empty dataset ledger.');
    }
    // Success: enrich dummy values is necessary
    allProducts = data.products.map(p => ({
      ...p,
      // Create systematic dimensions if missing
      dimensions: p.dimensions || { width: 15, height: 15, depth: 15 },
      sku: p.sku || `SKU-DUM-${p.id}-${Math.floor(Math.random() * 900 + 100)}`,
      warrantyInformation: p.warrantyInformation || "1 Year Manufacturer Guarantee",
      shippingInformation: p.shippingInformation || "Standard ground delivery",
      returnPolicy: p.returnPolicy || "30 days flexible return conditions",
      reviews: p.reviews || []
    }));
    sourceOfData = 'api';
    showGrid();
  } catch (err) {
    console.warn("Product feed failed, loading offline local backups:", err);
    // Graceful Fallback
    allProducts = [...LOCAL_BACKUP_PRODUCTS];
    sourceOfData = 'backup';
    showGrid();
  }

  initializeDashboard();
}

// State Management Displays
function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  productGrid.classList.add('hidden');
  emptyState.classList.add('hidden');
}

function showError(msg) {
  errorMessageText.innerText = msg;
  loadingState.classList.add('hidden');
  errorState.classList.remove('hidden');
  productGrid.classList.add('hidden');
  emptyState.classList.add('hidden');
}

function showGrid() {
  loadingState.classList.add('hidden');
  errorState.classList.add('hidden');
  productGrid.classList.remove('hidden');
}

// 2. Initialize Navigation Bars & Static Metrics
function initializeDashboard() {
  // Setup data source indicators
  sidebarDataSource.innerText = sourceOfData === 'api' ? 'Remote Api API' : 'Local Backup';
  if (sourceOfData === 'backup') {
    sidebarDataSource.style.backgroundColor = '#fdf2e9';
    sidebarDataSource.style.color = '#c2410c';
  } else {
    sidebarDataSource.style.backgroundColor = 'rgba(35, 181, 211, 0.1)';
    sidebarDataSource.style.color = '#1e819b';
  }

  // Populate Categories list navigation buttons
  renderCategoriesList();
  
  // Refresh main metrics
  updateOverviewMetrics();

  // Run initial Filter algorithm
  applyFiltersAndSorting();
}

function updateOverviewMetrics() {
  sidebarTotalCount.innerText = allProducts.length;
  
  const lowStockCount = allProducts.filter(p => p.stock <= 10).length;
  if (lowStockCount > 0) {
    lowStockWarning.classList.remove('hidden');
    sidebarLowStockCount.innerText = lowStockCount;
  } else {
    lowStockWarning.classList.add('hidden');
  }
}

function renderCategoriesList() {
  categoryFilterList.innerHTML = '';
  
  // Extract all distinct categories
  const categories = ['all', ...new Set(allProducts.map(p => p.category))];
  
  categories.forEach(cat => {
    const isCatActive = activeCategory === cat;
    const catProductsCount = cat === 'all' 
      ? allProducts.length 
      : allProducts.filter(p => p.category === cat).length;
    
    const catBtn = document.createElement('button');
    catBtn.className = `category-btn ${isCatActive ? 'active' : ''}`;
    catBtn.setAttribute('data-category', cat);
    
    // Capitalize label nicely
    const clnLabel = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
    
    catBtn.innerHTML = `
      <span>${clnLabel}</span>
      <span class="cat-count">${catProductsCount}</span>
    `;
    
    catBtn.addEventListener('click', () => {
      activeCategory = cat;
      
      // Toggle CSS highlights
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      catBtn.classList.add('active');
      
      // Auto-collapse mobile navigation
      sidebar.classList.remove('open');
      
      applyFiltersAndSorting();
    });
    
    categoryFilterList.appendChild(catBtn);
  });
}

// 3. Multidimensional Filter Logic System
function applyFiltersAndSorting() {
  // Sync the Filter indicator state on the Button
  const queryActive = searchQuery.trim().length > 0 || 
                      minPrice > 0 || 
                      maxPrice < 2000 || 
                      minRating > 0 || 
                      showLowStockOnly;

  if (queryActive) {
    activeFilterIndicator.classList.remove('hidden');
    quickResetBtn.classList.remove('hidden');
    clearActiveFiltersLink.classList.remove('hidden');
  } else {
    activeFilterIndicator.classList.add('hidden');
    quickResetBtn.classList.add('hidden');
    clearActiveFiltersLink.classList.add('hidden');
  }

  // Chain filter conditions
  displayedProducts = allProducts.filter(prod => {
    // Category check
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }

    // Search query check (SKU, brand, title, tags)
    if (searchQuery.trim().length > 0) {
      const s = searchQuery.toLowerCase();
      const matchTitle = prod.title?.toLowerCase().includes(s);
      const matchBrand = prod.brand?.toLowerCase().includes(s);
      const matchSku = prod.sku?.toLowerCase().includes(s);
      const matchTags = prod.tags && prod.tags.some(t => t.toLowerCase().includes(s));
      const matchCategory = prod.category?.toLowerCase().includes(s);
      if (!matchTitle && !matchBrand && !matchSku && !matchTags && !matchCategory) {
        return false;
      }
    }

    // Price range bounds
    if (prod.price < minPrice || prod.price > maxPrice) {
      return false;
    }

    // Stars threshold
    if (prod.rating < minRating) {
      return false;
    }

    // Low stock warning alerts
    if (showLowStockOnly && prod.stock > 10) {
      return false;
    }

    return true;
  });

  // Sort criteria logic block
  sortDisplayedProducts();

  // Draw final elements is list has items
  renderProductGrid();
}

function sortDisplayedProducts() {
  switch (currentSort) {
    case 'price-asc':
      displayedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      displayedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      displayedProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'discount':
      displayedProducts.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      break;
    case 'title-asc':
      displayedProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'featured':
    default:
      // default server sorted / featured layout
      break;
  }
}

// 4. Dom Products Grid Render Engine
function renderProductGrid() {
  productGrid.innerHTML = '';
  
  resultsCountBadge.innerText = `${displayedProducts.length} displayed`;
  
  if (displayedProducts.length === 0) {
    productGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  productGrid.classList.remove('hidden');

  displayedProducts.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('id', `vanilla-card-${item.id}`);

    // Clean image placeholder if blank
    const fallbackImage = `https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80`;
    const imageSource = item.thumbnail || fallbackImage;

    // Discount calculations
    const displayDiscount = item.discountPercentage && item.discountPercentage >= 3;
    const computedOriginal = displayDiscount 
      ? (item.price / (1 - item.discountPercentage / 100)).toFixed(2)
      : null;

    // Check stock warning level
    const isLowStock = item.stock <= 10;
    const stockPillClass = isLowStock ? 'stock-pill low' : 'stock-pill ok';
    const stockLabel = isLowStock ? `${item.stock} left` : 'In Stock';

    card.innerHTML = `
      <div class="card-media">
        ${displayDiscount ? `<span class="discount-badge">Save ${Math.round(item.discountPercentage)}%</span>` : ''}
        <span class="badge-tag">${item.category.replace('-', ' ')}</span>
        <img src="${imageSource}" alt="${item.title}" loading="lazy" referrerPolicy="no-referrer">
      </div>
      <div class="card-body">
        <span class="card-brand">${item.brand || 'Generic Specs'}</span>
        <h4 class="card-title" title="${item.title}">${item.title}</h4>
        
        <div class="card-rating-row select-none">
          <div class="stars-inline">
            ${'<i data-lucide="star"></i>'.repeat(Math.round(item.rating || 5))}
          </div>
          <span class="num-rating">${Number(item.rating || 5).toFixed(1)}</span>
        </div>

        <div class="card-price-row">
          <span class="price-now">$${Number(item.price).toFixed(2)}</span>
          ${computedOriginal ? `<span class="price-was">$${computedOriginal}</span>` : ''}
        </div>

        <div class="card-footer">
          <span class="font-mono text-xs text-secondary mt-1">SKU: ${item.sku.substring(0, 10)}</span>
          <span class="${stockPillClass}">${stockLabel}</span>
        </div>
      </div>
    `;

    // Interactivity: clicking card shows specifications modal popup
    card.addEventListener('click', () => {
      openProductDetailsModal(item);
    });

    productGrid.appendChild(card);
  });

  // Re-run lucide icons to display loaded classes inside newly written HTML
  lucide.createIcons();
}

// 5. Open Detailed Dialog Popup Specs sheets
function openProductDetailsModal(prod) {
  // Image layout
  modalImage.src = prod.thumbnail || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80';
  modalImage.alt = prod.title;

  // Discount configuration
  if (prod.discountPercentage && prod.discountPercentage >= 3) {
    modalDiscountTag.classList.remove('hidden');
    modalDiscountTag.innerText = `Save ${Math.round(prod.discountPercentage)}%`;
    
    const computedOriginal = (prod.price / (1 - prod.discountPercentage / 100)).toFixed(2);
    modalOriginalPrice.innerText = `$${computedOriginal}`;
    modalOriginalPrice.classList.remove('hidden');
  } else {
    modalDiscountTag.classList.add('hidden');
    modalOriginalPrice.classList.add('hidden');
  }

  // Setup text elements
  modalCategoryTag.innerText = prod.category.replace('-', ' ');
  modalBrand.innerText = prod.brand || 'Standard Utility';
  modalTitle.innerText = prod.title;
  modalRating.innerText = Number(prod.rating || 5).toFixed(1);
  modalPrice.innerText = `$${Number(prod.price).toFixed(2)}`;
  modalSku.innerText = prod.sku;
  modalDescription.innerText = prod.description || "No customized hardware description compiled in index ledger database.";

  // Config stock level info
  const isL = prod.stock <= 10;
  modalStockBadge.className = isL ? 'stock-pill low font-mono text-xs' : 'stock-pill ok font-mono text-xs';
  modalStockBadge.innerText = isL ? `Critical: Only ${prod.stock} items remain!` : `Active: ${prod.stock} units available`;

  // Update bento-grid tech items
  const d = prod.dimensions || { width: 12, height: 12, depth: 12 };
  specDimensions.innerText = `${d.width} x ${d.height} x ${d.depth} cm`;
  specWarranty.innerText = prod.warrantyInformation || "2-Year Standard warranty";
  specShipping.innerText = prod.shippingInformation || "Free standard express shipping";
  specReturns.innerText = prod.returnPolicy || "Standard return conditions";

  // Reviews integration
  modalReviewsContainer.innerHTML = '';
  if (prod.reviews && prod.reviews.length > 0) {
    prod.reviews.forEach(rev => {
      const revDiv = document.createElement('div');
      revDiv.className = 'review-item';
      
      revDiv.innerHTML = `
        <div class="review-meta">
          <span class="review-author">${rev.reviewerName}</span>
          <span class="review-stars">${'★'.repeat(Math.round(rev.rating || 5))}</span>
        </div>
        <p class="review-text">${rev.comment || 'Outstanding high precision product.'}</p>
      `;
      modalReviewsContainer.appendChild(revDiv);
    });
  } else {
    modalReviewsContainer.innerHTML = `
      <p class="text-secondary text-xs italic">No verification records submitted yet for this serial unit.</p>
    `;
  }

  // Display of Dialog window
  detailModal.classList.remove('hidden');
  
  // Re-run lucide parsing within modal elements
  lucide.createIcons();
}

function closeProductDetailsModal() {
  detailModal.classList.add('hidden');
}

// 6. Interaction Listeners & Resets
function resetAllControlInputs() {
  searchQuery = '';
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  
  minPrice = 0;
  maxPrice = 2000;
  minPriceSlider.value = 0;
  maxPriceSlider.value = 2000;
  priceRangeLabel.innerText = "$0 - $2000";

  minRating = 0;
  document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-rating') === "0") {
      btn.classList.add('active');
    }
  });

  showLowStockOnly = false;
  lowStockCheckbox.checked = false;

  currentSort = 'featured';
  sortSelect.value = 'featured';

  applyFiltersAndSorting();
}

// DOM Setup Bindings
function bindInteractionListeners() {
  
  // Live Searches
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.trim().length > 0) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    applyFiltersAndSorting();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    applyFiltersAndSorting();
  });

  // Sort changes
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndSorting();
  });

  // Filter dialog drawer visibility toggle
  filterToggleBtn.addEventListener('click', () => {
    const isClosed = advancedDrawer.classList.contains('hidden');
    if (isClosed) {
      advancedDrawer.classList.remove('hidden');
      filterToggleBtn.classList.add('active');
    } else {
      advancedDrawer.classList.add('hidden');
      filterToggleBtn.classList.remove('active');
    }
  });

  // Dual-slider pricing range logic
  minPriceSlider.addEventListener('input', (e) => {
    const minVal = parseInt(e.target.value);
    const maxVal = parseInt(maxPriceSlider.value);
    
    if (minVal > maxVal) {
      minPriceSlider.value = maxVal;
      minPrice = maxVal;
    } else {
      minPrice = minVal;
    }
    priceRangeLabel.innerText = `$${minPrice} - $${maxPrice}`;
    applyFiltersAndSorting();
  });

  maxPriceSlider.addEventListener('input', (e) => {
    const minVal = parseInt(minPriceSlider.value);
    const maxVal = parseInt(e.target.value);
    
    if (maxVal < minVal) {
      maxPriceSlider.value = minVal;
      maxPrice = minVal;
    } else {
      maxPrice = maxVal;
    }
    priceRangeLabel.innerText = `$${minPrice} - $${maxPrice}`;
    applyFiltersAndSorting();
  });

  // Stars trigger list buttons
  document.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      minRating = parseFloat(btn.getAttribute('data-rating') || "0");
      applyFiltersAndSorting();
    });
  });

  // Low stock indicator check
  lowStockCheckbox.addEventListener('change', (e) => {
    showLowStockOnly = e.target.checked;
    applyFiltersAndSorting();
  });

  // Reset hooks
  quickResetBtn.addEventListener('click', resetAllControlInputs);
  clearActiveFiltersLink.addEventListener('click', resetAllControlInputs);
  resetEmptyBtn.addEventListener('click', resetAllControlInputs);

  // Close modals
  modalCloseBtn.addEventListener('click', closeProductDetailsModal);
  modalDismissFooterBtn.addEventListener('click', closeProductDetailsModal);
  
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      closeProductDetailsModal();
    }
  });

  // Keyboard dismiss
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductDetailsModal();
    }
  });

  // Mobile navigation trigger buttons
  mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
  });

  sidebarCloseBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  // Connection diagnostics error retry button handler
  retryFetchBtn.addEventListener('click', () => {
    fetchProductsLedger();
  });
}

// Launch application process
document.addEventListener('DOMContentLoaded', () => {
  bindInteractionListeners();
  fetchProductsLedger();
});
