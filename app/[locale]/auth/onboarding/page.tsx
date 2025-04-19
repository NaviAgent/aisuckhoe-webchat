"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Profile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateUserMetadata } from "@/lib/clerk/user-service";
import { useProfileListStore } from "@/store/useProfileListStore";
import { useI18n } from "@/app/[locale]/i18n";

export default function Onboarding() {
  const t = useI18n()
  const { createProfile } = useProfileListStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState<
    Omit<Profile, "id" | "createdAt" | "updatedAt" | "deletedAt">
  >({
    name: (user?.fullName ?? "") as string,
    avatar: null,
    relationship: "self",
    ownerId: user?.id ?? "",
    age: 0,
    gender: "",
    medicalHistory: "",
    dob: new Date(),
    metadata: {},
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.age = Number(formData.age);
    formData.name = user?.fullName || "";
    formData.ownerId = user?.id || "";
    formData.dob = new Date(
      new Date().setMonth(0, 1) - formData.age * 365 * 24 * 60 * 60 * 1000
    );

    setLoading(true);

    const { data, error } = await updateUserMetadata({
      onboardingComplete: true,
    });
    await createProfile({
      ...formData,
      metadata: { onboardingComplete: true },
    });

    if (data) {
      router.replace("/");
    }
    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <p className="font-bold text-center text-gray-800">
            {t('onboarding.createDefaultProfile')}
          </p>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            {t('onboarding.helloUser', { name: user?.fullName })}
          </h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t('common.gender')}
              </Label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
                required
              >
                <option value="">{t('onboarding.selectGender')}</option>
                <option value="Male">{t('common.male')}</option>
                <option value="Female">{t('common.female')}</option>
              </select>
            </div>

            {/* Age Scroll Picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">{t('common.age')}</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="col-span-3"
                placeholder={t('onboarding.enterAgePlaceholder')}
                list="age-options"
              />
              <datalist id="age-options">
                {Array.from({ length: 100 - 18 }, (_, i) => i + 18).map(
                  (age) => (
                    <option key={age} value={age} />
                  )
                )}
              </datalist>
            </div>

            {/* Medical History */}
            {/* <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Medical History
              </Label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory || ""}
                onChange={handleChange}
                placeholder="Enter your medical history..."
                className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
              />
            </div> */}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {t('common.processing')}
                </div>
              ) : (
                t('onboarding.createProfileButton')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
