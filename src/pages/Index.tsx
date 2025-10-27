import { useState, useEffect } from "react";
import { Plus, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EntryTable } from "@/components/EntryTable";
import { EntryForm } from "@/components/EntryForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Entry, CreateEntryInput, UpdateEntryInput } from "@/types/entry";
import { api } from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEntries = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const result = await api.getEntries(pageNum);
      
      if (pageNum === 1) {
        setEntries(result.data);
      } else {
        setEntries(prev => [...prev, ...result.data]);
      }
      
      setHasMore(result.hasMore);
    } catch (error) {
      toast.error("Failed to load entries");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadEntries(nextPage);
  };

  const handleAdd = () => {
    setSelectedEntry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handleDelete = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateEntryInput) => {
    try {
      setIsSubmitting(true);
      
      if (selectedEntry) {
        const updated = await api.updateEntry({ ...data, id: selectedEntry.id });
        setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
        toast.success("Entry updated successfully");
      } else {
        const created = await api.createEntry(data);
        setEntries(prev => [created, ...prev]);
        toast.success("Entry created successfully");
      }
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error(selectedEntry ? "Failed to update entry" : "Failed to create entry");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEntry) return;

    try {
      setIsDeleting(true);
      await api.deleteEntry(selectedEntry.id);
      setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
      toast.success("Entry deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete entry");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-hero">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Film className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Film & Show Manager</h1>
                <p className="text-muted-foreground">Track your favorite entertainment</p>
              </div>
            </div>
            <Button 
              onClick={handleAdd}
              className="bg-gradient-accent hover:opacity-90 shadow-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Entry
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <EntryTable
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEntry ? "Edit Entry" : "Add New Entry"}
            </DialogTitle>
          </DialogHeader>
          <EntryForm
            entry={selectedEntry || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        entry={selectedEntry}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Index;
