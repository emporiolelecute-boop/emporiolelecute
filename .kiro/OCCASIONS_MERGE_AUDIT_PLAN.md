# Audit Plan: Merging "Ocasiões Especiais" with Categories

**Date**: May 15, 2026  
**Status**: Audit Plan (No Implementation Yet)  
**Requested By**: User  
**Scope**: Analysis only - no changes to be made

---

## Executive Summary

This document presents a comprehensive audit and analysis of merging the "Ocasiões Especiais" (Occasions) system with the existing Categories system in Empório LeleCute. The current implementation maintains two separate taxonomies with different relationship models. This plan outlines the current state, impact analysis, and strategic options for consolidation.

---

## 1. CURRENT DATA MODEL

### 1.1 Database Schema

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP
);
```
- **Purpose**: Product type/line classification
- **Relationship**: One-to-many (products.category_id → categories.id)
- **Cardinality**: Each product has 0 or 1 category
- **Current Count**: ~4 categories (Sabonetes, Velas, Kits, Lembrancinhas)

#### Occasions Table
```sql
CREATE TABLE occasions (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP
);
```
- **Purpose**: Event/use-case classification
- **Relationship**: Many-to-many via junction table
- **Cardinality**: Each product can have 0 to N occasions
- **Current Count**: ~6 occasions (Maternidade, Chá de Bebê, Batizado, Casamento, Aniversário, Corporativo)

#### Product-Occasions Junction Table
```sql
CREATE TABLE product_occasions (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  occasion_id UUID REFERENCES occasions(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, occasion_id)
);
```
- **Purpose**: Links products to multiple occasions
- **Cascade**: Deleting occasion cascades to junction table

#### Products Table (Relevant Fields)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES categories(id),  -- nullable, one-to-many
  -- ... other fields
);
```

### 1.2 Semantic Distinction

| Aspect | Categories | Occasions |
|--------|-----------|-----------|
| **Meaning** | What the product IS | What the product is FOR |
| **Relationship** | One-to-many | Many-to-many |
| **Mutually Exclusive** | Yes (product is either soap OR candle) | No (product can be for multiple events) |
| **Classification Type** | Structural/Inventory | Marketing/Discovery |
| **Examples** | Sabonetes, Velas, Kits | Maternidade, Casamento, Aniversário |

---

## 2. CURRENT USAGE ACROSS CODEBASE

### 2.1 Frontend Components Using Categories

| Component | Usage | Impact |
|-----------|-------|--------|
| **Produtos.tsx** | Filter badge in product listing | URL param: `?categoria=slug` |
| **ProductCard.tsx** | Displays category name in card | Shows product type |
| **SearchBar.tsx** | Searchable category filter | Autocomplete suggestions |
| **RelatedProducts.tsx** | Finds related products by category | Same category = higher relevance |
| **AdminProductForm.tsx** | Single select dropdown | Product creation/editing |

### 2.2 Frontend Components Using Occasions

| Component | Usage | Impact |
|-----------|-------|--------|
| **OccasionsSection.tsx** | Database-driven grid display | Shows all occasions with images |
| **Occasions.tsx** | Static hardcoded component | 6 occasions with icons |
| **Produtos.tsx** | Filter badge in product listing | URL param: `?ocasiao=slug` |
| **ProductCard.tsx** | Can display occasion names | Shows use cases |
| **SearchBar.tsx** | Searchable occasion filter | Autocomplete suggestions |
| **RelatedProducts.tsx** | Finds related products by occasion | Shared occasions = relevance |
| **AdminProductForm.tsx** | Multi-select checkboxes | Product creation/editing |

### 2.3 Admin Panel Management

| Feature | Categories | Occasions |
|---------|-----------|-----------|
| **Create** | Dialog with name + auto-slug | Dialog with name + auto-slug |
| **Read** | List with search | List with search |
| **Update** | Inline editing | Inline editing |
| **Delete** | With confirmation warning | With confirmation warning |
| **UI/UX** | Identical to occasions | Identical to categories |
| **File** | `AdminCategories.tsx` | `AdminOccasions.tsx` |

### 2.4 Landing Pages & SEO

- **Occasion-specific landing pages**: `/lembrancinhas-[occasion]`
- **Category-specific pages**: Not explicitly mentioned in routing
- **SEO Impact**: Occasions have dedicated marketing content and URL structure

### 2.5 Data Fetching (useProducts.ts)

```typescript
// Single optimized query with nested selects
SELECT *,
  category:categories(*),
  occasions:product_occasions(occasion:occasions(*)),
  tags:product_tags(tag:tags(*))
FROM products
```

- **Query Efficiency**: Already optimized (no N+1 queries)
- **Data Structure**: Returns `category` as object, `occasions` as array
- **Hooks Affected**: `useDbProducts()`, `useDbProduct(slug)`, `useDbCategories()`, `useDbOccasions()`

---

## 3. IMPACT ANALYSIS

### 3.1 Database Migration Impact

#### Option A: Merge Occasions into Categories (Many-to-Many)

**Changes Required:**
1. Create new junction table: `product_categories` (replacing direct FK)
2. Migrate `products.category_id` data to `product_categories` junction table
3. Migrate `occasions` table data to `categories` table
4. Delete `product_occasions` junction table
5. Delete `occasions` table
6. Drop `category_id` column from `products` table

**Data Migration Strategy:**
```sql
-- Step 1: Create new junction table
CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Step 2: Migrate existing category assignments
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL;

-- Step 3: Migrate occasions to categories
INSERT INTO categories (name, slug, created_at)
SELECT name, slug, created_at FROM occasions;

-- Step 4: Migrate product-occasion relationships
INSERT INTO product_categories (product_id, category_id)
SELECT po.product_id, c.id
FROM product_occasions po
JOIN occasions o ON po.occasion_id = o.id
JOIN categories c ON c.name = o.name;

-- Step 5: Clean up old tables
DROP TABLE product_occasions;
DROP TABLE occasions;
ALTER TABLE products DROP COLUMN category_id;
```

**Risks:**
- ⚠️ Data loss if migration fails (requires backup)
- ⚠️ Duplicate category names possible (e.g., "Sabonetes" as product type AND occasion)
- ⚠️ Loss of semantic distinction between product type and use case
- ⚠️ Requires extensive frontend refactoring

#### Option B: Keep Separate, Add Shared Features

**Changes Required:**
1. Add optional fields to both tables (description, image_url, icon, color)
2. Create unified admin interface for both
3. Add category-occasion cross-linking (optional)
4. Enhance filtering UI to show both taxonomies

**Advantages:**
- ✅ Preserves semantic distinction
- ✅ Minimal database changes
- ✅ Backward compatible
- ✅ Easier to implement

---

### 3.2 Frontend Impact

#### Components Requiring Changes (Option A - Merge)

| Component | Changes | Complexity |
|-----------|---------|-----------|
| **Produtos.tsx** | Merge category/occasion filters into single filter | Medium |
| **ProductCard.tsx** | Update to show multiple categories | Low |
| **SearchBar.tsx** | Merge category/occasion search | Low |
| **RelatedProducts.tsx** | Update relevance algorithm | Medium |
| **AdminProductForm.tsx** | Change from single select to multi-select | Medium |
| **AdminCategories.tsx** | Merge with AdminOccasions.tsx | High |
| **AdminOccasions.tsx** | Merge with AdminCategories.tsx | High |
| **OccasionsSection.tsx** | Refactor to use merged categories | Medium |
| **Occasions.tsx** | Refactor or remove | Low |

**Total Components Affected**: 9 major components

#### URL Parameter Changes

**Current:**
- `?categoria=sabonetes`
- `?ocasiao=casamento`
- Can combine: `?categoria=sabonetes&ocasiao=casamento`

**After Merge (Option A):**
- `?categoria=sabonetes&categoria=casamento` (multi-select)
- OR `?categorias=sabonetes,casamento` (comma-separated)
- Requires URL parameter strategy decision

---

### 3.3 Admin Panel Impact

#### Current State
- **AdminCategories.tsx**: ~150 lines, CRUD for categories
- **AdminOccasions.tsx**: ~150 lines, CRUD for occasions
- **AdminProductForm.tsx**: Category single-select + Occasion multi-select

#### After Merge (Option A)
- **AdminCategories.tsx**: ~250+ lines, CRUD for unified taxonomy
- **AdminOccasions.tsx**: Can be removed or repurposed
- **AdminProductForm.tsx**: Multi-select for all categories/occasions
- **UI Consideration**: Need visual distinction between product types and use cases

---

### 3.4 SEO & Marketing Impact

#### Current Landing Pages
- `/lembrancinhas-maternidade` (occasion-based)
- `/lembrancinhas-casamento` (occasion-based)
- `/lembrancinhas-aniversario` (occasion-based)
- etc.

#### After Merge (Option A)
- **Decision Needed**: Keep occasion-specific URLs or consolidate?
- **301 Redirects**: Required if URLs change
- **Canonical Tags**: May need adjustment
- **Structured Data**: Schema.org category/occasion markup may need updates

---

### 3.5 Data Integrity Considerations

#### Current Constraints
- Categories: `UNIQUE(name)`, `UNIQUE(slug)`
- Occasions: `UNIQUE(name)`, `UNIQUE(slug)`
- No cross-table uniqueness constraints

#### After Merge (Option A)
- **Conflict Risk**: "Sabonetes" exists as both category and occasion
- **Solution**: Prefix naming (e.g., "Tipo: Sabonetes" vs "Ocasião: Sabonetes")
- **OR**: Add `type` column to distinguish (product_type vs use_case)

---

## 4. STRATEGIC OPTIONS

### Option 1: Full Merge (Many-to-Many)
**Pros:**
- Single unified taxonomy
- Simpler admin interface
- Reduced database complexity
- All products can have multiple "categories"

**Cons:**
- Loss of semantic distinction
- Extensive refactoring required
- Risk of data loss during migration
- Requires careful naming strategy to avoid conflicts
- SEO impact on occasion-specific landing pages

**Effort**: High (2-3 weeks)  
**Risk**: High  
**Recommendation**: ❌ Not recommended without strong business case

---

### Option 2: Keep Separate, Enhance Both
**Pros:**
- Preserves semantic distinction
- Minimal code changes
- Backward compatible
- Can add shared features independently
- Lower risk

**Cons:**
- Maintains two separate admin interfaces
- Slightly more complex filtering logic
- Duplicate code patterns

**Possible Enhancements:**
- Add description/image fields to both tables
- Create unified admin dashboard showing both
- Add category-occasion cross-linking
- Improve filtering UI to show both taxonomies clearly

**Effort**: Low (1-2 weeks)  
**Risk**: Low  
**Recommendation**: ✅ Recommended for current state

---

### Option 3: Hybrid Approach
**Concept:**
- Keep categories as primary taxonomy (product type)
- Convert occasions to "tags" or "attributes"
- Add optional category-occasion mapping table
- Maintain backward compatibility

**Pros:**
- Preserves semantic distinction
- Allows flexible relationships
- Easier migration path
- Can be done incrementally

**Cons:**
- Introduces third taxonomy (tags already exist)
- More complex data model
- Requires careful design

**Effort**: Medium (2-3 weeks)  
**Risk**: Medium  
**Recommendation**: ⚠️ Consider if business needs more flexibility

---

## 5. DETAILED MERGE PLAN (If Option 1 Chosen)

### Phase 1: Preparation (1 week)
- [ ] Create database backup
- [ ] Document all current category/occasion assignments
- [ ] Create test environment with production data copy
- [ ] Design naming strategy to avoid conflicts
- [ ] Create migration scripts and test them

### Phase 2: Database Migration (1 day)
- [ ] Execute migration scripts in test environment
- [ ] Verify data integrity
- [ ] Execute in production with backup ready
- [ ] Verify all relationships intact

### Phase 3: Backend Updates (3-4 days)
- [ ] Update Supabase types (types.ts)
- [ ] Update hooks (useProducts.ts)
- [ ] Update queries to use new junction table
- [ ] Test all data fetching

### Phase 4: Frontend Refactoring (5-7 days)
- [ ] Update Produtos.tsx filtering logic
- [ ] Update ProductCard.tsx display
- [ ] Update SearchBar.tsx
- [ ] Update RelatedProducts.tsx algorithm
- [ ] Update AdminProductForm.tsx
- [ ] Merge AdminCategories.tsx and AdminOccasions.tsx
- [ ] Update OccasionsSection.tsx
- [ ] Test all components

### Phase 5: Testing & QA (3-4 days)
- [ ] Unit tests for hooks
- [ ] Integration tests for filtering
- [ ] E2E tests for admin panel
- [ ] Manual testing across all pages
- [ ] SEO validation

### Phase 6: Deployment (1 day)
- [ ] Deploy to staging
- [ ] Final QA
- [ ] Deploy to production
- [ ] Monitor for issues

**Total Effort**: 2-3 weeks  
**Team Size**: 1-2 developers

---

## 6. IMPLEMENTATION CHECKLIST (If Option 1 Chosen)

### Database Changes
- [ ] Create `product_categories` junction table
- [ ] Migrate `products.category_id` to junction table
- [ ] Migrate `occasions` data to `categories`
- [ ] Migrate `product_occasions` to `product_categories`
- [ ] Drop old tables and columns
- [ ] Update Supabase types

### Backend Changes
- [ ] Update `useDbProducts()` query
- [ ] Update `useDbProduct(slug)` query
- [ ] Update `useDbCategories()` to include occasions
- [ ] Remove `useDbOccasions()` or repurpose
- [ ] Update all CRUD hooks
- [ ] Update data types (DbProduct, DbCategory, etc.)

### Frontend Changes
- [ ] Update Produtos.tsx filtering
- [ ] Update ProductCard.tsx
- [ ] Update SearchBar.tsx
- [ ] Update RelatedProducts.tsx
- [ ] Update AdminProductForm.tsx
- [ ] Merge admin components
- [ ] Update OccasionsSection.tsx
- [ ] Update Occasions.tsx or remove
- [ ] Update all imports and references

### Testing
- [ ] Unit tests for hooks
- [ ] Component tests for filtering
- [ ] E2E tests for user flows
- [ ] Admin panel tests
- [ ] SEO validation

### Documentation
- [ ] Update README
- [ ] Update tech.md steering file
- [ ] Document new data model
- [ ] Update API documentation

---

## 7. RISK ASSESSMENT

### High Risk Items
1. **Data Loss**: Migration could lose relationships if not executed carefully
   - Mitigation: Backup, test in staging, verify counts before/after

2. **Semantic Loss**: Merging loses distinction between product type and use case
   - Mitigation: Add `type` column or use naming convention

3. **SEO Impact**: Occasion-specific landing pages may be affected
   - Mitigation: Plan URL strategy, implement 301 redirects

4. **User Confusion**: Admin users may not understand merged taxonomy
   - Mitigation: Clear UI labeling, documentation, training

### Medium Risk Items
1. **Performance**: Larger junction table may impact query performance
   - Mitigation: Add indexes, monitor query performance

2. **Backward Compatibility**: API changes may break integrations
   - Mitigation: Version API, provide migration guide

3. **Testing Coverage**: Extensive refactoring requires thorough testing
   - Mitigation: Increase test coverage, manual QA

---

## 8. RECOMMENDATIONS

### Current Recommendation: **Option 2 - Keep Separate, Enhance Both**

**Rationale:**
1. **Semantic Correctness**: Categories and occasions serve different purposes
2. **Lower Risk**: Minimal changes, easier to test and deploy
3. **Flexibility**: Can add features independently
4. **User Experience**: Clear distinction helps users understand product organization
5. **SEO**: Preserves occasion-specific landing pages and marketing strategy

### If Business Requires Merge: **Option 1 - Full Merge**

**Prerequisites:**
1. Clear business case for consolidation
2. Dedicated 2-3 week development window
3. Comprehensive testing plan
4. Stakeholder alignment on naming strategy
5. SEO strategy for URL changes

---

## 9. NEXT STEPS

### To Proceed with Audit Findings:
1. Review this plan with stakeholders
2. Decide between Option 1, 2, or 3
3. If Option 1: Create detailed project plan and timeline
4. If Option 2: Identify specific enhancements needed
5. If Option 3: Design hybrid data model

### Questions for Stakeholder:
1. What is the business driver for merging?
2. How should products be categorized after merge?
3. Should occasion-specific landing pages be maintained?
4. What is the timeline for implementation?
5. Are there any integrations that depend on current structure?

---

## 10. APPENDIX: FILE REFERENCES

### Files Affected by Merge
- `src/hooks/useProducts.ts` - Data fetching hooks
- `src/pages/Produtos.tsx` - Product listing and filtering
- `src/pages/admin/AdminProductForm.tsx` - Product creation/editing
- `src/pages/admin/AdminCategories.tsx` - Category management
- `src/pages/admin/AdminOccasions.tsx` - Occasion management
- `src/components/ProductCard.tsx` - Product display
- `src/components/SearchBar.tsx` - Search functionality
- `src/components/RelatedProducts.tsx` - Related products logic
- `src/components/OccasionsSection.tsx` - Occasions display
- `src/components/Occasions.tsx` - Static occasions component
- `src/integrations/supabase/types.ts` - Database types

### Database Tables Affected
- `categories` - Product type classification
- `occasions` - Event/use-case classification
- `products` - Main product table
- `product_occasions` - Many-to-many junction table

---

**Document Status**: Ready for Review  
**Last Updated**: May 15, 2026  
**Prepared By**: Kiro AI Assistant
