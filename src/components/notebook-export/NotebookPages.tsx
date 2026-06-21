import { formatGenres } from "@/lib/genres";
import type { Book } from "@/types";
import type { Month } from "@/types";
import { buildBracketMatches } from "@/lib/bookOfYear";
import {
  formatBookDates,
  formatBookFormatLabel,
  formatRatingDisplay,
  getTrackerSlotColor,
  ratingColor,
  type NotebookExportPayload,
} from "@/lib/notebookExport/buildExportData";
import { getPixelColor } from "@/lib/pixelLegends";
import { MONTH_INITIALS } from "@/lib/yearInPixels";
import { MONTH_NAMES } from "@/lib/constants";
import {
  CoverSvg,
  ExportPage,
  HighlighterLabel,
  MagazineText,
  StarRow,
  Sticker,
  YearTiles,
} from "@/components/notebook-export/NotebookShared";

function CoverPage({ payload }: { payload: NotebookExportPayload }) {
  return (
    <ExportPage variant="dots">
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CoverSvg paths={payload.coverPaths} />
        <div className="nb-cover-year">
          <YearTiles year={payload.year} />
        </div>
        <p className="nb-hand" style={{ marginTop: 24, fontSize: 14, color: "#6b7c93" }}>
          Diario.com — Lecturas
        </p>
      </div>
    </ExportPage>
  );
}

function IntroPage({ payload }: { payload: NotebookExportPayload }) {
  return (
    <ExportPage variant="parchment">
      <div style={{ textAlign: "center" }}>
        <MagazineText text="BOOK JOURNAL" size="lg" />
        <div style={{ margin: "28px 0" }}>
          <Sticker payload={payload} id="introBookshelf" style={{ width: 320, height: 200, margin: "0 auto" }} />
        </div>
        <p className="nb-serif-title" style={{ fontSize: 16, fontStyle: "italic", lineHeight: 1.5, maxWidth: 420, margin: "0 auto" }}>
          &ldquo;{payload.settings.coverQuote}&rdquo;
        </p>
        <div style={{ marginTop: 48 }}>
          <MagazineText text={String(payload.year)} size="md" />
        </div>
      </div>
    </ExportPage>
  );
}

function WishlistPage({ payload }: { payload: NotebookExportPayload }) {
  const mid = Math.ceil(Math.max(payload.wishlist.length, 1) / 2);
  const cols = [payload.wishlist.slice(0, mid), payload.wishlist.slice(mid)];

  return (
    <ExportPage variant="dots">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Sticker payload={payload} id="wishlistRibbon" style={{ width: 150, height: 44 }} />
        <Sticker payload={payload} id="wishlistFlower" style={{ width: 72, height: 72 }} />
      </div>
      <h2 className="nb-hand" style={{ fontSize: 28, marginBottom: 16 }}>Wishlist</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {cols.map((col, ci) => (
          <div key={ci}>
            {col.length === 0 ? (
              <p className="nb-empty nb-typewriter">—</p>
            ) : (
              col.map((item) => (
                <div key={item.id} className="nb-typewriter" style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14 }}>{item.read ? "☑" : "☐"}</span>
                  <span>
                    {item.title}
                    {item.seriesLabel ? ` (${item.seriesLabel})` : ""}
                  </span>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </ExportPage>
  );
}

function YearPixelsPage({ payload }: { payload: NotebookExportPayload }) {
  return (
    <ExportPage variant="dots">
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ width: 150 }}>
          <CoverSvg paths={payload.verticalBarPaths} width={150} height={620} />
          <p className="nb-serif-title" style={{ fontSize: 10, fontStyle: "italic", marginTop: 12, lineHeight: 1.4 }}>
            &ldquo;{payload.settings.coverQuote}&rdquo;
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <MagazineText text="Year in Pixels" size="md" />
          <div style={{ display: "flex", gap: 2, marginTop: 10, marginLeft: 2 }}>
            {MONTH_INITIALS.map((m) => (
              <span key={m} style={{ width: 11, fontSize: 7, textAlign: "center" }}>{m}</span>
            ))}
          </div>
          {payload.pixelGrid.map((row, di) => (
            <div key={di} className="nb-pixel-grid" style={{ marginBottom: 1 }}>
              {row.map((cell) => {
                const color =
                  cell.valid && cell.pages > 0
                    ? getPixelColor(cell.pages, payload.pixelLegend) ?? "#e5e0d8"
                    : undefined;
                return (
                  <div
                    key={`${cell.month}-${cell.day}`}
                    className={cell.valid ? "nb-pixel" : "nb-pixel nb-pixel--invalid"}
                    style={color ? { backgroundColor: color } : undefined}
                  />
                );
              })}
            </div>
          ))}
          <div style={{ marginTop: 12 }}>
            <p className="nb-hand" style={{ fontSize: 14, marginBottom: 6 }}>Pages</p>
            {payload.pixelLegend.map((band) => (
              <div key={band.label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ width: 12, height: 12, backgroundColor: band.color, border: "0.5px solid #ccc" }} />
                <span className="nb-typewriter">{band.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ExportPage>
  );
}

function TrackerOverviewPage({ payload }: { payload: NotebookExportPayload }) {
  const slots = Array.from({ length: payload.readingGoal }, (_, i) => payload.books[i]);

  return (
    <ExportPage variant="dots">
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <p className="nb-hand" style={{ fontSize: 22, marginBottom: 8 }}>book tracker</p>
          <Sticker payload={payload} id="trackerMoon" style={{ width: 36, height: 36, marginBottom: 10 }} />
          <div className="nb-tracker-grid">
            {slots.map((book, i) => (
              <div
                key={i}
                className="nb-tracker-cell"
                style={{ backgroundColor: getTrackerSlotColor(book, i) }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="nb-typewriter" style={{ marginTop: 10, fontWeight: 700 }}>
            GOAL {payload.readingGoal}
          </p>
        </div>
        <div style={{ flex: 1.3 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <MagazineText text="OVERVIEW" size="md" />
            <Sticker payload={payload} id="overviewRose" style={{ width: 44, height: 90 }} />
          </div>
          <table className="nb-table" style={{ marginTop: 12 }}>
            <thead>
              <tr>
                {["", "BOOKS", "PAGES", "CHAPT.", "5★", "EBOOK", "PHYS.", "SER."].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payload.overview.map((row) => (
                <tr key={row.month}>
                  <td>{row.roman}</td>
                  <td>{row.booksFinished || "—"}</td>
                  <td>{row.pagesRead || "—"}</td>
                  <td>{row.chaptersRead || "—"}</td>
                  <td>{row.fiveStars || "—"}</td>
                  <td>{row.ebook || "—"}</td>
                  <td>{row.physical || "—"}</td>
                  <td>{row.series || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ExportPage>
  );
}

function MasterTablePage({ payload }: { payload: NotebookExportPayload }) {
  const rows = Array.from({ length: 20 }, (_, i) => payload.books[i]);

  return (
    <ExportPage variant="dots">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <p className="nb-hand" style={{ fontSize: 20, marginBottom: 8 }}>Title</p>
          <table className="nb-table">
            <thead>
              <tr>
                <th>#</th><th>Title</th><th>Author</th><th>Pg</th><th>Ch</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((book, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  {book ? (
                    <>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.pages ?? "—"}</td>
                      <td>{book.totalChapters ?? "—"}</td>
                    </>
                  ) : (
                    <td colSpan={4} className="nb-empty">—</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <p className="nb-hand" style={{ fontSize: 20, marginBottom: 8 }}>Favourite characters</p>
          <table className="nb-table">
            <thead>
              <tr>
                <th>#</th><th>Characters</th><th>Start</th><th>End</th><th>★</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((book, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  {book ? (
                    <>
                      <td>{book.characters || "—"}</td>
                      <td>{book.startDate?.slice(0, 10).split("-").reverse().join("/") ?? "—"}</td>
                      <td>{book.endDate?.slice(0, 10).split("-").reverse().join("/") ?? "—"}</td>
                      <td>{formatRatingDisplay(book.rating)}</td>
                    </>
                  ) : (
                    <td colSpan={4} className="nb-empty">—</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ExportPage>
  );
}

function FavoritesPage({ payload }: { payload: NotebookExportPayload }) {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1) as Month);

  return (
    <ExportPage variant="dots">
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ width: 200 }}>
          {payload.settings.favoritePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={payload.settings.favoritePhotoUrl}
              alt=""
              style={{ width: 180, height: 240, objectFit: "cover", borderRadius: 4, boxShadow: "2px 4px 12px rgba(0,0,0,0.12)" }}
            />
          ) : (
            <div style={{ width: 180, height: 240, border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="nb-empty">Tu foto</span>
            </div>
          )}
          <p className="nb-hand" style={{ marginTop: 8, fontSize: 16 }}>{payload.settings.favoritePhotoCaption}</p>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <MagazineText text="Favourite BOOKS" size="md" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
            {months.map((month) => {
              const bookId = payload.monthlyFavorites[month];
              const book = bookId ? payload.books.find((b) => b.id === bookId) : undefined;
              return (
                <div key={month} style={{ textAlign: "center" }}>
                  {book?.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.coverUrl} alt="" style={{ width: 56, height: 82, objectFit: "cover", margin: "0 auto" }} />
                  ) : (
                    <div style={{ width: 56, height: 82, backgroundColor: book?.spineColor ?? "#f0ece6", margin: "0 auto", border: "1px solid #ddd" }} />
                  )}
                  <p className="nb-hand" style={{ fontSize: 13, marginTop: 4 }}>{MONTH_NAMES[month]}</p>
                </div>
              );
            })}
          </div>
          <Sticker payload={payload} id="favoritesTrophy" style={{ position: "absolute", right: 0, bottom: 0, width: 56, height: 56 }} />
        </div>
      </div>
    </ExportPage>
  );
}

function BookOfYearPage({ payload }: { payload: NotebookExportPayload }) {
  const matches = buildBracketMatches(payload.monthlyFavorites, payload.bracket);
  const r1 = matches.filter((m) => m.round === "r1");
  const winner = payload.bookOfYearId
    ? payload.books.find((b) => b.id === payload.bookOfYearId)
    : undefined;

  return (
    <ExportPage variant="dots">
      <Sticker payload={payload} id="vineLeaves" style={{ width: "100%", height: 32, marginBottom: 8 }} />
      <p className="nb-hand" style={{ fontSize: 24, textAlign: "center", marginBottom: 16 }}>my book of the year</p>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ width: 160 }}>
          {r1.map((match) => (
            <div key={match.id} style={{ marginBottom: 8 }}>
              <p className="nb-typewriter" style={{ fontSize: 8, color: "#888" }}>{match.leftLabel.slice(0, 12)}</p>
              <div className="nb-typewriter" style={{ border: "1px solid #bbb", padding: 3, fontSize: 8, marginBottom: 2 }}>{match.leftLabel}</div>
              <div className="nb-typewriter" style={{ border: "1px solid #bbb", padding: 3, fontSize: 8 }}>{match.rightLabel}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          {winner?.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={winner.coverUrl} alt="" style={{ width: 90, height: 130, objectFit: "cover", margin: "0 auto" }} />
          ) : (
            <div style={{ width: 90, height: 130, border: "1px solid #999", margin: "0 auto" }} />
          )}
          <p className="nb-serif-title" style={{ fontSize: 11, marginTop: 8 }}>{winner?.title ?? "Ganador pendiente"}</p>
        </div>
        <div style={{ width: 90, textAlign: "center" }}>
          <Sticker payload={payload} id="bookOfYearCrown" style={{ width: 56, height: 44, margin: "0 auto" }} />
          <Sticker payload={payload} id="bookOfYearMedals" style={{ width: 72, height: 32, marginTop: 12 }} />
        </div>
      </div>
    </ExportPage>
  );
}

function ScrapbookEntry({ book, index }: { book: Book; index: number }) {
  const reverse = index % 2 === 1;
  const cover = (
    <div className="nb-cover-thumb">
      {book.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={book.coverUrl} alt="" />
      ) : (
        <div className="nb-cover-thumb__placeholder" style={{ backgroundColor: book.spineColor }} />
      )}
      <StarRow rating={book.rating} />
    </div>
  );
  const fields = (
    <div style={{ flex: 1 }}>
      {[
        ["Book", book.title],
        ["Author", book.author],
        ["Format", formatBookFormatLabel(book.format)],
        ["Genre", formatGenres(book.genres)],
        ["Nationality", book.originalNationality ?? ""],
        ["Pages", book.pages?.toString() ?? ""],
        ["Dates", formatBookDates(book)],
      ].map(([label, val]) =>
        val ? (
          <div key={label} style={{ marginBottom: 4 }}>
            <HighlighterLabel>{label}</HighlighterLabel>
            <div className="nb-value">{val}</div>
          </div>
        ) : null,
      )}
    </div>
  );

  return (
    <div className={`nb-scrapbook-entry${reverse ? " nb-scrapbook-entry--reverse" : ""}`}>
      {cover}
      {fields}
    </div>
  );
}

function ScrapbookPages({ payload }: { payload: NotebookExportPayload }) {
  const perPage = 8;
  const pageCount = Math.max(1, Math.ceil(payload.books.length / perPage));

  return (
    <>
      {Array.from({ length: pageCount }).map((_, pi) => {
        const slice = payload.books.slice(pi * perPage, pi * perPage + perPage);
        const left = slice.slice(0, 4);
        const right = slice.slice(4);
        return (
          <ExportPage key={pi} variant="dots">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2px 1fr", gap: 12, height: "100%" }}>
              <div>
                {left.length === 0 && pi === 0 ? (
                  <p className="nb-empty nb-typewriter">Sin lecturas</p>
                ) : (
                  left.map((book, i) => (
                    <ScrapbookEntry key={book.id} book={book} index={pi * perPage + i} />
                  ))
                )}
              </div>
              <div style={{ backgroundColor: "#1a2f4b", opacity: 0.15 }} />
              <div>
                {right.map((book, i) => (
                  <ScrapbookEntry key={book.id} book={book} index={pi * perPage + 4 + i} />
                ))}
              </div>
            </div>
          </ExportPage>
        );
      })}
    </>
  );
}

function CalendarStarsPage({ payload }: { payload: NotebookExportPayload }) {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1) as Month);
  const displayBooks = payload.books.slice(0, 20);

  return (
    <ExportPage variant="dots">
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <MagazineText text="CALENDAR COLOR" size="md" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {months.map((month) => {
              const daysInMonth = new Date(payload.year, month, 0).getDate();
              return (
                <div key={month} style={{ width: "23%" }}>
                  <p className="nb-hand" style={{ fontSize: 12 }}>{MONTH_NAMES[month].slice(0, 3)}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", width: 88 }}>
                    {Array.from({ length: daysInMonth }).map((_, di) => {
                      const day = di + 1;
                      const date = `${payload.year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const book = payload.books.find((b) => b.endDate?.slice(0, 10) === date);
                      return (
                        <span
                          key={day}
                          style={{
                            width: 10,
                            height: 6,
                            margin: 0.5,
                            backgroundColor: book ? ratingColor(book.rating) : "transparent",
                            border: "0.5px solid #ddd",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Sticker payload={payload} id="starsDecoration" style={{ width: 200, height: 24, margin: "0 auto" }} />
          <p className="nb-serif-title" style={{ fontSize: 22, textAlign: "center", margin: "8px 0" }}>STARS</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} style={{ textAlign: "center" }}>
                <span className="nb-typewriter">{s}</span>
                <div style={{ width: 14, height: 8, backgroundColor: ratingColor(s), marginTop: 2 }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid #1a2f4b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-playfair)",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {payload.readingGoal}
            </div>
            <div style={{ flex: 1 }}>
              {displayBooks.map((book, i) => (
                <div key={book.id} style={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 3 }}>
                  <span className="nb-typewriter" style={{ width: 14 }}>{i + 1}</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        width: 16,
                        height: 9,
                        backgroundColor: Math.round(book.rating) === s ? ratingColor(book.rating) : "#f5f5f5",
                        border: "0.5px solid #ddd",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ExportPage>
  );
}

export function NotebookHtmlPages({ payload }: { payload: NotebookExportPayload }) {
  return (
    <>
      <CoverPage payload={payload} />
      <IntroPage payload={payload} />
      <WishlistPage payload={payload} />
      <YearPixelsPage payload={payload} />
      <TrackerOverviewPage payload={payload} />
      <MasterTablePage payload={payload} />
      <FavoritesPage payload={payload} />
      <BookOfYearPage payload={payload} />
      <ScrapbookPages payload={payload} />
      <CalendarStarsPage payload={payload} />
    </>
  );
}
