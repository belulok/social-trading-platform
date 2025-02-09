import React, { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  link: string;
  snippet: string;
  source: string;
  date: string;
  image?: string;
  isDummy?: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface StockNewsProps {
  stockName: string;
}

const API_KEY = '83eb26e9361b455f9c556f9ce78bf0ab';

const StockNews = ({ stockName }: StockNewsProps) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get news from the last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?` +
        `q=${stockName}` +
        `&from=${fromDate}` +
        `&language=en` +
        `&sortBy=publishedAt` +
        `&apiKey=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();

      if (data.status === 'ok' && Array.isArray(data.articles)) {
        const processedNews = data.articles.map((item: any) => ({
          title: item.title,
          snippet: item.description || '',
          link: item.url,
          source: item.source.name || 'Unknown Source',
          date: new Date(item.publishedAt).toLocaleDateString(),
          image: item.urlToImage,
          isDummy: false,
          sentiment: analyzeSentiment(item.title + ' ' + (item.description || ''))
        }));
        setNewsItems(processedNews);
      } else {
        throw new Error(data.message || 'Invalid data format received from the API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['up', 'rise', 'gain', 'growth', 'profit', 'success', 'positive', 'surge', 'rally', 'boost', 'strong', 'bullish'];
    const negativeWords = ['down', 'fall', 'loss', 'decline', 'drop', 'negative', 'weak', 'bearish', 'crash', 'risk', 'concern'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  useEffect(() => {
    if (stockName) {
      fetchNews();
    }
  }, [stockName]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-gray-400 mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4 text-gray-400">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-blue-500 rounded-full mb-2" />
          <p>Loading news...</p>
        </div>
      ) : newsItems.length > 0 ? (
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index} className="border-b border-gray-700 last:border-0 pb-4">
              <div className="flex gap-4">
                {item.image && (
                  <div className="flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg bg-gray-800"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block group flex-1"
                    >
                      <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </a>
                    <div className={`px-3 py-1 rounded-full text-sm ml-4 ${
                      item.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                      item.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.sentiment}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {item.snippet}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">{item.source}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-400">
          No news found for {stockName}
        </div>
      )}
    </div>
  );
};

export default StockNews;
