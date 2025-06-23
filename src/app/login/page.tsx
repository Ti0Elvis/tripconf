"use client";
import { addDays } from "date-fns";
import { setCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
// @actions
import { login } from "./actions";
// @components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// @hooks
import { useToast } from "@/hooks/use-toast";
// @libs
import { delay } from "@/lib/utils";
import { LoginForm } from "@/lib/schemas";
import { DAYS_TO_EXPIRE_TOKEN } from "@/lib/constants";
// @types
import type { TLoginForm } from "@/types/login";

export default function Page() {
  const { toast } = useToast();

  const form = useForm<TLoginForm>({
    resolver: zodResolver(LoginForm),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: TLoginForm) => {
      const { token, error } = await login(values);

      if (error !== undefined) {
        throw new Error(error);
      }

      setCookie("token", token, {
        expires: addDays(new Date(), DAYS_TO_EXPIRE_TOKEN),
      });

      await delay(250);
    },
    onError: (error) => {
      form.reset();

      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      form.reset();

      window.location.href = "/";
    },
  });

  return (
    <div className="w-full mt-40 grid place-items-center">
      <Form {...form}>
        <form
          className="w-72 space-y-4 md:w-96"
          onSubmit={form.handleSubmit((values) => mutate(values))}>
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
    </div>
  );
}
