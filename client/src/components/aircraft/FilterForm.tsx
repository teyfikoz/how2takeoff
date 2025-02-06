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
  passengers: z.number().min(0, "Yolcu sayısı 0'dan büyük olmalı"),
  cargo: z.number().min(0, "Kargo ağırlığı 0'dan büyük olmalı"),
  range: z.number().min(0, "Menzil 0'dan büyük olmalı"),
  alternateRange: z.number().min(0, "Alternatif menzil 0'dan büyük olmalı"),
  windSpeed: z.number().min(0, "Rüzgar hızı 0'dan büyük olmalı"),
  windDirection: z.number().min(0).max(360, "Rüzgar yönü 0-360 derece arasında olmalı")
});

type FilterFormData = z.infer<typeof filterSchema>;

interface Props {
  onFilter: (data: FilterFormData) => void;
}

export default function FilterForm({ onFilter }: Props) {
  const form = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      passengers: 0,
      cargo: 0,
      range: 0,
      alternateRange: 0,
      windSpeed: 0,
      windDirection: 0
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uçuş Gereksinimleri</CardTitle>
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
                    <FormLabel>Yolcu Sayısı</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <FormLabel>Kargo Ağırlığı (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <FormLabel>Menzil (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <FormLabel>Alternatif Menzil (km)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <FormLabel>Rüzgar Hızı (kt)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                    <FormLabel>Rüzgar Yönü (derece)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Uygun Uçakları Bul</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
