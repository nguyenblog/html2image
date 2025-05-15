const fs = require('fs');
const puppeteer = require('puppeteer');

/**
 * Convert HTML content to PDF file
 * @param {string} htmlPath - Path to HTML file
 * @param {string} pdfPath - Output PDF file path
 */
async function htmlToPdf(htmlPath, pdfPath) {
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        let html;
        try {
            html = fs.readFileSync(htmlPath, 'utf8');
        } catch (err) {
            console.error(`Không thể đọc file HTML: ${htmlPath}`);
            throw err;
        }
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.pdf({ path: pdfPath, format: 'A4' });
        console.log(`PDF created at: ${pdfPath}`);
    } finally {
        await browser.close();
    }
}

// Example usage:
// node index.js input.html output.pdf
if (require.main === module) {
    const [,, htmlPath, pdfPath] = process.argv;
    if (!htmlPath || !pdfPath) {
        console.error('Usage: node index.js <input.html> <output.pdf>');
        process.exit(1);
    }
    htmlToPdf(htmlPath, pdfPath).catch(err => {
        console.error('Failed to convert HTML to PDF:', err);
        process.exit(1);
    });
}
