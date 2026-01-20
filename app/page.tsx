
import Link from 'next/link';
import { Logo } from '../components/ui/Components';
import { PlayCircle, Route, Users, Clock, ChevronLeft, ChevronRight, Star, Globe, AtSign, Video } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111118] dark:text-white transition-colors duration-300">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#dbdbe6] dark:border-[#2a2a3a] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold tracking-tight">LearningStudio</span>
          </Link>
          <nav className="hidden flex-1 justify-center gap-10 md:flex">
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#courses">Courses</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#mentors">Mentors</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#resources">Resources</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden lg:flex px-6 py-2 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              Login
            </Link>
            <Link href="/signup" className="bg-primary px-6 py-2.5 text-sm font-bold text-white rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              <div className="flex flex-col gap-4">
                <span className="inline-block w-fit bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">
                  New: AI Learning Assistant
                </span>
                <h1 className="text-5xl font-black leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
                  Learn on <span className="text-primary">Your Terms</span>
                </h1>
                <p className="max-w-[540px] text-lg text-[#60608a] dark:text-gray-400">
                  AI-driven curriculum tailored to your goals with 1-on-1 guidance from industry leaders. Start your career transition today.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup" className="bg-primary h-14 px-10 text-lg font-bold text-white rounded-full hover:scale-[1.02] transition-transform flex items-center justify-center">
                  Get Started for Free
                </Link>
                <Link href="/paths" className="border-2 border-[#dbdbe6] dark:border-[#2a2a3a] h-14 px-10 text-lg font-bold rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                  View Learning Paths
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#60608a] dark:text-gray-400">
                <div className="flex -space-x-3">
                  <img alt="Student" className="size-10 rounded-full border-2 border-white dark:border-background-dark object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
                  <img alt="Student" className="size-10 rounded-full border-2 border-white dark:border-background-dark object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                  <img alt="Student" className="size-10 rounded-full border-2 border-white dark:border-background-dark object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" />
                </div>
                <p>Joined by <span className="font-bold text-[#111118] dark:text-white">10,000+</span> ambitious learners</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <div className="aspect-video w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/90 dark:bg-black/80 backdrop-blur p-4 rounded-xl">
                  <div className="bg-primary/20 text-primary p-2 rounded-full">
                    <PlayCircle className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Live Session</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Intro to Data Science</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="bg-white dark:bg-[#15152a] py-24">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <div className="mb-16 max-w-[720px]">
              <h2 className="text-4xl font-black tracking-tight mb-4">Why Choose Us?</h2>
              <p className="text-lg text-[#60608a] dark:text-gray-400">
                Experience a new way of learning designed for the modern world, combining AI intelligence with human expertise.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group flex flex-col gap-6 rounded-xl border border-[#dbdbe6] dark:border-[#2a2a3a] p-8 hover:border-primary/50 hover:shadow-xl transition-all">
                <div className="bg-primary/10 text-primary size-14 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Route size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">Personalized Paths</h3>
                  <p className="text-[#60608a] dark:text-gray-400">
                    Our AI maps your current skills and creates a unique curriculum to help you reach your career goals faster.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-6 rounded-xl border border-[#dbdbe6] dark:border-[#2a2a3a] p-8 hover:border-primary/50 hover:shadow-xl transition-all">
                <div className="bg-primary/10 text-primary size-14 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">Expert Mentors</h3>
                  <p className="text-[#60608a] dark:text-gray-400">
                    Get unlimited 1-on-1 guidance from professionals working at Top Fortune 500 companies.
                  </p>
                </div>
              </div>
              <div className="group flex flex-col gap-6 rounded-xl border border-[#dbdbe6] dark:border-[#2a2a3a] p-8 hover:border-primary/50 hover:shadow-xl transition-all">
                <div className="bg-primary/10 text-primary size-14 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Clock size={32} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">Flexible Scheduling</h3>
                  <p className="text-[#60608a] dark:text-gray-400">
                    No fixed classes. Study at your own pace, anytime, anywhere, on any device without pressure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Carousel */}
        <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
            <div className="flex gap-2">
              <button className="bg-white dark:bg-gray-800 border border-[#dbdbe6] dark:border-[#2a2a3a] size-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft />
              </button>
              <button className="bg-white dark:bg-gray-800 border border-[#dbdbe6] dark:border-[#2a2a3a] size-10 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {/* Course Card 1 */}
            <div className="min-w-[340px] flex-none group bg-white dark:bg-[#15152a] rounded-xl overflow-hidden border border-[#dbdbe6] dark:border-[#2a2a3a] hover:shadow-2xl transition-all">
              <div className="relative aspect-video bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop')" }}>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Data Science</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1">Data Science Bootcamp</h3>
                <p className="text-sm text-[#60608a] dark:text-gray-400 mb-4">By Dr. Sarah Smith • 12 Weeks</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-primary">$499</span>
                  <button className="bg-[#f0f0f5] dark:bg-gray-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    View Course
                  </button>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="min-w-[340px] flex-none group bg-white dark:bg-[#15152a] rounded-xl overflow-hidden border border-[#dbdbe6] dark:border-[#2a2a3a] hover:shadow-2xl transition-all">
              <div className="relative aspect-video bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop')" }}>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Design</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1">UX Design Professional</h3>
                <p className="text-sm text-[#60608a] dark:text-gray-400 mb-4">By Alex Chen • 8 Weeks</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-primary">$349</span>
                  <button className="bg-[#f0f0f5] dark:bg-gray-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    View Course
                  </button>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="min-w-[340px] flex-none group bg-white dark:bg-[#15152a] rounded-xl overflow-hidden border border-[#dbdbe6] dark:border-[#2a2a3a] hover:shadow-2xl transition-all">
              <div className="relative aspect-video bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop')" }}>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Marketing</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1">Digital Marketing Mastery</h3>
                <p className="text-sm text-[#60608a] dark:text-gray-400 mb-4">By Maria Garcia • 6 Weeks</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-primary">$299</span>
                  <button className="bg-[#f0f0f5] dark:bg-gray-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    View Course
                  </button>
                </div>
              </div>
            </div>

            {/* Course Card 4 */}
            <div className="min-w-[340px] flex-none group bg-white dark:bg-[#15152a] rounded-xl overflow-hidden border border-[#dbdbe6] dark:border-[#2a2a3a] hover:shadow-2xl transition-all">
              <div className="relative aspect-video bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop')" }}>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">Engineering</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1">Full-Stack Development</h3>
                <p className="text-sm text-[#60608a] dark:text-gray-400 mb-4">By David Miller • 16 Weeks</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-primary">$599</span>
                  <button className="bg-[#f0f0f5] dark:bg-gray-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-white transition-all">
                    View Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-primary/5 dark:bg-[#101022] py-24">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight mb-4 lg:text-4xl">Success Stories</h2>
              <p className="text-lg text-[#60608a] dark:text-gray-400 max-w-2xl mx-auto">
                Hear from our students who transformed their careers through our personalized learning paths.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-[#1a1a35] p-8 rounded-xl shadow-sm border border-[#dbdbe6] dark:border-[#2a2a3a]">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                </div>
                <p className="text-lg italic mb-6">
                  "The AI-personalized path was a game changer. It skipped what I already knew and focused on my gaps. I landed a job at a top tech firm within 4 months!"
                </p>
                <div className="flex items-center gap-4">
                  <img alt="Sarah" className="size-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" />
                  <div>
                    <p className="font-bold">Sarah Jenkins</p>
                    <p className="text-xs text-[#60608a] dark:text-gray-400">Now UX Designer at Google</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a1a35] p-8 rounded-xl shadow-sm border border-[#dbdbe6] dark:border-[#2a2a3a]">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                </div>
                <p className="text-lg italic mb-6">
                  "Having an industry mentor to talk to once a week was invaluable. They provided insights that no pre-recorded video could ever offer."
                </p>
                <div className="flex items-center gap-4">
                  <img alt="James" className="size-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                  <div>
                    <p className="font-bold">James Wilson</p>
                    <p className="text-xs text-[#60608a] dark:text-gray-400">Data Scientist at Meta</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1a1a35] p-8 rounded-xl shadow-sm border border-[#dbdbe6] dark:border-[#2a2a3a]">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                  <Star className="fill-current w-5 h-5" />
                </div>
                <p className="text-lg italic mb-6">
                  "I work full-time and have a family. The flexibility here is real—I could study at 10 PM or 6 AM and never felt like I was falling behind."
                </p>
                <div className="flex items-center gap-4">
                  <img alt="Elena" className="size-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" />
                  <div>
                    <p className="font-bold">Elena Rodriguez</p>
                    <p className="text-xs text-[#60608a] dark:text-gray-400">Marketing Lead at Shopify</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10">
          <div className="relative bg-primary rounded-xl p-12 lg:p-20 overflow-hidden text-center text-white">
            <div className="relative z-10 flex flex-col items-center gap-8">
              <h2 className="text-4xl font-black tracking-tight lg:text-6xl">Ready to Start?</h2>
              <p className="text-xl text-white/80 max-w-2xl">
                Join over 10,000 students learning from the best. Take the first step towards your new career today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup" className="bg-white text-primary h-14 px-12 text-lg font-bold rounded-full hover:scale-[1.05] transition-transform flex items-center justify-center">
                  Get Started for Free
                </Link>
                <button className="bg-primary/20 border border-white/30 h-14 px-12 text-lg font-bold rounded-full hover:bg-white/10 transition-colors">
                  Talk to an Advisor
                </button>
              </div>
            </div>
            {/* Decorative shapes */}
            <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-black/10 blur-3xl"></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0c0c1a] border-t border-[#dbdbe6] dark:border-[#2a2a3a] py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Logo size={24} />
                <span className="text-lg font-bold tracking-tight">LearningStudio</span>
              </div>
              <p className="text-[#60608a] dark:text-gray-400 text-sm">
                Empowering learners worldwide through AI-driven education and professional mentorship.
              </p>
              <div className="flex gap-4">
                <a className="text-[#60608a] hover:text-primary transition-colors" href="#">
                  <Globe />
                </a>
                <a className="text-[#60608a] hover:text-primary transition-colors" href="#">
                  <AtSign />
                </a>
                <a className="text-[#60608a] hover:text-primary transition-colors" href="#">
                  <Video />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="flex flex-col gap-4 text-sm text-[#60608a] dark:text-gray-400">
                <li><a className="hover:text-primary" href="#">Courses Catalog</a></li>
                <li><a className="hover:text-primary" href="#">Mentorship</a></li>
                <li><a className="hover:text-primary" href="#">For Teams</a></li>
                <li><a className="hover:text-primary" href="#">Pricing Plans</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="flex flex-col gap-4 text-sm text-[#60608a] dark:text-gray-400">
                <li><a className="hover:text-primary" href="#">About Us</a></li>
                <li><a className="hover:text-primary" href="#">Careers</a></li>
                <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-primary" href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Stay Updated</h4>
              <p className="text-sm text-[#60608a] dark:text-gray-400 mb-4">
                Get the latest course updates and career tips.
              </p>
              <div className="flex flex-col gap-3">
                <input
                  className="w-full bg-[#f0f0f5] dark:bg-gray-800 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Your email address"
                  type="email"
                />
                <button className="bg-primary text-white rounded-full py-3 text-sm font-bold hover:shadow-lg transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#dbdbe6] dark:border-[#2a2a3a] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#60608a]">© 2024 LearningStudio. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-[#60608a]">
              <a className="hover:text-primary" href="#">Privacy</a>
              <a className="hover:text-primary" href="#">Terms</a>
              <a className="hover:text-primary" href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
