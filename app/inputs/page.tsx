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
  TargetAudienceCard,
  //AdditionalProductsCard,
  VideoPreviewModal,
  StickyFooter,
  AlertMessages,
} from "./components"

export default function VideoCreatorV2Page() {
  const {
    replicas,
    loadingReplicas,
    files,
    urls,
    newUrl,
    selectedReplica,
    videoLength,
    language,
    selectedProducts,
    videoPosition,
    videoSize,
    primaryFocus,
    topic,
    keywordPhrases,
    audience,
    generating,
    error,
    success,
    previewVideo,
    previewReplicaName,
    generatedScript,
    scriptId,
    projectName,
    projectError,
    targetAudience,
    customAudience,
    customAudienceOptions,
    canGenerate,
    setFiles,
    setUrls,
    setNewUrl,
    setSelectedReplica,
    setVideoLength,
    setLanguage,
    setVideoPosition,
    setVideoSize,
    setPrimaryFocus,
    setTopic,
    setKeywordPhrases,
    setAudience,
    setPreviewVideo,
    setTargetAudience,
    setCustomAudience,
    setCustomAudienceOptions,
    handleGenerate,
    handlePlayVideo,
    toggleProduct,
    handleProjectNameChange,
    calculateTotalCredits,
  } = useVideoCreator()

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className="min-h-screen p-4">
        <AppHeader />
        <div className="py-8">
          <div className="text-center mb-12">
            <h1 className="mb-4 text-5xl font-medium text-[#080936]">
              Simple Inputs, Extraordinary Results
            </h1>
            <p className="text-base sm:text-lg text-[#3E4462] font-regular max-w-2xl mx-auto tracking-tight leading-6">
              Our AGI-powered platform needs minimal input to generate results
              that are more human than human
            </p>
          </div>

          <AlertMessages  error={error ?? ""}
  success={success ?? ""} />

          <ProjectNameCard
            projectName={projectName}
            projectError={projectError}
            onProjectNameChange={handleProjectNameChange}
          />

          <SectionHeader
            number={1}
            title="Choose any one input method below or combine multiple to better align with your specific vision."
          />

          <InputMethodsCard
            topic={topic}
            keywordPhrases={keywordPhrases}
            audience={audience}
            onTopicChange={setTopic}
            onKeywordPhrasesChange={setKeywordPhrases}
            onAudienceChange={setAudience}
          />

          <GeneratedScriptCard
            generatedScript={generatedScript}
            scriptId={scriptId}
          />

          <SectionHeader
            number={2}
            title="Upload Documents and Web Urls Up to 20,000 words"
            className="mt-16"
          />

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

          <SectionHeader
            number={3}
            title="Choose Your Studio-Grade Avatar"
            subtitle="Pick the digital avatar who will deliver your content. Each has different voice, tone, and language."
            className="mt-16"
          />

          <AvatarSelectorCard
            replicas={replicas}
            loadingReplicas={loadingReplicas}
            selectedReplica={selectedReplica}
            onSelectReplica={setSelectedReplica}
            onPlayVideo={handlePlayVideo}
          />

          <SectionHeader
            number={4}
            title="Output Format"
            className="mt-16"
          />

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

          <TargetAudienceCard
            targetAudience={targetAudience}
            customAudience={customAudience}
            customAudienceOptions={customAudienceOptions}
            onTargetAudienceChange={setTargetAudience}
            onCustomAudienceChange={setCustomAudience}
            onCustomAudienceOptionsChange={setCustomAudienceOptions}
          />

          {/*<AdditionalProductsCard
            selectedProducts={selectedProducts}
            onToggleProduct={toggleProduct}
  />*/}
        </div>

        <VideoPreviewModal
          previewVideo={previewVideo}
          previewReplicaName={previewReplicaName}
          onClose={() => setPreviewVideo(null)}
        />

        <AppFooter />
      </div>

      <StickyFooter
        totalCredits={calculateTotalCredits()}
        generating={generating}
        canGenerate={canGenerate}
        onGenerate={handleGenerate}
      />
    </div>
  )
}
