"use client";

import { useState } from "react";
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
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import LoginTemplate from "@/components/LoginTemplate";

const formSchema = z.object({
  idNumber: z.string().min(5, {
    message: "ID Number must be at least 5 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError("");
    const result = await login(values.idNumber, values.password);
    if (!result.success && result.error) {
      setError(result.error);
    }
    // The redirect is now handled in the login function in AuthContext
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
            {error && (
              <Alert
                variant="destructive"
                className="text-color-red-danger rounded-[8px]"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">ID Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          className="w-full max-w-sm rounded-[8px] mt-1 border-color-gray-250"
                        />
                      </FormControl>
                      <FormMessage className="text-color-red-danger" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          className="w-full max-w-sm rounded-[8px] border-color-gray-250"
                        />
                      </FormControl>
                      <FormMessage className="text-color-red-danger" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="rounded-[8px] w-full max-w-sm bg-logoblue hover:bg-logoblue/60 text-white"
                >
                  Sign In
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-2 text-center">
            {/* <Link
              href="/register"
              className="block text-blue-500 hover:text-blue-600"
            >
              Register
            </Link> */}
            <Link href="/" className="block text-logoblue hover:underline">
              Register
            </Link>
            <Link
              href="/restore-password"
              className="block text-logoblue hover:underline"
            >
              Forgot your username or password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
