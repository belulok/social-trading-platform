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

const API_KEY = 'pub_6849375d2a7a25dc82a745e0113ab29c6f150';

const StockNews = ({ stockName }: StockNewsProps) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    if (!stockName) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://newsdata.io/api/1/news?` + 
        new URLSearchParams({
          apikey: API_KEY,
          q: `${stockName} stock market`,
          language: 'en',
          category: 'business',
        })
      );

      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.results?.length > 0) {
        const processedNews = data.results.slice(0, 10).map((item: any) => ({
          title: item.title || 'No Title',
          link: item.link || '#',
          snippet: item.description || 'No description available',
          source: item.source_id || 'Unknown Source',
          date: new Date(item.pubDate).toLocaleDateString(),
          image: item.image_url,
          isDummy: false,
          sentiment: analyzeSentiment(item.title + ' ' + (item.description || ''))
        }));
        setNewsItems(processedNews);
      } else {
        setError('No recent news found.');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to fetch news.');
    } finally {
      setIsLoading(false);
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
      
      {isLoading ? (
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
