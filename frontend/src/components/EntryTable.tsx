import { useEffect, useRef, useState } from "react";
import { Entry } from "@/types/entry";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EntryTableProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (entry: Entry) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export const EntryTable = ({ entries, onEdit, onDelete, onLoadMore, hasMore, isLoading }: EntryTableProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [sortField, setSortField] = useState<keyof Entry>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => currentTarget && observer.unobserve(currentTarget);
  }, [hasMore, isLoading, onLoadMore]);

  const sortedEntries = [...entries].sort((a, b) => {
    const aVal = a[sortField]?.toString().toLowerCase() || "";
    const bVal = b[sortField]?.toString().toLowerCase() || "";
    return sortDirection === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const handleSort = (field: keyof Entry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  if (entries.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Film className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No entries yet</h3>
        <p className="text-muted-foreground">
          Start adding your favorite films and shows!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-card/50 border-b border-border">
            <tr>
              {[
                "Title",
                "Type",
                "Director",
                "Budget",
                "Location",
                "Duration",
                "Year/Time",
                "Genre",
                "Rating",
                // "Description",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className={`px-4 py-3 text-left text-sm font-semibold ${
                    header !== "Actions"
                      ? "cursor-pointer hover:text-primary"
                      : ""
                  }`}
                  onClick={
                    header !== "Actions"
                      ? () =>
                          handleSort(
                            header
                              .toLowerCase()
                              .replace("/", "_") as keyof Entry
                          )
                      : undefined
                  }
                >
                  {header}{" "}
                  {sortField === header.toLowerCase() &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedEntries.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border hover:bg-card/30 transition-colors"
              >
<td
  className="px-4 py-3 font-medium text-primary hover:underline cursor-pointer"
  onClick={() => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  }}
>
  {entry.title}
</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.type === "Movie"
                        ? "bg-accent/20 text-accent-foreground"
                        : "bg-secondary/20 text-secondary-foreground"
                    }`}
                  >
                    {entry.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.director || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.budget != null
                    ? `$${Number(entry.budget).toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.location || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.duration || "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.year_or_time ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.genre || "—"}
                </td>
                <td className="px-4 py-3">
                  {entry.rating != null ? (
                    <span className="text-primary font-semibold">
                      {parseFloat(entry.rating.toString()).toFixed(1)}/10
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>

                {/* <td className="px-4 py-3 text-muted-foreground">
                  {entry.description ? (
                    <span className="line-clamp-2">{entry.description}</span>
                  ) : (
                    "—"
                  )}
                </td> */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(entry)}
                      className="hover:text-accent hover:bg-accent/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(entry)}
                      className="hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {isLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-border">
                    {[...Array(11)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>

        {isModalOpen && selectedEntry && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-card text-foreground p-6 rounded-2xl shadow-2xl w-[350px] relative animate-in fade-in duration-200">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-primary"
      >
        ✕
      </button>

      <div className="flex flex-col items-center space-y-4">
        {/* Poster placeholder */}
        <div className="w-40 h-56 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {selectedEntry.posterUrl ? (
            <img
              src={selectedEntry.posterUrl}
              alt={selectedEntry.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Film className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        <h2 className="text-xl font-semibold text-center">{selectedEntry.title}</h2>
        <p className="text-sm text-muted-foreground text-center">
          {selectedEntry.genre || "—"} • {selectedEntry.year_or_time} • {selectedEntry.type}
        </p>

        <div className="text-sm text-muted-foreground text-center">
          <p><strong>Director:</strong> {selectedEntry.director}</p>
          <p><strong>Rating:</strong> {selectedEntry.rating ? `${selectedEntry.rating}/10` : "—"}</p>
          <p><strong>Budget:</strong> {selectedEntry.budget ? `$${Number(selectedEntry.budget).toLocaleString()}` : "—"}</p>
        </div>
      </div>
    </div>
  </div>
)}

      </div>

      <div ref={observerTarget} className="h-4" />
      {!hasMore && entries.length > 0 && (
        <p className="text-center text-muted-foreground text-sm py-4">
          All entries loaded
        </p>
      )}
    </div>
  );
};
