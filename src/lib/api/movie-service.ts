import { phimapiApi } from './phimapi';
import { Movie, MovieDetail, PaginatedResult } from '@/types/movie';

export const movieService = {
    async getTrending(page = 1): Promise<PaginatedResult<Movie>> {
        return await phimapiApi.getLatestMovies(page);
    },

    async getDetails(slug: string): Promise<MovieDetail> {
        return await phimapiApi.getMovieDetails(slug);
    },

    async search(keyword: string, page = 1): Promise<PaginatedResult<Movie>> {
        return await phimapiApi.searchMovies(keyword, page);
    },

    async getByCategory(category: string, value: string, page = 1): Promise<PaginatedResult<Movie>> {
        try {
            switch (category) {
                case 'type':
                    return await phimapiApi.getMoviesByType(value, page);
                case 'genre':
                    return await phimapiApi.getMoviesByGenre(value, page);
                case 'country':
                    return await phimapiApi.getMoviesByCountry(value, page);
                default:
                    return await phimapiApi.getLatestMovies(page);
            }
        } catch (error) {
            console.error(`MovieService Error (getByCategory ${category}):`, error);
            throw error;
        }
    }
};
