import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Entry } from "@/types/entry";

// ✅ Schema updated for numeric year & rating
const entrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  type: z.enum(["Movie", "TV Show"] as const, {
    required_error: "Type is required",
  }),
  director: z.string().min(1, "Director is required").max(100),
  budget: z.string().min(1, "Budget is required").max(50),
  location: z.string().min(1, "Location is required").max(100),
  duration: z.string().min(1, "Duration is required").max(50),
  year_or_time: z.coerce.number().min(1800, "Enter a valid year"),
  genre: z.string().max(100).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  description: z.string().max(1000).optional(),
});

type EntryFormValues = z.infer<typeof entrySchema>;

interface EntryFormProps {
  entry?: Entry;
  onSubmit: (data: EntryFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EntryForm = ({
  entry,
  onSubmit,
  onCancel,
  isLoading,
}: EntryFormProps) => {
  const form = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: entry?.title || "",
      type: entry?.type === "TV_Show" ? "TV Show" : entry?.type || "Movie",
      director: entry?.director || "",
      budget: entry?.budget?.toString() ?? "",
      location: entry?.location || "",
      duration: entry?.duration || "",
      year_or_time: entry?.year_or_time ?? new Date().getFullYear(),
      genre: entry?.genre || "",
      rating: entry?.rating ?? 0,
      // description: entry?.description || "",
    },
  });

  const handleSubmit = async (data: EntryFormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Movie">Movie</SelectItem>
                    <SelectItem value="TV Show">TV Show</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Director */}
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Director *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter director name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Budget */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $50 million" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="Filming location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 120 min or 5 seasons" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Year */}
          <FormField
            control={form.control}
            name="year_or_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Genre */}
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Action, Drama" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g., 8.5"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description or synopsis"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-accent hover:opacity-90"
          >
            {isLoading ? "Saving..." : entry ? "Update Entry" : "Create Entry"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
