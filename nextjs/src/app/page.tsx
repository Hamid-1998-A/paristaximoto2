import Navbar from '@/components/sections/Navbar'
import Hero from '@/components/sections/Hero'
import BookingStrip from '@/components/sections/BookingStrip'
import Services from '@/components/sections/Services'
import Calculator from '@/components/sections/Calculator'
import Tarifs from '@/components/sections/Tarifs'
import Testimonials from '@/components/sections/Testimonials'
import Faq from '@/components/sections/Faq'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'
import FloatingElements from '@/components/sections/FloatingElements'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BookingStrip />
      <Services />
      <Calculator />
      <Tarifs />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
      <FloatingElements />
    </>
  )
}
