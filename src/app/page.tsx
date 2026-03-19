import { movieService } from '@/lib/api/movie-service';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';

export default async function Home() {
  const trendingMovies = await movieService.getTrending();
  const seriesMovies = await movieService.getByCategory('type', 'phim-bo');
  const singleMovies = await movieService.getByCategory('type', 'phim-le');
  const cartoonMovies = await movieService.getByCategory('type', 'hoat-hinh');

  // Use the first movie as hero to ensure hydration stability
  const heroMovie = trendingMovies.items[0];
  console.log({ heroMovie })
  return (
    <main className="relative bg-[#141414]">
      <Navbar />

      <div className="relative pb-24 lg:space-y-24">
        <HeroBanner movie={heroMovie} />

        <section className="flex flex-col gap-y-10">
          <MovieRow title="Phim Mới Cập Nhật" movies={trendingMovies.items} />
          <MovieRow title="Phim Bộ" movies={seriesMovies.items} />
          <MovieRow title="Phim Lẻ" movies={singleMovies.items} />
          <MovieRow title="Phim Hoạt Hình" movies={cartoonMovies.items} />
        </section>
      </div>

      <footer className="mt-20 py-10 text-center text-gray-500 text-sm">
        <p>© 2024 NetCaChill - Clone Netflix with Love</p>
      </footer>
    </main>
  );
}
