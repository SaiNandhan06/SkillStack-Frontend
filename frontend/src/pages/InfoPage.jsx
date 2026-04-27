import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { pageContent } from '../data/pageContent';

export default function InfoPage() {
  const { slug } = useParams();
  const data = pageContent[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] font-body flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="font-display font-bold text-white text-4xl mb-4">404 - Page Not Found</h1>
          <p className="text-white/40 mb-8">The page you are looking for does not exist.</p>
          <Link to="/" className="text-[#00D9FF] hover:underline flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-body flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00D9FF]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#A855F7]/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 font-mono-accent text-xs uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display font-extrabold text-white text-4xl md:text-5xl mb-4 leading-tight">
              {data.title}
            </h1>
            <p className="font-body text-xl text-[#00D9FF] mb-16">
              {data.subtitle}
            </p>

            <div className="space-y-12">
              {data.content.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <h2 className="font-display font-semibold text-white text-2xl mb-4">
                    {section.heading}
                  </h2>
                  <p className="font-body text-white/60 text-lg leading-relaxed">
                    {section.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
