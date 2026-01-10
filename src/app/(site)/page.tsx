import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { 
  Sparkles, 
  Rocket, 
  BarChart3, 
  Code, 
  Globe, 
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { auth } from "@/auth";
import { getCurrentUser } from "@/src/domains/user/db";

export default async function Home() {
  const session = await auth();
  const user = session?.user?.id ? await getCurrentUser() : null;
  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative  flex items-start justify-center px-4 py-16 overflow-hidden">
        {/* Animated colorful background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/8 via-pink-500/6 to-orange-500/10 animate-gradient-rotate" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/8 via-indigo-500/6 to-violet-500/8 animate-gradient" />
        
        {/* Mesh gradient overlay for depth */}
        <div 
          className="absolute inset-0 opacity-30 animate-mesh-gradient"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.3), transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.3), transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.2), transparent 50%),
              radial-gradient(circle at 60% 20%, rgba(59, 130, 246, 0.2), transparent 50%)
            `
          }}
        />
        
        {/* Subtle base layer */}
        <div className="absolute inset-0 bg-background/40" />
        
        {/* Floating colorful decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-float animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-500/20 rounded-full blur-3xl animate-float animation-delay-300 animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-violet-400/15 to-fuchsia-500/15 rounded-full blur-3xl animate-float animation-delay-500" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in-up animation-delay-100">
              <Sparkles className="w-4 h-4 animate-float" />
              <span>Build → Publish → Track</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent animate-fade-in-up animation-delay-200 inline-block">
                Build websites
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-fade-in-up animation-delay-300 inline-block">
                without limits
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              PublishOS is your all-in-one platform for creating, deploying, and tracking 
              beautiful websites. No code required, infinite possibilities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-500">
              {isAuthenticated ? (
                <>
                  {user?.organisationId ? (
                    <Button asChild size="lg" className="text-lg px-8 py-6 animate-scale-in animation-delay-600 group">
                      <Link href={`/org/${user.organisationId}`}>
                        Go to Dashboard
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="text-lg px-8 py-6 animate-scale-in animation-delay-600 group">
                      <Link href="/org">
                        Get Started
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="text-lg px-8 py-6 animate-scale-in animation-delay-600 group">
                    <Link href="/auth/signup">
                      Start Building Free
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 animate-scale-in animation-delay-600">
                    <Link href="/auth/signin">
                      Sign In
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make website building effortless
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visual Builder</h3>
                <p className="text-muted-foreground">
                  Drag-and-drop interface to create stunning websites without writing a single line of code.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Publishing</h3>
                <p className="text-muted-foreground">
                  Deploy your websites with one click. Connect custom domains and go live in seconds.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Track performance with integrated analytics. Understand your audience and optimize.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Multi-Domain</h3>
                <p className="text-muted-foreground">
                  Manage multiple domains and websites from a single dashboard. Perfect for agencies.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built for speed. Your websites load instantly and rank better in search engines.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Work together seamlessly. Organize your team and manage projects efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="border-t py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="relative p-12 rounded-3xl border-2 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,0,0,0.05),transparent_50%)]" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to build something amazing?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are building beautiful websites with PublishOS.
                </p>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/auth/signup">
                    Get Started for Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
