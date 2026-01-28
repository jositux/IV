"use client"
import { AppHeader } from "@/components/shared/app-header"
import { AppFooter } from "@/components/shared/app-footer"
import { useVideoCreator } from "./hooks/use-video-creator2"
import {
  ProjectNameCard,
  SectionHeader,
  InputMethodsCard,
  GeneratedScriptCard,
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
    error, success, previewVideo, previewReplicaName, //generatedScript,
    //scriptId, 
    availableCredits, hasEnoughCredits, canGenerate,
    setFiles, setUrls, setNewUrl, setSelectedReplica, setVideoLength,
    setLanguage, setVideoPosition, setVideoSize, setTargetAudience,
    setTopic, setKeywords, setPreviewVideo, setTrainingType,
    setCustomTrainingType, setCustomTrainingOptions, handleGenerate,
    handlePlayVideo, handleProjectNameChange, calculateTotalCredits,
    primaryFocus, setPrimaryFocus
  } = useVideoCreator()

  return (
    <div className="min-h-screen bg-[#F6F6F6] p-4">
      <AppHeader />
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="mb-4 text-5xl font-medium text-[#080936]">Simple Inputs, Extraordinary Results</h1>
        </div>

        <AlertMessages error={error ?? ""} success={success ?? ""} />

        <ProjectNameCard projectName={projectName} projectError={projectError} onProjectNameChange={handleProjectNameChange} />

        <SectionHeader number={1} title="Choose your input methods." />

        <InputMethodsCard
          topic={topic}
          keywords={keywords}
          targetAudience={targetAudience}
          onTopicChange={setTopic}
          onKeywordsChange={setKeywords}
          onTargetAudienceChange={setTargetAudience}
        />

        {/*<GeneratedScriptCard generatedScript={generatedScript} scriptId={scriptId} />*/}

        <SectionHeader number={2} title="Upload Documents" className="mt-16" />

        <FileUploadCard
          files={files}
          urls={urls}
          newUrl={newUrl}
          primaryFocus={primaryFocus}
          onFilesChange={setFiles}
          onUrlsChange={setUrls}
          onNewUrlChange={setNewUrl}
          onPrimaryFocusChange={setPrimaryFocus}
        />

        <SectionHeader number={3} title="Choose Avatar" className="mt-16" />

        <AvatarSelectorCard
          replicas={replicas}
          loadingReplicas={loadingReplicas}
          selectedReplica={selectedReplica}
          onSelectReplica={setSelectedReplica}
          onPlayVideo={handlePlayVideo}
        />

        <SectionHeader number={4} title="Output Format" className="mt-16" />

        <OutputFormatCard
          videoLength={videoLength}
          videoPosition={videoPosition}
          videoSize={videoSize}
          language={language}
          onVideoLengthChange={setVideoLength}
          onVideoPositionChange={setVideoPosition}
          onVideoSizeChange={setVideoSize}
          onLanguageChange={setLanguage}
        />

        <TrainingTypeCard
          trainingType={trainingType}
          customTrainingType={customTrainingType}
          customTrainingOptions={customTrainingOptions}
          onTrainingTypeChange={setTrainingType}
          onCustomTrainingChange={setCustomTrainingType}
          onCustomTrainingOptionsChange={setCustomTrainingOptions}
        />
      </div>

      <VideoPreviewModal previewVideo={previewVideo} previewReplicaName={previewReplicaName} onClose={() => setPreviewVideo(null)} />
      <AppFooter />
      <StickyFooter
        totalCredits={calculateTotalCredits()}
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