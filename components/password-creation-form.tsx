"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePasswordMutation } from "@/hooks/useCreatePassword";
import { useAccountStore } from "@/lib/stores/accountStore";
import { useMasterPasswordStore } from "@/lib/stores/masterPasswordStore";
import { encryptPassword, deriveKeyFromPassword } from "@/lib/crypto/encryption";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  username: z.string().min(1).max(50),
  url: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
  notes: z.string().max(250).optional(),
});

export default function PasswordCreationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createPasswordMutation = useCreatePasswordMutation();
  const { currentAccount } = useAccountStore();
  const { password: masterPassword } = useMasterPasswordStore();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentAccount) {
      toast.error("You must connect a wallet account");
      return;
    }

    if (!masterPassword) {
      toast.error("Master password is not available.");
      return;
    }

    try {
      const key = await deriveKeyFromPassword(masterPassword);
      const { ciphertext, iv } = await encryptPassword(key, values.password);

      await createPasswordMutation.mutateAsync({
        title: values.title,
        username: values.username,
        url: values.url,
        notes: values.notes,
        ciphertext,
        iv,
      });

      toast.success("Password saved successfully");
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("An error occurred while saving the password.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="title..." type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username / Email</FormLabel>
              <FormControl>
                <Input placeholder="username..." type="text" {...field} />
              </FormControl>
              <FormDescription>Your username or email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="url..." type="text" {...field} />
              </FormControl>
              <FormDescription>
                Site where you&apos;re using the password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="password..." {...field} />
              </FormControl>
              <FormDescription>Enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Anything else you need to know</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
