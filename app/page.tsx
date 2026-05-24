import { Box } from '@mui/material';

import { BottomCtaSection } from './components/BottomCtaSection';
import { CosmicBackground } from './components/CosmicBackground';
import { FeaturesSection } from './components/FeaturesSection';
import { HeroSection } from './components/HeroSection';
import { SiteFooter } from './components/SiteFooter';
import { StepsSection } from './components/StepsSection';

export default function Page() {
  return (
    <Box sx={{ position: 'relative', minHeight: '100dvh' }}>
      <CosmicBackground />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <StepsSection />
        <BottomCtaSection />
        <SiteFooter />
      </Box>
    </Box>
  );
}
