import Link from "next/link";

export function CategoryCard({ name, slug, image }: { name: string; slug: string; image?: string | null }) {
  return (
    <Link
      href={`/kategori/${slug}`}
      className="group relative block aspect-[4/3] rounded-2xl overflow-hidden border border-taupe/50 bg-white"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-300" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-mist to-leaf" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
      <span className="absolute bottom-3 left-3 text-white font-semibold text-sm md:text-base drop-shadow">{name}</span>
    </Link>
  );
}
