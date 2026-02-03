"use client";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { useVideoCreator } from "./hooks/use-video-creator";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LayoutDashboard } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";

import {
  ProjectNameCard, SectionHeader, InputMethodsCard, FileUploadCard,
  AvatarSelectorCard, OutputFormatCard, TrainingTypeCard, VideoPreviewModal,
  StickyFooter, AlertMessages,
} from "./components";

export default function VideoCreatorV2Page() {
  const { projectedBalance, mutate: mutateUserProfile } = useUserProfile();
  
  const {
    replicas, loadingReplicas, files, urls, newUrl, selectedReplica,
    videoLength, language, videoPosition, videoSize, targetAudience,
    topic, keywords, projectName, projectError, trainingType,
    customTrainingType, customTrainingOptions, generating, statusMessage,
    error, success, previewVideo, previewReplicaName,
    canGenerate,
    setFiles, setUrls, setNewUrl, setSelectedReplica, setVideoLength,
    setLanguage, setVideoPosition, setVideoSize, setTargetAudience,
    setTopic, setKeywords, setPreviewVideo, setTrainingType,
    setCustomTrainingType, setCustomTrainingOptions, handleGenerate,
    handlePlayVideo, handleProjectNameChange, calculateTotalCredits,
    primaryFocus, setPrimaryFocus,
    showSuccessModal, handleModalAccept, handleModalCancel
  } = useVideoCreator();

  // USAMOS EL BALANCE PROYECTADO PARA EL BLINDAJE
  const currentBalance = projectedBalance ?? 0;
  const totalRequired = calculateTotalCredits();
  const hasEnoughCredits = currentBalance >= totalRequired;

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className="p-4">
        <AppHeader />
        <div className="py-8">
          <div className="text-center mb-12">
            <h1 className="mt-8 mb-4 text-5xl font-medium text-[#080936]">Simple Inputs, Extraordinary Results</h1>
          </div>

          <AlertMessages error={error ?? ""} success={success ?? ""} />

          <ProjectNameCard projectName={projectName} projectError={projectError} onProjectNameChange={handleProjectNameChange} />
          
          <SectionHeader number={1} title="Choose your input methods." />
          <InputMethodsCard topic={topic} keywords={keywords} targetAudience={targetAudience} onTopicChange={setTopic} onKeywordsChange={setKeywords} onTargetAudienceChange={setTargetAudience} />

          <SectionHeader number={2} title="Upload Documents" className="mt-16" />
          <FileUploadCard files={files} urls={urls} newUrl={newUrl} primaryFocus={primaryFocus} onFilesChange={setFiles} onUrlsChange={setUrls} onNewUrlChange={setNewUrl} onPrimaryFocusChange={setPrimaryFocus} />

          <SectionHeader number={3} title="Choose Your Studio-Grade Avatar" subtitle="Pick the digital avatar who will deliver your content." className="mt-16" />
        
          <AvatarSelectorCard replicas={replicas} loadingReplicas={loadingReplicas} selectedReplica={selectedReplica} onSelectReplica={setSelectedReplica} onPlayVideo={handlePlayVideo} />

          <SectionHeader number={4} title="Output Format" className="mt-16" />
          <OutputFormatCard videoLength={videoLength} videoPosition={videoPosition} videoSize={videoSize} language={language} onVideoLengthChange={setVideoLength} onVideoPositionChange={setVideoPosition} onVideoSizeChange={setVideoSize} onLanguageChange={setLanguage} />

          <TrainingTypeCard trainingType={trainingType} customTrainingType={customTrainingType} customTrainingOptions={customTrainingOptions} onTrainingTypeChange={setTrainingType} onCustomTrainingChange={setCustomTrainingType} onCustomTrainingOptionsChange={setCustomTrainingOptions} />
        </div>

        <VideoPreviewModal previewVideo={previewVideo} previewReplicaName={previewReplicaName} onClose={() => setPreviewVideo(null)} />
        
        <Dialog open={showSuccessModal} onOpenChange={handleModalCancel}>
          <DialogContent className="bg-white rounded-[24px] p-8 border-none shadow-2xl max-w-sm flex flex-col items-center text-center outline-none">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-[#080936]">Project Started!</DialogTitle>
            <DialogDescription className="text-[#3E4462] mt-4 mb-8 text-base leading-relaxed">
              The process may take a few minutes. You can continue creating more projects in the meantime.
            </DialogDescription>
            
            <div className="flex flex-col w-full gap-3">
              <Button onClick={handleModalAccept} className="w-full rounded-xl bg-[#6D58BB] px-8 py-7 text-lg text-white hover:bg-[#080936]">
                <LayoutDashboard className="w-5 h-5 mr-2" /> Go To Dashboard
              </Button>
              <Button variant="ghost" onClick={handleModalCancel} className="w-full rounded-xl px-8 py-6 text-base text-gray-500 hover:bg-gray-100">
                Create new project
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AppFooter />
      </div>

      <StickyFooter
        totalCredits={totalRequired}
        availableCredits={currentBalance}
        generating={generating}
        canGenerate={canGenerate && hasEnoughCredits}
        hasEnoughCredits={hasEnoughCredits}
        onGenerate={async () => {
          await handleGenerate(currentBalance);
          mutateUserProfile();
        }}
        statusMessage={statusMessage}
      />
    </div>
  );
}