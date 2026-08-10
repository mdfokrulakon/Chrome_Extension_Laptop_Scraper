document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const [tabs] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tabs) {
    alert("No active tab found!");
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tabs.id },
    func: extractRyansGuaranteed
  });
});

function extractRyansGuaranteed() {
  const laptops = [];
  
  // Universal selector: Grabs all grid boxes or card containers on Ryans pages
  const allDivs = document.querySelectorAll('div');
  const processedUrls = new Set();

  allDivs.forEach(div => {
    // Check if this container holds a laptop title link and specification text
    const titleLink = div.querySelector('a[href*="-laptop"]');
    const text = div.innerText || "";

    if (titleLink && text.includes("Processor Type") && text.includes("Storage")) {
      const productName = titleLink.innerText.trim();
      const url = titleLink.href;

      // Ensure we process each unique product URL only once
      if (!productName || productName.toLowerCase() === "laptop" || processedUrls.has(url)) {
        return;
      }
      processedUrls.add(url);

      // Extract price safely from the card text
      let price = "N/A";
      const priceMatch = text.match(/Tk\s*[\d,]+/);
      if (priceMatch) {
        price = priceMatch[0];
      }

      // Initialize specifications
      let processor = "N/A";
      let generation = "N/A";
      let ram = "N/A";
      let storage = "N/A";
      let graphicsMemory = "N/A";
      let graphicsChipset = "N/A";
      let displaySize = "N/A";
      let color = "N/A";

      // Parse lines precisely
      const lines = text.split('\n');
      lines.forEach(line => {
        let clean = line.replace(/^[•\-\*]\s*/, '').trim();
        const lower = clean.toLowerCase();

        if (lower.startsWith('processor type')) {
          processor = clean.replace(/^processor type[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('generation')) {
          generation = clean.replace(/^generation[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('ram')) {
          ram = clean.replace(/^ram[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('storage')) {
          storage = clean.replace(/^storage[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('graphics memory')) {
          graphicsMemory = clean.replace(/^graphics memory[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('graphics chipset')) {
          graphicsChipset = clean.replace(/^graphics chipset[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('display size')) {
          displaySize = clean.replace(/^display size(\s*\(inch\))?[:\.\-\s]*/i, '').trim();
        } else if (lower.startsWith('color')) {
          color = clean.replace(/^color[:\.\-\s]*/i, '').trim();
        }
      });

      laptops.push({
        Product: productName,
        Processor: processor,
        Generation: generation,
        RAM: ram,
        Storage: storage,
        GraphicsMemory: graphicsMemory,
        GraphicsChipset: graphicsChipset,
        DisplaySize: displaySize,
        Color: color,
        Price: price,
        URL: url
      });
    }
  });

  if (laptops.length === 0) {
    alert("Error: No laptops found. Make sure you are on the Ryans all-laptop page and the products are loaded!");
    return;
  }

  // Generate CSV format content
  let csvContent = "data:text/csv;charset=utf-8,Product Name,Processor,Generation,RAM,Storage,Graphics Memory,Graphics Chipset,Display Size,Color,Price,URL\n";
  
  laptops.forEach(item => {
    const esc = (val) => `"${(val || "").replace(/"/g, '""')}"`;
    csvContent += `${esc(item.Product)},${esc(item.Processor)},${esc(item.Generation)},${esc(item.RAM)},${esc(item.Storage)},${esc(item.GraphicsMemory)},${esc(item.GraphicsChipset)},${esc(item.DisplaySize)},${esc(item.Color)},${esc(item.Price)},${esc(item.URL)}\n`;
  });

  // Trigger file download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ryans_laptops_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert(`Success! Extracted ${laptops.length} laptops and downloaded your CSV file.`);
}