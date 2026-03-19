import { movieService } from '@/lib/api/movie-service';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
    params
}: {
    params: { type: string, slug: string }
}) {
    const { type, slug } = await params;

    // Normalize types: danh-sach -> type, the-loai -> genre, quoc-gia -> country
    let categoryType = '';
    switch (type) {
        case 'danh-sach': categoryType = 'type'; break;
        case 'the-loai': categoryType = 'genre'; break;
        case 'quoc-gia': categoryType = 'country'; break;
        default: return notFound();
    }

    const data = await movieService.getByCategory(categoryType, slug);

    return (
        <main className="relative min-h-screen bg-[#141414]">
            <Navbar />

            <div className="pt-24 px-4 md:px-12">
                <h1 className="mb-8 text-3xl font-bold uppercase border-l-4 border-red-600 pl-4">
                    {slug.replace(/-/g, ' ')}
                </h1>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-20">
                    {data.items.map((movie) => (
                        <MovieCard key={movie.slug} movie={movie} />
                    ))}
                </div>

                {/* Pagination placeholder */}
                <div className="flex justify-center gap-4 mt-8 pb-12">
                    <p className="text-gray-500">Trang {data.paginate.current_page} / {data.paginate.total_page}</p>
                </div>
            </div>
        </main>
    );
}
