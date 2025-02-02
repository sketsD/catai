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
import { SuccessModal } from "./success-modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, registerUser } from "@/store/slices/authSlice";
import { FailedModal } from "./FailedModal";
import { ChevronDown } from "lucide-react";
import { Spinner } from "./ui/spinner";

const formSchema = z.object({
  firstname: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  id: z.string().min(8, "ID must be at least 8 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userType: z.enum(["pharm", "admin", "tech"]),
});

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAccountModal({
  isOpen,
  onClose,
}: CreateAccountModalProps) {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailed, setShowFailed] = useState<boolean>(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const {
    loading,
    error: registerError,
    status,
  } = useAppSelector((state) => state.auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      surname: "",
      email: "",
      id: "",
      password: "",
      userType: "pharm",
    },
  });

  useEffect(() => {
    if (!loading && status === "success") {
      onClose();
      setShowSuccess(true);
      form.reset();
    } else if (!loading && status === "error") {
      setError(registerError || "Failed to register");
      setShowFailed(true);
    }
    return () => {
      dispatch(clearError());
    };
  }, [registerError, dispatch, clearError, status]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    dispatch(clearError());
    await dispatch(
      registerUser({
        id: values.id,
        password: values.password,
        role: values.userType,
        firstname: values.firstname,
        surname: values.surname,
        email: values.email,
      })
    );
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
                                ? field.value === "admin"
                                  ? "Admin"
                                  : field.value === "pharm"
                                  ? "Pharmacy"
                                  : "Technical"
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
                                  {type === "admin"
                                    ? "Admin"
                                    : type === "pharm"
                                    ? "Pharmacy"
                                    : "Technical"}
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
                  Create {loading && <Spinner />}
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
      <FailedModal
        isOpen={showFailed}
        onClose={() => setShowFailed(false)}
        error={error}
      />
    </>
  );
}
