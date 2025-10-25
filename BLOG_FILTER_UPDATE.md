# Blog Filter Update - Main Category Shows All Subcategories

## 📋 Summary

Updated the blog filtering logic so that when a user clicks on a main category (Skincare or Makeup), it displays all blog posts from that category's subcategories.

## 🔄 Changes Made

### Frontend (`client/src/pages/Blog.jsx`)

**Before:**
- Clicking on a category filtered blogs by exact category match only

**After:**
- Clicking on a **main category** (e.g., "Skincare") displays blogs from ALL subcategories (Chăm sóc da, Điều trị da, Review & So sánh sản phẩm)
- Clicking on a **subcategory** (e.g., "Chăm sóc da") displays only blogs from that specific subcategory

## 🎯 How It Works

1. **Main Category Detection:**
   ```javascript
   const isMainCategory = selectedCat && selectedCat.parent === categoryName
   ```
   - Checks if the selected category is a main category (self-referencing parent)

2. **Subcategory Collection:**
   ```javascript
   const subcategories = categories.filter(c => c.parent === categoryName)
   const subcategoryNames = subcategories.map(sub => sub.name)
   ```
   - Gets all subcategories that belong to the main category

3. **Blog Filtering:**
   ```javascript
   if (isMainCategory) {
     // Filter blogs from all subcategories
     filtered = blogs.filter(blog => subcategoryNames.includes(blog.category))
   } else {
     // Filter blogs from specific subcategory
     filtered = blogs.filter(blog => blog.category === categoryName)
   }
   ```

## 📊 Category Structure

### Skincare (Main Category)
- **Chăm sóc da** (Subcategory)
- **Điều trị da** (Subcategory)
- **Review & So sánh sản phẩm** (Subcategory)

### Makeup (Main Category)
- **Makeup 101 (nền tảng)** (Subcategory)
- **Eyes Makeup** (Subcategory)
- **Face Makeup** (Subcategory)
- **Lip Makeup** (Subcategory)
- **Makeup Tips** (Subcategory)

## ✅ User Experience

1. User clicks **"Skincare"** → Sees all blogs from all Skincare subcategories
2. User clicks **"Chăm sóc da"** → Sees only blogs from "Chăm sóc da" subcategory
3. User clicks **"Tất cả"** → Sees all blogs

## 🚀 Testing

To test the changes:
1. Open the blog page
2. Click on "Skincare" in the left menu
3. Verify that blogs from all Skincare subcategories are displayed
4. Click on "Makeup" 
5. Verify that blogs from all Makeup subcategories are displayed
6. Click on any subcategory (e.g., "Eyes Makeup")
7. Verify that only blogs from that subcategory are displayed
