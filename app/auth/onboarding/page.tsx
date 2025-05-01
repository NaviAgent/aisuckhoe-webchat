"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateUserMetadata } from "@/lib/clerk/user-service";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useI18n } from "@/app/i18n";

// Define Zod schema for validation
const formSchema = z.object({
  gender: z.string().min(1, { message: "Gender is required" }),
  age: z.coerce // Use coerce to convert string input to number
    .number()
    .min(18, { message: "Age must be at least 18" })
    .max(100, { message: "Age must be at most 100" }),
  // medicalHistory: z.string().optional(), // Uncomment if needed
});

type OnboardingFormValues = z.infer<typeof formSchema>;

export default function Onboarding() {
  const t = useI18n();
  const { createProfile } = useProfileListStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "",
      age: 18, // Default age or fetch from user if available later
      // medicalHistory: "", // Uncomment if needed
    },
  });

  const onSubmit = async (values: OnboardingFormValues) => {
    setLoading(true);
    setError(""); // Clear previous errors

    const profileData = {
      name: user?.fullName ?? "",
      avatar: null,
      relationship: "self",
      ownerId: user?.id ?? "",
      age: values.age,
      gender: values.gender,
      medicalHistory: "", // values.medicalHistory || "", // Uncomment if needed
      dob: new Date(
        new Date().setMonth(0, 1) - values.age * 365 * 24 * 60 * 60 * 1000
      ),
      metadata: { onboardingComplete: true },
    };

    try {
      const { data: metadataUpdateData, error: metadataUpdateError } =
        await updateUserMetadata({
          onboardingComplete: true,
        });

      if (metadataUpdateError) throw new Error(metadataUpdateError);

      await createProfile(profileData);

      // Only redirect if both operations were successful
      if (metadataUpdateData) {
        router.replace("/");
      }
    } catch (error) {
      const err = error as Error;
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Watch for errors from react-hook-form
  const formErrors = form.formState.errors;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <p className="font-bold text-center text-gray-800">
            {t("onboarding.createDefaultProfile")}
          </p>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            {t("onboarding.helloUser", { name: user?.fullName })}
          </h1>

          {(error || Object.keys(formErrors).length > 0) && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error && <p>{error}</p>}
              {/* Display react-hook-form errors */}
              {Object.values(formErrors).map((err, index) => (
                <p key={index}>{err.message}</p>
              ))}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Gender Selection */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.gender")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("onboarding.selectGender")}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">{t("common.male")}</SelectItem>
                        <SelectItem value="Female">
                          {t("common.female")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age Selection */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("common.age")}
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))} // Convert value to number
                      defaultValue={String(field.value)} // Convert defaultValue to string
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("onboarding.selectAge")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(
                          { length: 100 - 18 + 1 },
                          (_, i) => i + 18
                        ).map((age) => (
                          <SelectItem key={age} value={String(age)}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Medical History (Optional - Uncomment if needed) */}
              {/* <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Medical History
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Enter your medical history..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid} // Disable if loading or form is invalid
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white" // Added text-white for visibility
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("common.processing")}
                  </div>
                ) : (
                  t("onboarding.createProfileButton")
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
