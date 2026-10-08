import React, { useState, useEffect } from 'react';
import { UserProfile, Language, ActivityDay, Challenge } from './types';
import { StorageService } from './services/storageService';
import { ChallengeService } from './services/challengeService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HuntPage } from './pages/HuntPage';
import { LearnPage } from './pages/LearnPage';
import { MissionMapPage } from './pages/MissionMapPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ErrorRevisionPage } from './pages/ErrorRevisionPage';
import { BugEncyclopediaPage } from './pages/BugEncyclopediaPage';
import { BugDNAPage } from './pages/BugDNAPage';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [activityHistory, setActivityHistory] = useState<Record<string, ActivityDay>>(() =>
    StorageService.getActivityHistory()
  );

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeChallengeId, setActiveChallengeId] = useState<string | undefined>(undefined);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageService.getTheme());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sync theme with document class on mount & changes
  useEffect(() => {
    StorageService.setTheme(theme);
  }, [theme]);

  // Refresh data on mount
  useEffect(() => {
    const p = StorageService.getProfile();
    setProfile(p);
    setActivityHistory(StorageService.getActivityHistory());
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    StorageService.setTheme(nextTheme);
  };

  const handleChangeLanguage = (lang: Language) => {
    const updated = { ...profile, selectedLanguage: lang };
    StorageService.saveProfile(updated);
    setProfile(updated);

    if (activeChallengeId) {
      const cur = ChallengeService.getChallengeById(activeChallengeId);
      if (cur) {
        const adapted = ChallengeService.getChallengeForLanguage(cur, lang);
        setActiveChallengeId(adapted.id);
      }
    } else {
      const rec = ChallengeService.getNextRecommendedChallenge(
        updated.solvedChallengeIds,
        lang
      );
      setActiveChallengeId(rec.id);
    }
  };

  const handleStartHunt = (challengeId?: string) => {
    if (challengeId) {
      const match = ChallengeService.getChallengeById(challengeId);
      if (match) {
        const langMatch = ChallengeService.getChallengeForLanguage(match, profile.selectedLanguage);
        setActiveChallengeId(langMatch.id);
      } else {
        setActiveChallengeId(challengeId);
      }
    } else {
      const rec = ChallengeService.getNextRecommendedChallenge(
        profile.solvedChallengeIds,
        profile.selectedLanguage
      );
      setActiveChallengeId(rec.id);
    }
    setCurrentTab('hunt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimQuest = (questId: string) => {
    const updatedQuests = profile.dailyQuests.map((q) => {
      if (q.id === questId && q.completed && !q.claimed) {
        profile.xp += q.xp;
        return { ...q, claimed: true };
      }
      return q;
    });
    const updated = { ...profile, dailyQuests: updatedQuests };
    StorageService.saveProfile(updated);
    setProfile({ ...updated });
  };

  const recommended = ChallengeService.getNextRecommendedChallenge(
    profile.solvedChallengeIds,
    profile.selectedLanguage
  );

  return (
    <div className="min-h-screen flex flex-col bg-phantom-midnight text-phantom-white selection:bg-phantom-purple selection:text-white transition-colors duration-300">
      {/* Top Streamlined Navigation Bar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(true)}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onChangeLanguage={handleChangeLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Collapsible Navigation Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onChangeLanguage={handleChangeLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <LandingPage
            onEnterArena={(id) => handleStartHunt(id)}
            onExploreMissions={() => setCurrentTab('missions')}
            onExploreLearn={() => setCurrentTab('learn')}
            onOpenLeaderboard={() => setCurrentTab('leaderboard')}
            onOpenReports={() => setCurrentTab('reports')}
            profile={profile}
            activityHistory={activityHistory}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            profile={profile}
            recommendedChallenge={recommended}
            activityHistory={activityHistory}
            onStartHunt={handleStartHunt}
            onStartLearn={() => setCurrentTab('learn')}
            onOpenMissions={() => setCurrentTab('missions')}
            onOpenAchievements={() => setCurrentTab('achievements')}
            onClaimQuest={handleClaimQuest}
          />
        )}

        {currentTab === 'hunt' && (
          <HuntPage
            initialChallengeId={activeChallengeId}
            profile={profile}
            onUpdateProfile={(up) => {
              setProfile(up);
              setActivityHistory(StorageService.getActivityHistory());
            }}
            onBackToMissions={() => setCurrentTab('missions')}
          />
        )}

        {currentTab === 'learn' && (
          <LearnPage
            profile={profile}
            onUpdateProfile={(up) => {
              setProfile(up);
              setActivityHistory(StorageService.getActivityHistory());
            }}
            onSwitchToHunt={handleStartHunt}
          />
        )}

        {currentTab === 'missions' && (
          <MissionMapPage
            profile={profile}
            onSelectChallenge={(id) => handleStartHunt(id)}
          />
        )}

        {currentTab === 'revisions' && (
          <ErrorRevisionPage
            profile={profile}
            onOpenCase={handleStartHunt}
            onRefreshProfile={() => setProfile(StorageService.getProfile())}
          />
        )}

        {currentTab === 'encyclopedia' && (
          <BugEncyclopediaPage />
        )}

        {currentTab === 'dna' && (
          <BugDNAPage
            profile={profile}
            onOpenRecommendedCase={() => handleStartHunt()}
          />
        )}

        {currentTab === 'leaderboard' && <LeaderboardPage profile={profile} />}

        {currentTab === 'reports' && (
          <ReportsPage profile={profile} activityHistory={activityHistory} />
        )}

        {currentTab === 'achievements' && <AchievementsPage profile={profile} />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={(up) => setProfile(up)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        profile={profile}
        onUpdateProfile={(up) => setProfile(up)}
        onStartOnboarding={() => setIsOnboardingOpen(true)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        profile={profile}
        onComplete={(up) => {
          setProfile(up);
          setIsOnboardingOpen(false);
          setCurrentTab('dashboard');
        }}
      />
    </div>
  );
}

export default App;
