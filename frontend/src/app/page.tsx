import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Build Your <span className="text-blue-600">SaaS</span> Empire
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern, scalable SaaS application with authentication, payments, 
            and everything you need to launch your next big idea.
          </p>
          <div className="flex gap-4 justify-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🔐"
              title="Secure Authentication"
              description="Enterprise-grade security with Clerk authentication"
            />
            <FeatureCard
              icon="💳"
              title="Subscription Management"
              description="Seamless Stripe integration for payments and billing"
            />
            <FeatureCard
              icon="📊"
              title="Analytics Dashboard"
              description="Real-time insights and comprehensive analytics"
            />
            <FeatureCard
              icon="📧"
              title="Email Notifications"
              description="Automated emails with Resend integration"
            />
            <FeatureCard
              icon="🎨"
              title="Modern UI"
              description="Beautiful interface with TailwindCSS and Shadcn UI"
            />
            <FeatureCard
              icon="🚀"
              title="Easy Deployment"
              description="Deploy to Vercel and Railway with one click"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              tier="Free"
              price="$0"
              period="/month"
              features={['Basic features', '1 user', 'Community support']}
              cta="Get Started"
              popular={false}
            />
            <PricingCard
              tier="Basic"
              price="$19"
              period="/month"
              features={['All Free features', '5 users', 'Priority support', 'Advanced analytics']}
              cta="Upgrade to Basic"
              popular={true}
            />
            <PricingCard
              tier="Pro"
              price="$49"
              period="/month"
              features={['All Basic features', 'Unlimited users', '24/7 support', 'Custom integrations', 'API access']}
              cta="Upgrade to Pro"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SaaS Application. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({ tier, price, period, features, cta, popular }: { 
  tier: string; 
  price: string; 
  period: string; 
  features: string[]; 
  cta: string;
  popular: boolean;
}) {
  return (
    <div className={`bg-white p-8 rounded-lg shadow-md ${popular ? 'ring-2 ring-blue-600 scale-105' : ''}`}>
      {popular && <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>}
      <h3 className="text-2xl font-bold mt-4 mb-2">{tier}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <Button className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} variant={popular ? 'default' : 'outline'}>
        {cta}
      </Button>
    </div>
  )
}
