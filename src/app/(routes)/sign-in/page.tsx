"use client";
import { z } from "zod";
import { schema } from "./schema";
import { sign_in } from "./actions";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/auth";
import { useContext, useEffect } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function Page() {
  const { isLogin, setIsLogin } = useContext(AuthContext)!;

  const { toast } = useToast();
  const { push } = useRouter();

  useEffect(() => {
    if (isLogin) {
      push("/");
    }
  }, [isLogin]);

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
      const { success, error } = await sign_in(values);

      if (error !== undefined) {
        throw new Error(error);
      }

      return success;
    },
    onSuccess: () => {
      form.reset();
      setIsLogin(true);
      push("/");
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
