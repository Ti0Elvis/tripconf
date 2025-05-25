"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { schema } from "./schema";
import { addDays } from "date-fns";
import { sign_in } from "./actions";
import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { DAYS_TO_EXPIRE_TOKEN } from "@/lib/constants";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { token, error } = await sign_in(values);

      if (error !== undefined) {
        throw new Error(error);
      }

      return token;
    },
    onSuccess: (token) => {
      form.reset();
      setCookie("token", token, {
        expires: addDays(new Date(), DAYS_TO_EXPIRE_TOKEN),
      });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      form.reset();
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        className: "text-white",
      });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutate(values));

  return (
    <MaxWidthWrapper className="w-full h-full py-32 grid place-items-center">
      <Form {...form}>
        <form className="w-72 space-y-4 md:w-96" onSubmit={onSubmit}>
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="on"
                      placeholder="Insert the username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Insert the password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </MaxWidthWrapper>
  );
}
