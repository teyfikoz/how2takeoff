import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const filterSchema = z.object({
  passengers: z.number().min(0, "Number of passengers must be greater than 0"),
  cargo: z.number().min(0, "Cargo weight must be greater than 0"),
  range: z.number().min(0, "Range must be greater than 0"),
  alternateRange: z.number().min(0, "Alternate range must be greater than 0"),
  windSpeed: z.number().min(0, "Wind speed must be greater than 0"),
  windDirection: z.number().min(0).max(360, "Wind direction must be between 0-360 degrees")
});

type FilterFormData = z.infer<typeof filterSchema>;

interface Props {
  onFilter: (data: FilterFormData) => void;
}

export default function FilterForm({ onFilter }: Props) {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      passengers: 300,
      cargo: 15000,
      range: 10000,
      alternateRange: 1000,
      windSpeed: 20,
      windDirection: 0
    }
  });

  React.useEffect(() => {
    // Trigger initial filtering with default values
    const defaultValues = form.getValues();
    onFilter(defaultValues);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flight Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFilter)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Passengers</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Range (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Range (km)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="windSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind Speed (kt)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="windDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind Direction (degrees)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value);
                          field.onChange(value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Find Aircraft</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}