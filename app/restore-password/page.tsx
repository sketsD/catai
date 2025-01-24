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

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function RestorePasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the email
    console.log(values);
    // After successful email send, redirect to confirm page
    window.location.href = "/restore-password/confirm";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="">
        <header>
          <Navbar />
        </header>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <LoginTemplate />

          <div className="w-full max-w-sm mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-xl font-medium">Restore Password</h1>
              <p className="text-sm">
                Enter your email to receive a verification code. Use the code to
                create and confirm your new password.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="w-full max-w-sm rounded-[8px] mt-1 border-color-gray-250"
                        />
                      </FormControl>
                      <FormMessage className="text-color-red-danger" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full max-w-sm bg-logoblue hover:bg-logoblue/60 text-white rounded-[8px]"
                >
                  Restore
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center text-sm">
            Need help?{" "}
            {/* <Link href="/support" className="text-blue-500 hover:text-blue-600">
              Contact support
            </Link> */}
            <Link href="/" className="text-logoblue hover:underline">
              Contact support
            </Link>
            .
          </div>

          <div className="text-center">
            <Link href="/" className="text-logoblue hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
