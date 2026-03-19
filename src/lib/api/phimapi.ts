import { Movie, MovieDetail, PaginatedResult } from '@/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_PHIMAPI_URL || 'https://phimapi.com';

export const phimapiApi = {
    async getLatestMovies(page = 1): Promise<PaginatedResult<Movie>> {
        const res = await fetch(`${BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`);
        if (!res.ok) throw new Error('PhimAPI fetch failed');
        const data = await res.json();
        return {
            items: data.items.map((item: any) => ({
                ...item,
                thumb_url: item.thumb_url.startsWith('http') ? item.thumb_url : `https://phimimg.com/${item.thumb_url}`,
                poster_url: item.poster_url.startsWith('http') ? item.poster_url : `https://phimimg.com/${item.poster_url}`
            })),
            paginate: {
                current_page: data.pagination.currentPage,
                total_page: Math.ceil(data.pagination.totalItems / data.pagination.totalItemsPerPage),
                total_items: data.pagination.totalItems,
                items_per_page: data.pagination.totalItemsPerPage
            }
        };
    },

    async getMovieDetails(slug: string): Promise<MovieDetail> {
        const res = await fetch(`${BASE_URL}/phim/${slug}`);
        if (!res.ok) throw new Error('PhimAPI detail fetch failed');
        const data = await res.json();

        const movie = data.movie;
        return {
            ...movie,
            thumb_url: movie.thumb_url.startsWith('http') ? movie.thumb_url : `https://phimimg.com/${movie.thumb_url}`,
            poster_url: movie.poster_url.startsWith('http') ? movie.poster_url : `https://phimimg.com/${movie.poster_url}`,
            episodes: (data.episodes || []).map((srv: any) => ({
                server_name: srv.server_name,
                items: (srv.server_data || []).map((ep: any) => ({
                    name: ep.name,
                    slug: ep.slug,
                    embed: ep.link_embed,
                    m3u8: ep.link_m3u8
                }))
            }))
        };
    },

    async searchMovies(keyword: string, page = 1): Promise<PaginatedResult<Movie>> {
        const res = await fetch(`${BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);
        if (!res.ok) throw new Error('PhimAPI search failed');
        const json = await res.json();
        const data = json.data;

        return {
            items: data.items.map((item: any) => ({
                ...item,
                thumb_url: `https://phimimg.com/${item.thumb_url}`,
                poster_url: `https://phimimg.com/${item.poster_url}`
            })),
            paginate: {
                current_page: data.params.pagination.currentPage,
                total_page: Math.ceil(data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage),
                total_items: data.params.pagination.totalItems,
                items_per_page: data.params.pagination.totalItemsPerPage
            }
        };
    },

    async getMoviesByType(type: string, page = 1): Promise<PaginatedResult<Movie>> {
        const res = await fetch(`${BASE_URL}/v1/api/danh-sach/${type}?page=${page}`);
        if (!res.ok) throw new Error(`PhimAPI fetch failed for type ${type}`);
        const json = await res.json();
        const data = json.data;

        return {
            items: data.items.map((item: any) => ({
                ...item,
                thumb_url: `https://phimimg.com/${item.thumb_url}`,
                poster_url: `https://phimimg.com/${item.poster_url}`
            })),
            paginate: {
                current_page: data.params.pagination.currentPage,
                total_page: Math.ceil(data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage),
                total_items: data.params.pagination.totalItems,
                items_per_page: data.params.pagination.totalItemsPerPage
            }
        };
    },

    async getMoviesByGenre(genre: string, page = 1): Promise<PaginatedResult<Movie>> {
        const res = await fetch(`${BASE_URL}/v1/api/the-loai/${genre}?page=${page}`);
        if (!res.ok) throw new Error(`PhimAPI fetch failed for genre ${genre}`);
        const json = await res.json();
        const data = json.data;

        return {
            items: data.items.map((item: any) => ({
                ...item,
                thumb_url: `https://phimimg.com/${item.thumb_url}`,
                poster_url: `https://phimimg.com/${item.poster_url}`
            })),
            paginate: {
                current_page: data.params.pagination.currentPage,
                total_page: Math.ceil(data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage),
                total_items: data.params.pagination.totalItems,
                items_per_page: data.params.pagination.totalItemsPerPage
            }
        };
    },

    async getMoviesByCountry(country: string, page = 1): Promise<PaginatedResult<Movie>> {
        const res = await fetch(`${BASE_URL}/v1/api/quoc-gia/${country}?page=${page}`);
        if (!res.ok) throw new Error(`PhimAPI fetch failed for country ${country}`);
        const json = await res.json();
        const data = json.data;

        return {
            items: data.items.map((item: any) => ({
                ...item,
                thumb_url: `https://phimimg.com/${item.thumb_url}`,
                poster_url: `https://phimimg.com/${item.poster_url}`
            })),
            paginate: {
                current_page: data.params.pagination.currentPage,
                total_page: Math.ceil(data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage),
                total_items: data.params.pagination.totalItems,
                items_per_page: data.params.pagination.totalItemsPerPage
            }
        };
    }
};
