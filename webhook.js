const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

/**
 * POST /convert
 * Body: {
 *   html: string (nội dung HTML),
 *   filename?: string (tuỳ chọn, tên file ảnh trả về),
 *   format?: string ('png' hoặc 'jpeg', mặc định 'png')
 * }
 * Trả về file ảnh dạng buffer (download)
 */
app.post('/convert', async (req, res) => {
    const { html, filename, format } = req.body;
    if (!html) {
        return res.status(400).json({ error: 'Thiếu nội dung HTML' });
    }
    const imageFormat = (format === 'jpeg') ? 'jpeg' : 'png';
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const imageBuffer = await page.screenshot({
            type: imageFormat,
            fullPage: true
        });
        const base64 = imageBuffer.toString('base64');
        res.json({
            base64,
            format: imageFormat,
            filename: filename || `output.${imageFormat}`
        });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi chuyển đổi HTML sang ảnh', details: err.message });
    } finally {
        if (browser) await browser.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webhook server listening on port ${PORT}`);
});
