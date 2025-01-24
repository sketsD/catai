import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function RestorePasswordPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would handle the password restoration process
    console.log(values)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-zinc-900 p-4">
        <div className="container mx-auto">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CATAI_Pharm_Desktop-Bxqd6eFISFa6p5LURWzPuP4RjU0gdZ.png"
            alt="CATAI PHARM Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logos */}
          <div className="flex justify-center space-x-4 items-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CATAI_Pharm_Desktop-Bxqd6eFISFa6p5LURWzPuP4RjU0gdZ.png"
              alt="CATAI PHARM Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
            <div className="w-px h-12 bg-gray-200" />
            <div className="h-12 w-12 bg-[#E91E63] rounded-full" />
          </div>

          {/* Description */}
          <p className="text-center text-gray-600">
            The App helps identify Look-Alike Sound-Alike medications to prevent errors
          </p>

          {/* Restore Password Form */}
          <div className="w-full max-w-xs mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold">Restore Password</h1>
              <p className="text-sm text-gray-600">
                Enter your email to receive a verification code. Use the code to create and confirm your new password.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="w-full max-w-xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full max-w-xs bg-blue-500 hover:bg-blue-600">
                  Restore
                </Button>
              </form>
            </Form>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm">
            Need help?{" "}
            <Link href="/support" className="text-blue-500 hover:text-blue-600">
              Contact support
            </Link>
            .
          </div>
        </div>
      </main>
    </div>
  )
}

