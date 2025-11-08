const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mengambil artikel kesehatan dari berbagai sumber
router.get('/health', async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    // Validasi API key
    if (!apiKey) {
      console.error('❌ NEWS_API_KEY tidak ditemukan di .env file');
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'NEWS_API_KEY belum diset di environment variables'
      });
    }

    console.log(' Fetching health articles from NewsAPI...');
    console.log(' API Key exists:', apiKey.substring(0, 10) + '...');

    // Strategy 1: Try Indonesia health news
    let url = `https://newsapi.org/v2/top-headlines?country=id&category=health&pageSize=10&apiKey=${apiKey}`;
    console.log(' Trying Indonesia health news...');
    
    let response = await axios.get(url);
    let articles = response.data.articles || [];

    // Strategy 2: If no results, try general health keyword search
    if (articles.length === 0) {
      console.log('⚠️ No Indonesia articles, trying keyword search...');
      url = `https://newsapi.org/v2/everything?q=kesehatan OR nutrition OR diet&language=id&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
      response = await axios.get(url);
      articles = response.data.articles || [];
    }

    // Strategy 3: If still no results, try English health news
    if (articles.length === 0) {
      console.log('⚠️ No Indonesian articles, trying English health news...');
      url = `https://newsapi.org/v2/top-headlines?category=health&language=en&pageSize=10&apiKey=${apiKey}`;
      response = await axios.get(url);
      articles = response.data.articles || [];
    }

    console.log(`✅ Found ${articles.length} articles`);

    // Format articles
    const formattedArticles = articles
      .filter(article => article.title && article.title !== '[Removed]') // Filter removed articles
      .map(article => ({
        title: article.title,
        description: article.description || 'Tidak ada deskripsi tersedia',
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source.name
      }));

    console.log(`📰 Returning ${formattedArticles.length} formatted articles`);
    res.json(formattedArticles);
    
  } catch (error) {
    console.error('❌ Error fetching articles:', error.message);
    
    // Detailed error logging
    if (error.response) {
      console.error(' NewsAPI Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      
      // Handle specific API errors
      if (error.response.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid API Key',
          message: 'API key tidak valid atau belum diverifikasi. Cek https://newsapi.org'
        });
      }
      
      if (error.response.status === 429) {
        return res.status(429).json({ 
          error: 'Rate Limit Exceeded',
          message: 'Terlalu banyak request. Coba lagi nanti.'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Gagal mengambil artikel kesehatan',
      details: error.message 
    });
  }
});

module.exports = router;