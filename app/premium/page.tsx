"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  period: "month" | "year"
  features: {
    included: string[]
    excluded: string[]
  }
  popular?: boolean
}

export default function PremiumPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month")

  const monthlyPlans: PricingPlan[] = [
    {
      id: "basic-monthly",
      name: "Базовый",
      description: "Все необходимое для участия в турнирах",
      price: 1,
      period: "month",
      features: {
        included: ["Участие в турнирах", "Базовая статистика", "Создание команды", "Поддержка по email"],
        excluded: [
          "Приоритетная регистрация",
          "Расширенная статистика",
          "Создание турниров",
          "Приоритетная поддержка",
          "Отсутствие рекламы",
        ],
      },
    },
    {
      id: "pro-monthly",
      name: "Про",
      description: "Идеально для активных игроков и капитанов команд",
      price: 2,
      period: "month",
      popular: true,
      features: {
        included: [
          "Участие в турнирах",
          "Базовая статистика",
          "Создание команды",
          "Поддержка по email",
          "Приоритетная регистрация",
          "Расширенная статистика",
          "Создание турниров",
        ],
        excluded: ["Приоритетная поддержка", "Отсутствие рекламы"],
      },
    },
    {
      id: "premium-monthly",
      name: "Премиум",
      description: "Максимальные возможности для профессионалов",
      price: 3,
      period: "month",
      features: {
        included: [
          "Участие в турнирах",
          "Базовая статистика",
          "Создание команды",
          "Поддержка по email",
          "Приоритетная регистрация",
          "Расширенная статистика",
          "Создание турниров",
          "Приоритетная поддержка",
          "Отсутствие рекламы",
        ],
        excluded: [],
      },
    },
  ]

  const yearlyPlans: PricingPlan[] = monthlyPlans.map((plan) => ({
    ...plan,
    id: plan.id.replace("monthly", "yearly"),
    price: Math.round(plan.price * 10), // 2 месяца бесплатно при годовой подписке
    period: "year",
  }))

  const plans = billingPeriod === "month" ? monthlyPlans : yearlyPlans

  const handleSubscribe = (planId: string) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // В реальном приложении здесь будет логика оформления подписки
    console.log(`Оформление подписки на план: ${planId}`)
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Премиум подписка</h1>
          <p className="text-xl text-muted-foreground">
            Получите доступ к расширенным возможностям платформы и станьте частью элитного сообщества киберспортсменов
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs defaultValue="month" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="month" onClick={() => setBillingPeriod("month")}>
                Ежемесячно
              </TabsTrigger>
              <TabsTrigger value="year" onClick={() => setBillingPeriod("year")}>
                Ежегодно <Badge className="ml-2 bg-green-100 text-green-800">-17%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <Badge className="bg-blue-500">Популярный</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price} ₽</span>
                  <span className="text-muted-foreground">/{plan.period === "month" ? "мес" : "год"}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.included.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features.excluded.map((feature, index) => (
                    <div key={index} className="flex items-center text-muted-foreground">
                      <X className="h-4 w-4 text-red-500 mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {user ? "Оформить подписку" : "Войти для оформления"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Как оформить подписку?</h3>
              <p className="text-muted-foreground">
                Для оформления подписки необходимо выбрать подходящий тарифный план и нажать кнопку "Оформить подписку".
                Далее вы будете перенаправлены на страницу оплаты, где сможете выбрать удобный способ оплаты.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Можно ли отменить подписку?</h3>
              <p className="text-muted-foreground">
                Да, вы можете отменить подписку в любое время в личном кабинете. После отмены подписка будет действовать
                до конца оплаченного периода.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Как перейти на другой тарифный план?</h3>
              <p className="text-muted-foreground">
                Вы можете изменить тарифный план в любое время в личном кабинете. При переходе на более дорогой план вам
                будет предложено доплатить разницу. При переходе на более дешевый план изменения вступят в силу со
                следующего платежного периода.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold mb-2">Есть ли пробный период?</h3>
              <p className="text-muted-foreground">
                В настоящее время мы не предоставляем пробный период для премиум-подписки. Однако вы можете ознакомиться
                с базовыми функциями платформы бесплатно.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
