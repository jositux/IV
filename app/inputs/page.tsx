"use client"
import { AppHeader } from "@/components/shared/app-header"
import { AppFooter } from "@/components/shared/app-footer"
import { useVideoCreator } from "./hooks/use-video-creator"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import {
  ProjectNameCard,
  SectionHeader,
  InputMethodsCard,
  FileUploadCard,
  AvatarSelectorCard,
  OutputFormatCard,
  TrainingTypeCard,
  VideoPreviewModal,
  StickyFooter,
  AlertMessages,
} from "./components"

export default function VideoCreatorV2Page() {
  const {
    replicas, loadingReplicas, files, urls, newUrl, selectedReplica,
    videoLength, language, videoPosition, videoSize, targetAudience,
    topic, keywords, projectName, projectError, trainingType,
    customTrainingType, customTrainingOptions, generating, statusMessage,
    error, success, previewVideo, previewReplicaName,
    availableCredits, canGenerate,
    setFiles, setUrls, setNewUrl, setSelectedReplica, setVideoLength,
    setLanguage, setVideoPosition, setVideoSize, setTargetAudience,
    setTopic, setKeywords, setPreviewVideo, setTrainingType,
    setCustomTrainingType, setCustomTrainingOptions, handleGenerate,
    handlePlayVideo, handleProjectNameChange, calculateTotalCredits,
    primaryFocus, setPrimaryFocus,
    showSuccessModal, handleModalAccept // Nuevos del hook
  } = useVideoCreator()

  const totalRequired = calculateTotalCredits();
  const isBalanceLoading = availableCredits === null;
  const hasEnoughCredits = isBalanceLoading ? true : availableCredits >= totalRequired;

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className=" p-4">
      <AppHeader />
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-5xl font-medium text-[#080936]">Simple Inputs, Extraordinary Results</h1>
        </div>

        <AlertMessages error={error ?? ""} success={success ?? ""} />

        <ProjectNameCard projectName={projectName} projectError={projectError} onProjectNameChange={handleProjectNameChange} />
        
        <SectionHeader number={1} title="Choose your input methods." />
        <InputMethodsCard topic={topic} keywords={keywords} targetAudience={targetAudience} onTopicChange={setTopic} onKeywordsChange={setKeywords} onTargetAudienceChange={setTargetAudience} />

        <SectionHeader number={2} title="Upload Documents" className="mt-16" />
        <FileUploadCard files={files} urls={urls} newUrl={newUrl} primaryFocus={primaryFocus} onFilesChange={setFiles} onUrlsChange={setUrls} onNewUrlChange={setNewUrl} onPrimaryFocusChange={setPrimaryFocus} />

        <SectionHeader number={3} title="Choose Your Studio-Grade Avatar" subtitle="Pick the digital avatar who will deliver your content. Each has different voice,tone, and language." className="mt-16" />
        <AvatarSelectorCard replicas={replicas} loadingReplicas={loadingReplicas} selectedReplica={selectedReplica} onSelectReplica={setSelectedReplica} onPlayVideo={handlePlayVideo} />

        <SectionHeader number={4} title="Output Format" className="mt-16" />
        <OutputFormatCard videoLength={videoLength} videoPosition={videoPosition} videoSize={videoSize} language={language} onVideoLengthChange={setVideoLength} onVideoPositionChange={setVideoPosition} onVideoSizeChange={setVideoSize} onLanguageChange={setLanguage} />

        <TrainingTypeCard trainingType={trainingType} customTrainingType={customTrainingType} customTrainingOptions={customTrainingOptions} onTrainingTypeChange={setTrainingType} onCustomTrainingChange={setCustomTrainingType} onCustomTrainingOptionsChange={setCustomTrainingOptions} />
      </div>

      {/* MODALES */}
      <VideoPreviewModal previewVideo={previewVideo} previewReplicaName={previewReplicaName} onClose={() => setPreviewVideo(null)} />
      
      <Dialog open={showSuccessModal} onOpenChange={handleModalAccept}>
        <DialogContent className="bg-white rounded-[24px] p-8 border-none shadow-2xl max-w-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-[#080936]">Project Started!</DialogTitle>
          <DialogDescription className="text-[#3E4462] mt-4 mb-6 text-base leading-relaxed">
            The process may take a few minutes. You can continue using the platform or start generating more projects in the meantime.
          </DialogDescription>
          <Button 
            onClick={handleModalAccept}
            className="w-full h-12 bg-[#6D58BB] hover:bg-[#080936] text-white font-bold rounded-xl transition-all"
          >
            Accept
          </Button>
        </DialogContent>
      </Dialog>

      <AppFooter />
      
     
      </div>
      <StickyFooter
        totalCredits={totalRequired}
        availableCredits={availableCredits} 
        generating={generating}
        canGenerate={canGenerate}
        hasEnoughCredits={hasEnoughCredits}
        onGenerate={handleGenerate}
        statusMessage={statusMessage}
      />
    </div>
  )
}