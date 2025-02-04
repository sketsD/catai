"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import LoginTemplate from "@/components/LoginTemplate";
import { loginUser } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  idNumber: z.string().min(5, {
    message: "ID Number must be at least 5 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated && !loading) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await dispatch(
      loginUser({ id: values.idNumber, password: values.password })
    );
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
                  Sign In {loading && <Spinner />}
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
            {/* <Link href="/" className="block text-logoblue hover:underline">
              Register
            </Link> */}
            <Link
              href="/restore-password"
              className="block text-logoblue hover:underline"
            >
              Forgot your ID number or password?
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
