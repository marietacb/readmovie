import Link from "next/link";
import { BookOpen, Film, Tv, Search, BarChart3, Star, Library, Target, Quote } from "lucide-react";
import { BookshelfHero } from "@/components/layout/BookshelfHero";
import { LandingHeader } from "@/components/layout/LandingHeader";

const FEATURES = [
  { icon: Target, title: "Meta de lectura", description: "Define tu objetivo anual y sigue tu progreso con un indicador visual." },
  { icon: Library, title: "Mi estantería", description: "Baldas de Leyendo ahora, Terminados, Deseos y Abandonados — como BookJournal." },
  { icon: BarChart3, title: "Estadísticas", description: "Géneros, formatos, valoraciones y gráfico mensual de tus hábitos." },
  { icon: Quote, title: "Diario personal", description: "Tus opiniones, personajes favoritos y citas de películas y series en un solo lugar." },
  { icon: Search, title: "Búsqueda visual", description: "Encuentra cualquier lectura por título, autor o género al instante." },
  { icon: Star, title: "Reseñas completas", description: "Valoraciones, romance, emoción, tipo de historia y opinión detallada." },
];

export default function HomePage() {
  return (
    <div className="bj-app-bg min-h-dvh">
      <LandingHeader />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-bj-terracotta">
              Tu rincón de lectura
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-bj-navy md:text-5xl lg:text-6xl">
              Registra tus{" "}
              <span className="bg-gradient-to-r from-bj-terracotta to-bj-navy bg-clip-text text-transparent">
                lecturas
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-bj-muted md:text-lg">
              Documenta tu experiencia lectora, organiza tu estantería virtual,
              analiza tus hábitos y lleva un diario de cine y series — inspirado en los
              mejores trackers como BookJournal y Nightstand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/books" className="bj-btn-primary">Empezar gratis</Link>
              <Link href="/movies" className="bj-btn-secondary">Diario de cine</Link>
              <Link href="/series" className="bj-btn-secondary">Diario de series</Link>
            </div>
          </div>
          <BookshelfHero />
        </div>
      </section>

      <section className="border-y border-bj-border bg-white/60 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-3 text-center font-serif text-2xl font-bold text-bj-navy md:text-3xl">
            Paneles diseñados para lectores
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-sm text-bj-muted">
            Cada sección está pensada como los diarios de lectura más populares
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bj-panel group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-bj-navy/10 to-bj-terracotta/10 transition-colors group-hover:from-bj-navy/15 group-hover:to-bj-terracotta/15">
                  <feature.icon className="h-5 w-5 text-bj-navy" />
                </div>
                <h3 className="mb-2 font-semibold text-bj-navy">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-bj-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/books" className="bj-panel group overflow-hidden p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-1 h-1 w-12 rounded-full bg-bj-terracotta" />
              <BookOpen className="mb-4 h-8 w-8 text-bj-navy" />
              <h3 className="font-serif text-2xl font-bold text-bj-navy">Lecturas</h3>
              <p className="mt-2 text-sm text-bj-muted">Panel, estantería, estadísticas, diario y reseñas.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-bj-terracotta group-hover:underline">
                Abrir diario de lecturas →
              </span>
            </Link>
            <Link href="/movies" className="bj-panel group overflow-hidden p-8 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-1 h-1 w-12 rounded-full bg-bj-navy" />
              <Film className="mb-4 h-8 w-8 text-bj-navy" />
              <h3 className="font-serif text-2xl font-bold text-bj-navy">Cine</h3>
              <p className="mt-2 text-sm text-bj-muted">Colección, reseñas con estrellas, momentos y citas.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-bj-terracotta group-hover:underline">
                Abrir diario de cine →
              </span>
            </Link>
            <Link href="/series" className="bj-panel group overflow-hidden p-8 transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-2 lg:col-span-1">
              <div className="mb-1 h-1 w-12 rounded-full bg-bj-terracotta/70" />
              <Tv className="mb-4 h-8 w-8 text-bj-navy" />
              <h3 className="font-serif text-2xl font-bold text-bj-navy">Series</h3>
              <p className="mt-2 text-sm text-bj-muted">Temporadas, episodios, plataforma, progreso y reseñas.</p>
              <span className="mt-5 inline-block text-sm font-semibold text-bj-terracotta group-hover:underline">
                Abrir diario de series →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-bj-border py-8 text-center text-xs text-bj-muted">
        Diario.com — Inspirado en BookJournal, Nightstand y CozyShelf
      </footer>
    </div>
  );
}
