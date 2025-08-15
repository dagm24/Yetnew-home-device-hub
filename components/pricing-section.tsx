"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function PricingSection() {
  const plans = [
    {
      name: "Free Forever",
      price: "$0",
      period: "forever",
      description: "Perfect for small families getting started",
      features: [
        "Up to 50 devices",
        "Basic search & organization",
        "2 family members",
        "Mobile app access",
        "Email support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Family Pro",
      price: "$9",
      period: "month",
      description: "Everything you need for a busy household",
      features: [
        "Unlimited devices",
        "AI-powered search",
        "Unlimited family members",
        "Advanced storage management",
        "Maintenance reminders",
        "Priority support",
        "Data export",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Family Premium",
      price: "$19",
      period: "month",
      description: "For families who want it all",
      features: [
        "Everything in Pro",
        "Custom categories & fields",
        "Advanced analytics",
        "API access",
        "White-label options",
        "Dedicated support",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the perfect plan for your family's needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-6 ${
                plan.popular
                  ? "border-2 border-purple-500 shadow-2xl scale-105"
                  : "border border-gray-200 hover:shadow-lg"
              } transition-all duration-300`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              99.9% uptime guarantee
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              SSL encryption
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Regular backups
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
