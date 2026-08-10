# Chrome Extension Laptop Scraper

A lightweight, high-performance **Manifest V3 Google Chrome Extension** designed to extract detailed laptop specifications, pricing, and URLs from e-commerce catalog pages (such as Ryans Computers and TechLand BD) and export them directly into a clean, Excel-ready CSV spreadsheet.

---

##  Features

* **Comprehensive Extraction:** Scrapes key product details including:
  * Product Name / Title
  * Processor Type & Generation
  * RAM & Storage
  * Graphics Memory & Graphics Chipset
  * Display Size & Color
  * Price & Direct Product URL
* **Smart Parsing:** Automatically cleans up bullet points, raw prefixes, and layout artifacts to ensure data lines up neatly in columns.
* **Duplicate Prevention:** Skips redundant nested layout elements to ensure clean, unique row entries.
* **Instant CSV Export:** Automatically formats and triggers a browser download for seamless analysis in Microsoft Excel or Google Sheets.

---

##  Project Structure

Your extension folder should contain the following files:

```text
chrome-extension-laptop-scraper/
├── manifest.json       # Extension configuration (Manifest V3)
├── popup.html          # Extension popup UI layout
└── popup.js            # Core scraping logic and CSV download handler
