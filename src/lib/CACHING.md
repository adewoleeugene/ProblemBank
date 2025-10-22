# Airtable Caching Implementation

This document explains the caching strategy implemented for Airtable API calls to improve performance and reduce API rate limits.

## Overview

The caching implementation uses Next.js built-in caching with revalidation and browser cache headers to optimize data fetching from Airtable.

## Cache Strategy

### 1. Next.js Cache with Revalidation

All Airtable API calls now use Next.js caching with different revalidation times:

- **Featured Ideas**: 5 minutes (`revalidate: 300`)
- **Ideas Page**: 5 minutes (`revalidate: 300`)
- **Individual Ideas**: 10 minutes (`revalidate: 600`)
- **Categories**: 15 minutes (`revalidate: 900`)
- **Tech Stacks**: 5 minutes (`revalidate: 300`)
- **Tech Categories**: 15 minutes (`revalidate: 900`)

### 2. Browser Cache Headers

API routes include cache headers for browser and CDN caching:

- **Ideas & Tech Stacks**: 5 minutes cache with stale-while-revalidate
- **Categories**: 15 minutes cache with stale-while-revalidate

### 3. Cache Tags

Each cache entry is tagged for targeted invalidation:

- `featured-ideas`
- `ideas-page`
- `idea-by-title`
- `categories`
- `tech-stacks`
- `tech-categories`

## Cache Management

### API Endpoints

- `GET /api/cache` - Get cache information
- `POST /api/cache` - Invalidate caches

### Cache Actions

```javascript
// Invalidate all caches
POST /api/cache
{
  "action": "invalidate-all"
}

// Invalidate ideas caches
POST /api/cache
{
  "action": "invalidate-ideas"
}

// Invalidate tech stack caches
POST /api/cache
{
  "action": "invalidate-tech-stacks"
}

// Invalidate specific tags
POST /api/cache
{
  "action": "invalidate-tags",
  "tags": ["featured-ideas", "tech-stacks"]
}
```

### Cache Monitor Component

Use the `CacheMonitor` component for debugging and cache management:

```tsx
import CacheMonitor from '@/components/CacheMonitor';

<CacheMonitor className="my-4" />
```

## Benefits

1. **Reduced API Calls**: Cached responses reduce Airtable API usage
2. **Faster Load Times**: Cached data loads instantly
3. **Better UX**: Stale-while-revalidate ensures smooth user experience
4. **Rate Limit Protection**: Fewer API calls prevent hitting rate limits
5. **Cost Optimization**: Reduced API usage saves on Airtable costs

## Cache Invalidation

Caches are automatically invalidated based on revalidation times. Manual invalidation is available through:

1. API endpoints for programmatic control
2. Cache monitor component for debugging
3. Cache utility functions for custom implementations

## Monitoring

The cache system includes monitoring capabilities:

- Cache hit/miss tracking
- Revalidation status
- Cache tag management
- Performance metrics

## Best Practices

1. **Use appropriate revalidation times** based on data update frequency
2. **Monitor cache performance** using the cache monitor
3. **Invalidate caches** when data is updated in Airtable
4. **Test cache behavior** in development and staging environments
5. **Set up monitoring** for cache hit rates and performance

## Troubleshooting

### Cache Not Updating

1. Check revalidation times
2. Manually invalidate caches using the API
3. Verify cache tags are correct
4. Check for stale data in browser cache

### Performance Issues

1. Monitor cache hit rates
2. Adjust revalidation times
3. Check for cache invalidation frequency
4. Verify CDN cache headers

### Debug Mode

Enable debug logging by setting environment variables:

```bash
NEXT_PUBLIC_DEBUG_CACHE=true
```

This will log cache operations to the console for debugging.







