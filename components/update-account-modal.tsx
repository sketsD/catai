"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, updateCurrentUser } from "@/store/slices/userSlice";
import { FailedModal } from "./FailedModal";
import { ChevronDown } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { isRole } from "@/utils/helpers";
import { UserNoPass } from "@/types/global";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  firstname: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  id: z.string().min(8, "ID must be at least 8 characters"),
  userType: z.enum(["pharm", "admin", "tech"]),
});

interface UpdateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  firstname: string;
  surname: string;
  email: string;
  id: string;
  role: "pharm" | "admin" | "tech";
}

export function UpdateAccountModal({
  isOpen,
  onClose,
  firstname,
  surname,
  email,
  id,
  role,
}: UpdateAccountModalProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const {
    loading,
    error: updatingError,
    status,
    isEvent,
  } = useAppSelector((state) => state.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname,
      surname,
      email,
      id,
      userType: role,
    },
  });

  useEffect(() => {
    if (!loading && status === "success") {
      onClose();
      form.reset();
      toast({
        duration: 3000,
        className:
          "sm:w-[380px] w-[200px] bg-white rounded-[8px] border-none p-0 flex items-center justify-center",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full">
            <CheckCircle2 className="w-16 h-16 text-[#14ae5c] mb-4" />
            <p className="text-xl font-semibold text-center w-full">
              Profile updated successfully
            </p>
          </div>
        ),
      });
    } else if (!loading && status === "error") {
      toast({
        duration: 3000,
        className:
          "sm:w-[380px] w-[200px] bg-white rounded-[8px] border-none p-0 flex items-center justify-center",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full">
            <AlertCircle className="h-10 w-10 text-[#ec221f]" />
            <p className="text-xl font-semibold text-center w-full">
              {updatingError || "Failed to update profile"}
            </p>
          </div>
        ),
      });
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, status]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(
      updateCurrentUser({
        id: values.id,
        role: values.userType,
        firstname: values.firstname,
        surname: values.surname,
        email: values.email,
      })
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] m-2 sm:m-0 bg-white rounded-[8px] sm:h-fit h-3/4 overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Update the Account
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-center">
            Please provide details to update the account in CATAI Pharm Desktop
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstname"
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
                    <FormItem className="w-full">
                      <FormLabel>User Type</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="flex w-full justify-between h-12 rounded-[8px] border-color-gray-250"
                          >
                            {field.value
                              ? isRole(field.value)
                              : "Select user type"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <div className="grid gap-1">
                            {["pharm", "admin", "tech"].map((type) => (
                              <Button
                                key={type}
                                variant="ghost"
                                className={`w-full justify-between font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                                  field.value === type
                                    ? "text-logoblue bg-color-gray-200"
                                    : "hover:text-logoblue"
                                }`}
                                onClick={() => {
                                  field.onChange(type);
                                  form.setValue(
                                    "userType",
                                    type as "pharm" | "admin" | "tech"
                                  );
                                }}
                              >
                                {isRole(type)}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
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
              </div>
            </div>

            <div className="flex sm:justify-end justify-center  gap-4 pt-4">
              <Button
                type="submit"
                className="bg-[#14ae5c] hover:bg-[#14ae5c]/90 text-white rounded-[8px]"
              >
                {isEvent ? "Updating..." : "Update"} {isEvent && <Spinner />}
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
  );
}
