import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, BookOpen, Users, Zap, CheckCircle, Clock } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered algorithm creates optimal timetables considering all constraints and preferences."
    },
    {
      icon: BookOpen,
      title: "NEP 2020 Aligned",
      description: "Fully compliant with National Education Policy 2020 guidelines and academic structures."
    },
    {
      icon: Users,
      title: "Multi-Program Support",
      description: "Supports B.Ed, M.Ed, FYUP, ITEP programs with flexible course combinations."
    },
    {
      icon: Zap,
      title: "Instant Generation",
      description: "Generate comprehensive timetables in seconds with conflict detection and resolution."
    },
    {
      icon: CheckCircle,
      title: "Conflict-Free",
      description: "Advanced algorithms ensure no scheduling conflicts for students or faculty."
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description: "Optimizes time slots based on student preferences and academic requirements."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container mx-auto px-4 py-20 lg:py-28">
            <div className="text-center text-white animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                AI-Powered Timetable
                <br />
                <span className="text-accent-light">Generation System</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Transform your educational scheduling with intelligent automation. 
                Create optimal timetables aligned with NEP 2020 in minutes, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 glow-effect animate-scale-in"
                >
                  <Link to="/form" className="flex items-center space-x-2">
                    <span>Generate Timetable</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent-light rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Why Choose Our AI Timetable System?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of educational scheduling with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up border-border/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="card-elevated bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="text-center py-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of educational institutions already using our AI-powered timetable system
              </p>
              <Button 
                asChild 
                size="lg" 
                className="hero-gradient text-white text-lg px-12 py-6 glow-effect animate-scale-in"
              >
                <Link to="/form" className="flex items-center space-x-2">
                  <span>Create Your First Timetable</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;