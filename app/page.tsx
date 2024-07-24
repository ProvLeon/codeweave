import About from '@/components/landingPage/About';
import Features from '@/components/landingPage/Features';
import Intro from '@/components/landingPage/Intro';
//import Contact from '@/components/landingPage/Contact';
//import { Contact } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <Intro />
      <Features/>
      <About/>
      {/*<Contact/>*/}
    </div>
  );
}
