import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-white/5", className)}
            {...props}
        />
    );
}

export function MovieCardSkeleton() {
    return (
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-white/5">
            <Skeleton className="h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 p-2 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function MovieRowSkeleton() {
    return (
        <div className="space-y-4 px-4 py-8 md:px-12">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="min-w-[160px] md:min-w-[240px]">
                        <MovieCardSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}
