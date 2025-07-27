import React from 'react';
import { FaBookOpen, FaGlobeAmericas, FaUsers, FaLeaf } from 'react-icons/fa';
import { HomeHeader, Footer } from '../components/HeaderFooter'; // Assuming you have these
import { FeatureCard } from '../components/aboutUs/FeatureCard';
import { TeamMemberCard } from '../components/aboutUs/TeamMemberCard';

// You can replace these with your actual team members
const teamMembers = [
  {
    name: 'Cheng Chanpanha',
    role: 'Founder & Head Curator',
    bio: 'A lifelong book lover, Sokha started Kon Khmer to share the rich stories of Cambodia and the world with a new generation of readers.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop', // Placeholder
  },
  {
    name: 'N/A',
    role: 'Community Manager',
    bio: 'Dara connects our bookstore with local artists and authors, organizing events that celebrate our vibrant literary culture.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop', // Placeholder
  },
];

export function AboutUsPage() {
  return (
    <>
      <HomeHeader />
      <div className="bg-white">
        
        {/* Section 1: Hero */}
        <section className="relative bg-red-500 text-white text-center py-20 md:py-32">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              About Kon Khmer Bookstore
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-red-100">
              Discovering worlds, one page at a time. A celebration of Khmer literature and global stories.
            </p>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="md:pr-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-loose mb-4">
                Born from a deep passion for storytelling and a desire to preserve the rich literary heritage of Cambodia, 
                Kon Khmer Bookstore was founded in 2024. Our mission is to be more than just a place to buy books; 
                we aim to be a vibrant community hub where readers, writers, and thinkers can connect.
              </p>
              <p className="text-gray-600 leading-loose">
                We believe that every book is a doorway to a new perspective. From ancient Khmer folk tales to contemporary 
                bestsellers from around the globe, our carefully curated collection is chosen to inspire, educate, and entertain.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop" 
                alt="Cozy bookstore interior" 
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Our Values */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">What We Stand For</h2>
              <p className="mt-2 text-gray-600">Our core values guide everything we do.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<FaBookOpen size={32} />}
                title="Curated Collection"
                description="Every book on our shelves is hand-picked for its quality, story, and ability to spark conversation."
              />
              <FeatureCard 
                icon={<FaUsers size={32} />}
                title="Community Focused"
                description="We host workshops, author talks, and book clubs to bring fellow book lovers together."
              />
              <FeatureCard 
                icon={<FaGlobeAmericas size={32} />}
                title="Global & Local"
                description="Celebrating Cambodian authors while bringing the best of world literature to our readers."
              />
               <FeatureCard 
                icon={<FaLeaf size={32} />}
                title="Sustainability"
                description="We prioritize eco-friendly practices, from our packaging to supporting sustainable publishing."
              />
            </div>
          </div>
        </section>
        
        {/* Section 4: Meet The Team */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Meet Our Team</h2>
              <p className="mt-2 text-gray-600">The passionate readers behind your next favorite book.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {teamMembers.map(member => (
                <TeamMemberCard 
                  key={member.name}
                  imageUrl={member.imageUrl}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                />
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}