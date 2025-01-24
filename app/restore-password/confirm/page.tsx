"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Navbar from "@/components/Navbar";
import LoginTemplate from "@/components/LoginTemplate";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ConfirmPasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <LoginTemplate />
          <div className="w-full max-w-sm mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold">Restore Password</h1>
              <p className="text-sm text-mainBlack">
                Create and confirm your new password.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="w-full max-w-sm rounded-[8px] mt-1 border-color-gray-250"
                        />
                      </FormControl>
                      <FormMessage className="text-color-red-danger" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="w-full max-w-sm rounded-[8px] mt-1 border-color-gray-250"
                        />
                      </FormControl>
                      <FormMessage className="text-color-red-danger" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full max-w-sm bg-logoblue hover:bg-logoblue/60 rounded-[8px] text-white"
                >
                  Create a new password
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center text-sm">
            Need help?{" "}
            {/* <Link href="/support" className="text-logoblue hover:underline">
              Contact support
            </Link> */}
            <Link href="/" className="text-logoblue hover:underline">
              Contact support
            </Link>
            .
          </div>
        </div>
      </main>
    </div>
  );
}
