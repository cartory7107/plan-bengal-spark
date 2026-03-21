import { useState } from "react";
import { Search, Globe, Loader2, ExternalLink } from "lucide-react";
import { firecrawlApi } from "@/lib/api/firecrawl";
import { t } from "@/lib/translations";

interface TravelInsight {
  url: string;
  title: string;
  description: string;
}

interface TravelInsightsProps {
  destination: string;
  language?: string;
}

const TravelInsights = ({ destination, language = "English" }: TravelInsightsProps) => {
  const [insights, setInsights] = useState<TravelInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await firecrawlApi.search(
        `best travel tips ${destination} tourist guide things to do`,
        { limit: 6 }
      );

      if (!response.success) {
        throw new Error(response.error || "Search failed");
      }

      const results: TravelInsight[] = (response.data || []).map((item: any) => ({
        url: item.url || "",
        title: item.title || item.metadata?.title || "Travel Guide",
        description: item.description || item.metadata?.description || "",
      }));

      setInsights(results);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to fetch travel insights:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-foreground">
          <Globe className="w-5 h-5 text-primary" />
          {t(language, "travelInsights")}
        </h3>
        {!loaded && (
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? t(language, "searching") : t(language, "searchInsights")}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {loaded && insights.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {insights.map((insight, i) => (
            <a
              key={i}
              href={insight.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-xl p-4 space-y-2 transition-all duration-200 hover:shadow-md group"
            >
              <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {insight.title}
              </h4>
              {insight.description && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {insight.description}
                </p>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <ExternalLink className="w-3 h-3" />
                Read more
              </span>
            </a>
          ))}
        </div>
      )}

      {loaded && insights.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No travel insights found for "{destination}".
        </p>
      )}
    </div>
  );
};

export default TravelInsights;
