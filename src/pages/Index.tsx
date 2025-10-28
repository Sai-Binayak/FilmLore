import { useState, useEffect } from "react";
import { Plus, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EntryTable } from "@/components/EntryTable";
import { EntryForm } from "@/components/EntryForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Entry, CreateEntryInput, UpdateEntryInput } from "@/types/entry";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [user, setUser] = useState<any>(api.getCurrentUser());

  // Load entries
  const loadEntries = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to view entries");
        return;
      }

      const result = await api.getEntries(pageNum, 20); // no token needed; fetchWithAuth handles it

      if (pageNum === 1) setEntries(result.data);
      else setEntries((prev) => [...prev, ...result.data]);

      setHasMore(result.hasMore);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load entries. Check if you're logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries(1);
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.director.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "" ||
      entry.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadEntries(nextPage);
  };

  const handleAdd = () => {
    if (!user) return toast.error("Please log in first!");
    setSelectedEntry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entry: Entry) => {
    if (!user) return toast.error("Please log in first!");
    setSelectedEntry(entry);
    setIsFormOpen(true);
  };

  const handleDelete = (entry: Entry) => {
    if (!user) return toast.error("Please log in first!");
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateEntryInput) => {
    try {
      setIsSubmitting(true);
      if (selectedEntry) {
        const updated = await api.updateEntry({
          ...data,
          id: selectedEntry.id,
        });
        setEntries((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
        toast.success("Entry updated successfully");
      } else {
        const created = await api.createEntry(data);
        setEntries((prev) => [created, ...prev]);
        toast.success("Entry created successfully");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to save entry");
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
      setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
      toast.success("Entry deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete entry");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res =
        authMode === "login"
          ? await api.login(email, password)
          : await api.signup(name, email, password);

      setUser(api.getCurrentUser());
      setIsAuthModalOpen(false);
      toast.success(`Welcome, ${res.user?.name || "user"}!`);
    } catch (error) {
      toast.error("Authentication failed");
      console.error(error);
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    toast("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-gradient-hero">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Film className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Film & Show Manager</h1>
              <p className="text-muted-foreground">
                Track your favorite entertainment
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by title or director..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All</option>
              <option value="Movie">Movies</option>
              <option value="TV Show">TV Shows</option>
            </select>

            <Button
              onClick={handleAdd}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Entry
            </Button>

            {user ? (
              <Button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-purple-400 hover:bg-purple-300 text-black font-semibold shadow-md"
              >
                Login / Signup
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <EntryTable
          entries={filteredEntries}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </main>

      {/* Add/Edit Entry Modal */}
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

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        entry={selectedEntry}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {authMode === "login" ? "Welcome Back" : "Create Account"}
            </DialogTitle>
          </DialogHeader>

          <Tabs
            defaultValue={authMode}
            onValueChange={(v) => setAuthMode(v as "login" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-purple-600">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <form onSubmit={handleAuthSubmit} className="space-y-4 mt-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full bg-purple-600 text-black hover:bg-purple-500"
                >
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* Signup */}
            <TabsContent value="signup">
              <form onSubmit={handleAuthSubmit} className="space-y-4 mt-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  className="w-full bg-purple-600 text-black hover:bg-purple-500"
                >
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
