'use client'
import React from 'react';
import { Layout, Image, FileText, HelpCircle, Phone, Monitor, Tablet, Smartphone, Quote, Grid3x3, Briefcase } from 'lucide-react';
import dynamic from 'next/dynamic';

const HeroBlock = dynamic(() => import('../../_shared/blocks/hero/block.hero.render'), { ssr: false });
const QuoteBlock = dynamic(() => import('../../_shared/blocks/quote/block.quote.render'), { ssr: false });
const AboutBlock = dynamic(() => import('../../_shared/blocks/about/block.about.render'), { ssr: false });
const ImageBlock = dynamic(() => import('../../_shared/blocks/image/block.image.render'), { ssr: false });
const FAQBlock = dynamic(() => import('../../_shared/blocks/faq/block.faq.render'), { ssr: false });
const GalleryBlock = dynamic(() => import('../../_shared/blocks/gallery/block.gallery.render'), { ssr: false });
const ServicesListBlock = dynamic(() => import('../../_shared/blocks/services/block.services.render'), { ssr: false });
const ContactBlock = dynamic(() => import('../../_shared/blocks/contact/block.contact.render'), { ssr: false });
const TeamBlock = dynamic(() => import('../../_shared/blocks/team/block.team.render'), { ssr: false });

const HeroBlockEdit = dynamic(() => import('../../_shared/blocks/hero/block.hero.edit'), { ssr: false });
const AboutBlockEdit = dynamic(() => import('../../_shared/blocks/about/block.about.edit'), { ssr: false });
const ImageBlockEdit = dynamic(() => import('../../_shared/blocks/image/block.image.edit'), { ssr: false });
const FAQBlockEdit = dynamic(() => import('../../_shared/blocks/faq/block.faq.edit'), { ssr: false });
const ContactBlockEdit = dynamic(() => import('../../_shared/blocks/contact/block.contact.edit'), { ssr: false });
const TeamBlockEdit = dynamic(() => import('../../_shared/blocks/team/block.team.edit'), { ssr: false });
const GalleryBlockEdit = dynamic(() => import('../../_shared/blocks/gallery/block.gallery.edit'), { ssr: false });
const ServicesBlockEdit = dynamic(() => import('../../_shared/blocks/services/block.services.edit'), { ssr: false });

import { HeaderBlock, HeaderBlockEditor } from '../globalblocks/header/headerBlock';
import { NavigationBlock, NavigationBlockEditor } from '../globalblocks/navigation/navigationBlock';

import type { ContentBlock, GlobalBlock, Page, ThemeColors } from '../types';

interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
}

type ViewportType = 'desktop' | 'tablet' | 'mobile';

export const BLOCK_TYPES = [
  { type: 'hero', name: 'Hero Section', icon: Layout, color: 'bg-blue-500', hasVariants: true },
  { type: 'quote', name: 'Quote Section', icon: Quote, color: 'bg-indigo-500', hasVariants: true },
  { type: 'gallery', name: 'Gallery', icon: Grid3x3, color: 'bg-pink-500', hasVariants: true },
  { type: 'services', name: 'Services List', icon: Briefcase, color: 'bg-teal-500', hasVariants: true },
  { type: 'about', name: 'About Section', icon: FileText, color: 'bg-green-500' },
  { type: 'image', name: 'Image Block', icon: Image, color: 'bg-purple-500' },
  { type: 'faq', name: 'FAQ Section', icon: HelpCircle, color: 'bg-orange-500' },
  { type: 'contact', name: 'Contact Section', icon: Phone, color: 'bg-red-500' },
];

export const BLOCK_VARIANTS: Record<string, Array<{ id: string; name: string; description?: string }>> = {
  hero: [
    { id: 'style_a', name: 'Style A - Full Width with Background', description: 'Centered hero with background image' },
    { id: 'style_b', name: 'Style B - Split Layout', description: 'Split screen with image and content' },
    { id: 'style_c', name: 'Style C - Minimalist', description: 'Clean layout with side-by-side content' },
  ],
  quote: [
    { id: 'style_a', name: 'Style A - Standard Form', description: 'Traditional form layout with sidebar' },
    { id: 'style_b', name: 'Style B - Split Form', description: 'Split layout with enhanced sidebar' },
    { id: 'style_c', name: 'Style C - Minimalist', description: 'Clean, minimal form design' },
    { id: 'style_d', name: 'Style D - Compact', description: 'Compact form layout' },
  ],
  gallery: [
    { id: 'style_a', name: 'Style A - Grid Layout', description: 'Clean grid with equal-sized images' },
    { id: 'style_b', name: 'Style B - Masonry', description: 'Pinterest-style masonry layout' },
    { id: 'style_c', name: 'Style C - Carousel', description: 'Horizontal scrolling carousel' },
  ],
  services: [
    { id: 'style_a', name: 'Style A - Grid Cards', description: 'Three-column grid with image cards' },
    { id: 'style_b', name: 'Style B - Alternating List', description: 'Full-width alternating layout with images' },
    { id: 'style_c', name: 'Style C - Compact Grid', description: 'Four-column compact grid layout' },
  ],
};

export const GLOBAL_BLOCK_TYPES = [
  { type: 'header', name: 'Header', icon: Layout, color: 'bg-indigo-500' },
  { type: 'nav', name: 'Navigation', icon: Layout, color: 'bg-cyan-500' },
];

export const VIEWPORT_CONFIGS: Record<ViewportType, ViewportConfig> = {
  desktop: { name: 'Desktop', width: 1200, height: 800, icon: Monitor },
  tablet: { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  mobile: { name: 'Mobile', width: 375, height: 667, icon: Smartphone },
};

export const getDefaultBlockContent = (type: string, variant?: string, pages?: Page[]) => {
  switch (type) {
    case 'header':
      return {
        title: 'Your Site Title',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        height: 'h-16'
      };
    case 'nav':
      const defaultNavItems = pages ? pages.map(page => ({
        label: page.name,
        link: `/${page.slug}`,
        pageId: page.id
      })) : [
        { label: 'Home', link: '/', pageId: null }
      ];
      
      return {
        items: defaultNavItems,
        backgroundColor: '#f8f9fa',
        textColor: '#374151',
        hoverColor: '#3b82f6',
        alignment: 'left',
        autoSync: true
      };
    case 'hero':
      return {
        title: 'Welcome to Our Website',
        subtitle: 'Building amazing experiences together',
        description: 'We create exceptional digital experiences',
        buttonText: 'Get Started',
        backgroundImage: '',
        variant: variant || 'style_a'
      };
    case 'quote':
      return {
        title: 'Get Your Quote',
        subtitle: 'Fast, friendly quotes for your project',
        description: 'Fast, friendly quotes for steel fabrication, architectural steelwork, and on-site welding.',
        variant: variant || 'style_a',
        formFields: {
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          projectDetails: ''
        }
      };
    case 'gallery':
      return {
        title: 'Our Gallery',
        description: 'A collection of our best work',
        variant: variant || 'style_a',
        images: [
          { id: '1', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Gallery image 1', caption: '' },
          { id: '2', src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', alt: 'Gallery image 2', caption: '' },
          { id: '3', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', alt: 'Gallery image 3', caption: '' },
          { id: '4', src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', alt: 'Gallery image 4', caption: '' },
          { id: '5', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Gallery image 5', caption: '' },
          { id: '6', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Gallery image 6', caption: '' },
        ]
      };
    case 'services':
      return {
        title: 'Our Services',
        description: 'We offer a wide range of services to meet your needs',
        variant: variant || 'style_a',
        services: [
          { 
            id: '1', 
            title: 'Service One', 
            subtitle: 'Category', 
            description: 'Detailed description of the service and what it includes.', 
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 
            link: '#' 
          },
          { 
            id: '2', 
            title: 'Service Two', 
            subtitle: 'Category', 
            description: 'Detailed description of the service and what it includes.', 
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 
            link: '#' 
          },
          { 
            id: '3', 
            title: 'Service Three', 
            subtitle: 'Category', 
            description: 'Detailed description of the service and what it includes.', 
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', 
            link: '#' 
          },
        ]
      };
    case 'about':
      return {
        title: 'About Us',
        content: 'We are passionate about creating exceptional digital experiences that help businesses grow and succeed.',
        image: ''
      };
    case 'image':
      return {
        src: '',
        alt: 'Image description',
        caption: 'Image caption'
      };
    case 'faq':
      return {
        title: 'Frequently Asked Questions',
        items: [
          { question: 'What services do you offer?', answer: 'We offer comprehensive digital solutions.' },
          { question: 'How can I get started?', answer: 'Simply contact us to discuss your needs.' }
        ]
      };
    case 'contact':
      return {
        title: 'Get In Touch',
        email: 'hello@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      };
    case 'team':
      return {
        title: 'Our Team',
        members: [
          { name: 'John Doe', role: 'CEO', image: '', bio: 'Passionate leader with 10+ years experience.' },
          { name: 'Jane Smith', role: 'CTO', image: '', bio: 'Tech expert driving innovation forward.' }
        ]
      };
    default:
      return {};
  }
};

export const BlockRenderer: React.FC<{ 
  block: ContentBlock | GlobalBlock; 
  isEditing: boolean; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (content: any) => void;
  themeColors?: ThemeColors;
}> = ({ 
  block, 
  isEditing, 
  onUpdate,
  themeColors
}) => {
  const { type, content } = block;

  if (isEditing) {
    return (
      <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg bg-blue-50">
        <BlockEditor type={type} content={content} onUpdate={onUpdate} themeColors={themeColors} />
      </div>
    );
  }

  switch (type) {
    case 'header':
      return <HeaderBlock content={content} themeColors={themeColors} />;
    
    case 'nav':
      return <NavigationBlock content={content} themeColors={themeColors} />;
    
    case 'hero':
      return <HeroBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />;
    
    case 'quote':
      return <QuoteBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />;
    
    case 'gallery':
      return <GalleryBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />;
    
    case 'services':
      return <ServicesListBlock variant={content.variant || 'style_a'} content={content} themeColors={themeColors} />;
    
    case 'about':
      return <AboutBlock content={content} themeColors={themeColors} />;
    
    case 'image':
      return <ImageBlock content={content} themeColors={themeColors} />;
    
    case 'faq':
      return <FAQBlock content={content} themeColors={themeColors} />;
    
    case 'contact':
      return <ContactBlock content={content} themeColors={themeColors} />;
    
    case 'team':
      return <TeamBlock content={content} themeColors={themeColors} />;
    
    default:
      return <div className="p-4 bg-gray-100 text-center">Unknown block type: {type}</div>;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockEditor: React.FC<{ type: string; content: any; onUpdate: (content: any) => void; themeColors?: ThemeColors }> = ({ 
  type, 
  content, 
  onUpdate,
  themeColors
}) => {
  switch (type) {
    case 'header':
      return <HeaderBlockEditor content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'nav':
      return <NavigationBlockEditor content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'hero':
      return <HeroBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'about':
      return <AboutBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'image':
      return <ImageBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'faq':
      return <FAQBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'contact':
      return <ContactBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'team':
      return <TeamBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'gallery':
      return <GalleryBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    case 'services':
      return <ServicesBlockEdit content={content} onUpdate={onUpdate} themeColors={themeColors} />;
    default:
      return <div className="p-4 text-center">Editor for {type} not implemented</div>;
  }
};
