"use client"

import { useState } from "react"
import { Input } from "../../components/ui/input"
import { Card } from "../../components/ui/card"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "../../lib/utils"

const faqCategories = [
  {
    category: "General",
    faqs: [
      {
        question: "Who is Friend's Telecom?",
        answer:
          "Friend's Telecom is a trusted online electronics retailer in Bangladesh. We specialize in selling genuine, high-quality smartphones, laptops, tablets, and accessories with official warranty and competitive pricing.",
      },
      {
        question: "Is Friend's Telecom legitimate?",
        answer:
          "Yes, we are a registered business with proper licenses and certifications. All our products are 100% genuine and sourced directly from authorized distributors. We have been serving customers since 2020 with excellent ratings and reviews.",
      },
      {
        question: "Do you deliver outside Dhaka?",
        answer:
          "Yes, we deliver across Bangladesh. Standard delivery takes 3-7 business days depending on location. Express delivery (1-2 days) is available in Dhaka and major cities.",
      },
    ],
  },
  {
    category: "Orders & Shipping",
    faqs: [
      {
        question: "How do I place an order?",
        answer:
          "Simply browse our products, select the item and variants, add to cart, and proceed to checkout. You can pay via bKash, Nagad, bank transfer, card, or cash on delivery.",
      },
      {
        question: "What are the shipping charges?",
        answer:
          "Shipping is free for orders over ৳5,000. For orders below this, a flat shipping charge of ৳120 applies. Express delivery has an additional charge.",
      },
      {
        question: "How can I track my order?",
        answer:
          "After placing your order, you'll receive a tracking number via SMS and email. You can track your package in real-time on our website or the carrier's website.",
      },
      {
        question: "What if my order is delayed?",
        answer:
          "If your order is delayed beyond the expected date, please contact our support team immediately at support@friendstelecom.com or call +880 1234-567890.",
      },
    ],
  },
  {
    category: "Payments & EMI",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bKash, Nagad, bank cards (Visa/Mastercard), bank transfer, and cash on delivery (COD) for eligible locations.",
      },
      {
        question: "Is it safe to pay online?",
        answer:
          "Yes, all payments are secured with SSL encryption. We never store your card details and use trusted payment gateways for all transactions.",
      },
      {
        question: "Do you offer EMI options?",
        answer:
          "Yes, we offer EMI options for purchases above ৳10,000. You can choose from 3, 6, or 12-month EMI plans with 0% or minimal interest.",
      },
      {
        question: "What are the EMI interest rates?",
        answer:
          "EMI interest rates vary: 3-month plan (0%), 6-month plan (2%), 12-month plan (4%). The final amount will be displayed during checkout.",
      },
    ],
  },
  {
    category: "Products & Warranty",
    faqs: [
      {
        question: "Are all products genuine?",
        answer:
          "Yes, 100% of our products are genuine and sourced directly from authorized distributors. We provide official warranty for all items.",
      },
      {
        question: "What warranty do you provide?",
        answer:
          "Most products come with 1-year official warranty from the manufacturer. We also offer Care+ extended warranty (2 years) for a small fee.",
      },
      {
        question: "Can I upgrade my product?",
        answer:
          "Yes, we accept upgrades for devices purchased within 7 days. Please contact our support team for details on your specific product.",
      },
      {
        question: "Do you provide technical support?",
        answer:
          "Yes, we provide 24/7 technical support via email, phone, and live chat. Our expert team can help with setup, troubleshooting, and warranty claims.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 7-day return policy for unopened items and 3 days for opened items. The product must be in original condition with all accessories.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Contact our support team within 7 days of delivery. We'll provide you with a return authorization number and arrange pickup at no extra cost.",
      },
      {
        question: "How long does refund processing take?",
        answer:
          "After we receive and verify your returned item, refunds are processed within 5-7 business days to your original payment method.",
      },
      {
        question: "Do you charge restocking fees?",
        answer:
          "No, we don't charge restocking fees for returns within 7 days (unopened items). For opened items returned within 3 days, a 10% service charge may apply.",
      },
    ],
  },
  {
    category: "Loyalty & Rewards",
    faqs: [
      {
        question: "How does the loyalty points system work?",
        answer:
          "You earn 1 point per ৳100 spent. Points can be redeemed for discounts on future purchases at a rate of 100 points = ৳1 discount.",
      },
      {
        question: "What are loyalty tiers?",
        answer:
          "We have three tiers: Bronze (0-4,999 points), Silver (5,000-14,999 points), and Gold (15,000+ points). Higher tiers give you bonus points and special benefits.",
      },
      {
        question: "How do I earn bonus points?",
        answer:
          "You earn bonus points by writing product reviews (50 points each), referring friends (1,000 points), and on your birthday month (500 bonus points).",
      },
    ],
  },
]

export function FAQsClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set())

  const toggleFAQ = (id: string) => {
    const newOpen = new Set(openFAQs)
    if (newOpen.has(id)) {
      newOpen.delete(id)
    } else {
      newOpen.add(id)
    }
    setOpenFAQs(newOpen)
  }

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about our products and services
        </p>
      </section>

      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No FAQs found matching your search.</p>
          </div>
        ) : (
          filteredCategories.map((categoryData) => (
            <section key={categoryData.category}>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">{categoryData.category}</h2>
              <div className="space-y-3">
                {categoryData.faqs.map((faq, index) => {
                  const faqId = `${categoryData.category}-${index}`
                  const isOpen = openFAQs.has(faqId)

                  return (
                    <Card
                      key={faqId}
                      className="overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFAQ(faqId)}
                        className="flex w-full items-center justify-between p-6 text-left hover:bg-muted/50"
                      >
                        <h3 className="font-semibold pr-4">{faq.question}</h3>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-border px-6 py-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Still Need Help */}
      <section className="rounded-lg bg-muted p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Still need help?</h2>
        <p className="mt-2 text-muted-foreground">
          Can&apos;t find the answer you&apos;re looking for? Please{" "}
          <a href="/contact-us" className="text-primary hover:underline">
            contact our support team
          </a>
          .
        </p>
      </section>
    </div>
  )
}
