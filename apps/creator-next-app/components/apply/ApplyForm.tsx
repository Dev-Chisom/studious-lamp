"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import {
  applyFormSchema,
  type ApplyFormValues,
  availableCategoriesData,
  type PricingPreference,
} from "@/lib/apply-schema"
import { DoorClosedIcon as CloseIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Facebook, Instagram, Twitter, Music, Send, Loader2, AlertCircle } from "lucide-react"

// Placeholder for i18n - replace with your i18n solution
const t = (key: string, fallback: string) => fallback

const initialFormValues: ApplyFormValues = {
  displayName: "",
  username: "",
  bio: "",
  categories: [],
  social: { facebook: "", instagram: "", twitter: "", tiktok: "" },
  monthlyPrice: 4.99,
  discounts: {}, // Will be populated from preferences
  acceptTerms: false,
  confirmAge: false,
}

async function fetchCreatorPreferences(): Promise<PricingPreference[]> {
  const res = await fetch("/api/creator-preferences")
  if (!res.ok) throw new Error("Failed to fetch pricing preferences")
  return res.json()
}

async function submitApplication(values: ApplyFormValues) {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || "Application submission failed")
  }
  return res.json()
}

export default function ApplyCreatorForm() {
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const { data: pricingPreferences = [], isLoading: isLoadingPreferences } = useQuery<PricingPreference[]>({
    queryKey: ["creatorPreferences"],
    queryFn: fetchCreatorPreferences,
  })

  const preferencesByCycle = useMemo(() => {
    const grouped: Record<string, PricingPreference[]> = {}
    for (const pref of pricingPreferences) {
      if (!grouped[pref.cycle]) grouped[pref.cycle] = []
      grouped[pref.cycle].push(pref)
    }
    return grouped
  }, [pricingPreferences])

  const form = useForm<ApplyFormValues>({
    defaultValues: initialFormValues,
    validators: {
      onChange: applyFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)
      setFormSuccess(null)
      console.log("Submitting form with values:", value)
      await applicationMutation.mutateAsync(value)
    },
  })

  const applicationMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: (data) => {
      setFormSuccess(data.message || "Application submitted successfully!")
      form.reset()
      // queryClient.invalidateQueries({ queryKey: ['someOtherData'] }) // If needed
    },
    onError: (error: Error) => {
      setFormError(error.message || "An unknown error occurred.")
    },
  })

  // Effect to set initial discount values once preferences are loaded
  useEffect(() => {
    if (pricingPreferences.length > 0 && form.state.values.monthlyPrice) {
      const initialDiscounts: Record<string, string> = {}
      Object.entries(preferencesByCycle).forEach(([cycle, prefs]) => {
        const zeroDiscount = prefs.find((p) => p.discount === 0)
        if (zeroDiscount) {
          initialDiscounts[cycle] = zeroDiscount._id
        } else if (prefs.length > 0) {
          initialDiscounts[cycle] = prefs[0]._id
        }
      })
      form.setFieldValue("discounts", initialDiscounts)
    }
  }, [pricingPreferences, preferencesByCycle, form.setFieldValue, form.state.values.monthlyPrice])

  const monthlyPrice = form.useStore((s) => s.values.monthlyPrice)
  const currentDiscounts = form.useStore((s) => s.values.discounts)

  const periodPrices = useMemo(() => {
    const calculatedPrices: Record<string, number> = {}
    if (!monthlyPrice || Object.keys(currentDiscounts).length === 0 || pricingPreferences.length === 0) {
      return calculatedPrices
    }

    Object.entries(currentDiscounts).forEach(([cycle, selectedId]) => {
      const cyclePrefs = preferencesByCycle[cycle]
      if (!cyclePrefs || !selectedId) return

      const option = cyclePrefs.find((opt) => opt._id === selectedId)
      if (option) {
        let multiplier = 1
        if (cycle === "quarterly") multiplier = 3
        if (cycle === "yearly") multiplier = 12
        calculatedPrices[cycle] = Math.round(monthlyPrice * multiplier * (1 - option.discount / 100) * 100) / 100
      }
    })
    return calculatedPrices
  }, [monthlyPrice, currentDiscounts, preferencesByCycle, pricingPreferences])

  const FieldInfo = ({ field }: { field: any }) => (
    <>
      {field.state.meta.touchedErrors ? (
        <p className="text-sm text-red-500 mt-1">{field.state.meta.touchedErrors}</p>
      ) : null}
      {/* {field.state.meta.isValidating ? 'Validating...' : null} */}
    </>
  )

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>{t("apply.title", "Apply to be a Creator")}</CardTitle>
        <CardDescription>{t("apply.description", "Fill out the form below to start your journey.")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form.Provider>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-10"
          >
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold mb-6">{t("apply.basicInfo.title", "Basic Information")}</h2>
              <div className="space-y-6">
                <form.Field
                  name="displayName"
                  validators={{ onChange: applyFormSchema.shape.displayName }}
                  children={(field) => (
                    <div>
                      <Label htmlFor={field.name}>
                        {t("apply.basicInfo.displayName", "Display Name")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("apply.basicInfo.displayNamePlaceholder", "Your public name")}
                        className="mt-1"
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                <form.Field
                  name="username"
                  validators={{ onChange: applyFormSchema.shape.username }}
                  children={(field) => (
                    <div>
                      <Label htmlFor={field.name}>
                        {t("apply.basicInfo.username", "Username")} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("apply.basicInfo.usernamePlaceholder", "your_unique_username")}
                        className="mt-1"
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                <form.Field
                  name="bio"
                  validators={{ onChange: applyFormSchema.shape.bio }}
                  children={(field) => (
                    <div>
                      <Label htmlFor={field.name}>
                        {t("apply.basicInfo.bio", "Bio")} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder={t("apply.basicInfo.bioPlaceholder", "Tell us about yourself...")}
                        rows={3}
                        className="mt-1"
                      />
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
                <form.Field
                  name="categories"
                  validators={{ onChange: applyFormSchema.shape.categories }}
                  children={(field) => (
                    <div>
                      <Label>
                        {t("apply.basicInfo.categories", "Categories")} <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {availableCategoriesData.map((cat) => (
                          <Button
                            key={cat}
                            type="button"
                            variant={field.state.value.includes(cat) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const currentCategories = field.state.value
                              const newCategories = currentCategories.includes(cat)
                                ? currentCategories.filter((c) => c !== cat)
                                : [...currentCategories, cat]
                              field.handleChange(newCategories)
                            }}
                          >
                            {cat}
                            {field.state.value.includes(cat) && <CloseIcon className="ml-2 h-4 w-4" />}
                          </Button>
                        ))}
                      </div>
                      <FieldInfo field={field} />
                    </div>
                  )}
                />
              </div>
            </section>

            {/* Social Media */}
            <section className="pt-8 border-t">
              <h2 className="text-xl font-semibold mb-6">{t("apply.social.title", "Social Media")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(["facebook", "instagram", "twitter", "tiktok"] as const).map((socialPlatform) => (
                  <form.Field
                    key={socialPlatform}
                    name={`social.${socialPlatform}`}
                    validators={{ onChange: applyFormSchema.shape.social.shape[socialPlatform] }}
                    children={(field) => (
                      <div>
                        <Label htmlFor={field.name} className="capitalize flex items-center">
                          {socialPlatform === "facebook" && <Facebook className="mr-2 h-4 w-4" />}
                          {socialPlatform === "instagram" && <Instagram className="mr-2 h-4 w-4" />}
                          {socialPlatform === "twitter" && <Twitter className="mr-2 h-4 w-4" />}
                          {socialPlatform === "tiktok" && <Music className="mr-2 h-4 w-4" />}
                          {t(`apply.social.${socialPlatform}`, socialPlatform)}
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={t("apply.social.usernamePlaceholder", "Your username")}
                          className="mt-1"
                        />
                        <FieldInfo field={field} />
                      </div>
                    )}
                  />
                ))}
              </div>
              <form.Field
                name="social" // For object-level error
                children={(field) => <FieldInfo field={field} />}
              />
            </section>

            {/* Pricing Section */}
            <section className="pt-8 border-t">
              <h2 className="text-xl font-semibold mb-6">{t("apply.pricing.title", "Pricing")}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("apply.pricing.monthlySubscription", "Monthly Subscription")}
                  </h3>
                  <form.Field
                    name="monthlyPrice"
                    validators={{ onChange: applyFormSchema.shape.monthlyPrice }}
                    children={(field) => (
                      <div>
                        <Label htmlFor={field.name}>
                          {t("apply.pricing.monthlyPrice", "Monthly Price (USD)")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(Number.parseFloat(e.target.value))}
                          placeholder="4.99"
                          min="4.99"
                          step="0.01"
                          className="mt-1"
                        />
                        <FieldInfo field={field} />
                      </div>
                    )}
                  />
                </div>

                <h3 className="text-lg font-medium mb-2">
                  {t("apply.pricing.subscriptionPlans", "Subscription Plans (Optional Discounts)")}
                </h3>
                {isLoadingPreferences && <p>Loading pricing options...</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(preferencesByCycle).map(([cycle, cyclePrefs]) => (
                    <Card key={cycle}>
                      <CardHeader>
                        <CardTitle className="capitalize">{t(`apply.pricing.${cycle}Plan`, `${cycle} Plan`)}</CardTitle>
                        <CardDescription>
                          {t(`apply.pricing.${cycle}Description`, `Discount for ${cycle} subscription.`)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <form.Field
                          name={`discounts.${cycle}`}
                          children={(field) => (
                            <div>
                              <Label htmlFor={field.name}>{t("apply.pricing.discount", "Select Discount")}</Label>
                              <Select
                                value={field.state.value || ""}
                                onValueChange={(value) => field.handleChange(value)}
                              >
                                <SelectTrigger id={field.name} className="mt-1">
                                  <SelectValue placeholder={t("common.select", "Select discount...")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {cyclePrefs.map((opt) => (
                                    <SelectItem key={opt._id} value={opt._id}>
                                      {opt.discount}% {t("common.off", "off")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FieldInfo field={field} />
                            </div>
                          )}
                        />
                        <div>
                          <Label>
                            {t(
                              `apply.pricing.total${cycle.charAt(0).toUpperCase() + cycle.slice(1)}Price`,
                              `Total ${cycle} Price`,
                            )}
                          </Label>
                          <Input
                            value={periodPrices[cycle]?.toFixed(2) || t("apply.pricing.calculating", "Calculating...")}
                            readOnly
                            className="mt-1 bg-gray-100 dark:bg-gray-800"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Legal Section */}
            <section className="pt-8 border-t">
              <h2 className="text-xl font-semibold mb-6">{t("apply.legal.title", "Legal")}</h2>
              <form.Field
                name="acceptTerms"
                validators={{ onChange: z.boolean().refine((v) => v, { message: "Required" }) }}
                children={(field) => (
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                      onBlur={field.handleBlur}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={field.name} className="font-medium">
                        {t("apply.legal.acceptTerms", "I accept the terms and conditions.")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              />
              <form.Field
                name="confirmAge"
                validators={{ onChange: z.boolean().refine((v) => v, { message: "Required" }) }}
                children={(field) => (
                  <div className="flex items-start space-x-3 mt-4">
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                      onBlur={field.handleBlur}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={field.name} className="font-medium">
                        {t("apply.legal.confirmAge", "I confirm I am of legal age to create content.")}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <FieldInfo field={field} />
                    </div>
                  </div>
                )}
              />
            </section>

            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error", "Error")}</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            {formSuccess && (
              <Alert
                variant="default"
                className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
              >
                <AlertCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
                <AlertTitle className="text-green-800 dark:text-green-200">{t("common.success", "Success")}</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">{formSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="pt-6 flex justify-end">
              <Button
                type="submit"
                disabled={applicationMutation.isPending || !form.state.isValid}
                className="w-full sm:w-auto"
              >
                {applicationMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("apply.processing", "Processing...")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("apply.button", "Submit Application")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </form.Provider>
      </CardContent>
    </Card>
  )
}
