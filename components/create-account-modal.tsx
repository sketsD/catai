"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SuccessModal } from "./success-modal";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  id: z.string().min(8, "ID must be at least 8 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userType: z.enum(["Pharmacy", "Admin", "Technical"]),
});

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      id: "",
      password: "",
      userType: "Pharmacy",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the data to your API
    console.log(values);
    onClose();
    setShowSuccess(true);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] m-2 sm:m-0 bg-white rounded-[8px] sm:h-fit h-3/4 overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Create A New Account
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-center">
              Please provide details to create an account in CATAI Pharm Desktop
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[8px] border-color-gray-250"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-color-red-danger" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[8px] border-color-gray-250"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-color-red-danger" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[8px] border-color-gray-250"
                            {...field}
                            type="email"
                          />
                        </FormControl>
                        <FormMessage className="text-color-red-danger" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="h-12 rounded-[8px] border-color-gray-250">
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-color-red-danger" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[8px] border-color-gray-250"
                            {...field}
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-[8px] border-color-gray-250"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage className="text-color-red-danger" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex sm:justify-end justify-center  gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-[#14ae5c] hover:bg-[#14ae5c]/90 text-white rounded-[8px] "
                >
                  Create
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-[#ff0000] hover:bg-[#ff0000]/90 text-white rounded-[8px]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
