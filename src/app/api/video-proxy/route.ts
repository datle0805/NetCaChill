import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const fetchWithRetry = async (targetUrl: string, retryCount = 0): Promise<Response> => {
            const urlObj = new URL(targetUrl);

            // Domain fallback logic removed as per user request
            let currentUrl = targetUrl;

            const referers = [
                'https://phimapi.com/',
                'https://phimimg.com/',
                new URL(currentUrl).origin + '/',
                'https://embed.streamc.xyz/',
                'https://daily.zoon.me/'
            ];

            try {
                console.log(`[Proxy] Fetching: ${currentUrl} (Retry: ${retryCount})`);
                const res = await fetch(currentUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                        'Referer': referers[retryCount % referers.length],
                        'Origin': new URL(currentUrl).origin,
                        'Accept': '*/*',
                        'Connection': 'keep-alive',
                    },
                    signal: AbortSignal.timeout(15000)
                });

                // If we get an error status but the fetch itself succeeded
                if (!res.ok && retryCount < 2) {
                    console.warn(`[Proxy] Remote returned ${res.status}, retrying...`);
                    return fetchWithRetry(targetUrl, retryCount + 1);
                }

                return res;
            } catch (err: any) {
                console.error(`[Proxy] Error fetching ${currentUrl}: ${err.message}`);

                // If it's a DNS error or connection error, retry immediately with potential domain swap
                if (retryCount < 3) {
                    const nextRetry = retryCount + 1;
                    return fetchWithRetry(targetUrl, nextRetry);
                }
                throw err;
            }
        };

        const response = await fetchWithRetry(url);

        if (!response.ok) {
            return new NextResponse(`Remote server error: ${response.status} ${response.statusText}`, {
                status: response.status,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }

        const contentType = response.headers.get('content-type') || '';

        // Handle HLS Playlists
        if (contentType.includes('mpegurl') || url.toLowerCase().includes('.m3u8')) {
            let text = await response.text();
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

            // Basic HLS rewriting logic
            const lines = text.split('\n');
            const proxiedLines = lines.map(line => {
                line = line.trim();
                if (line === '' || line.startsWith('#')) return line;

                let absoluteUrl = line;
                try {
                    if (!line.startsWith('http')) {
                        absoluteUrl = new URL(line, baseUrl).href;
                    }
                } catch (e) {
                    return line;
                }

                return `/api/video-proxy?url=${encodeURIComponent(absoluteUrl)}`;
            });

            return new NextResponse(proxiedLines.join('\n'), {
                headers: {
                    'Content-Type': 'application/vnd.apple.mpegurl',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache',
                    'X-Proxied-By': 'NetCaChill-Premium'
                },
            });
        }

        // For TS segments or other files, stream the body
        // We use a ReadableStream for better efficiency with large segments
        const { body } = response;
        if (!body) throw new Error('Response body is null');

        return new NextResponse(body, {
            headers: {
                'Content-Type': contentType || 'video/mp2t',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600',
                'X-Proxied-By': 'NetCaChill-Premium'
            }
        });

    } catch (error: any) {
        console.error(`[Proxy Critical] ${error.message}`);
        return new NextResponse(`Proxy error: ${error.message}`, {
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}
