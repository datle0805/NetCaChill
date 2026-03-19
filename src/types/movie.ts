export interface Movie {
    id: string;
    name: string;
    slug: string;
    original_name: string;
    thumb_url: string;
    poster_url: string;
    description: string;
    total_episodes: number;
    current_episode: string;
    time: string;
    quality: string;
    language: string;
    director: string | null;
    casts: string | null;
    category: Array<{ group: { name: string }; list: Array<{ name: string }> }>;
    country?: Array<{ name: string }>;
    year?: number;
}

export interface Episode {
    server_name: string;
    items: Array<{
        name: string;
        slug: string;
        embed: string;
        m3u8: string;
    }>;
}

export interface MovieDetail extends Movie {
    episodes: Episode[];
}

export interface PaginatedResult<T> {
    items: T[];
    paginate: {
        current_page: number;
        total_page: number;
        total_items: number;
        items_per_page: number;
    };
}
