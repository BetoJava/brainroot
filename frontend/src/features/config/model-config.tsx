// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { api } from "@/trpc/react";
// import { MODEL_LIST, type ModelInfo } from "@/lib/model-list";
// import { toast } from "sonner";
// import { Spinner } from "@/components/ui/spinner";

// export function ModelConfig() {
//   const [llmModel, setLlmModel] = useState("");
//   const [sttModel, setSttModel] = useState("");
//   const [whisperPrompt, setWhisperPrompt] = useState("");
//   const [embeddingModel, setEmbeddingModel] = useState("");

//   const [initialLlmModel, setInitialLlmModel] = useState("");
//   const [initialSttModel, setInitialSttModel] = useState("");
//   const [initialWhisperPrompt, setInitialWhisperPrompt] = useState("");
//   const [initialEmbeddingModel, setInitialEmbeddingModel] = useState("");

//   const { data: defaultModels, isLoading } = api.config.getDefaultModels.useQuery();
//   const { data: activeModelsData } = api.config.getProviderActiveModels.useQuery();
  
//   const setDefaultLLMMutation = api.config.setDefaultLLM.useMutation();
//   const setDefaultSTTMutation = api.config.setDefaultSTT.useMutation();
//   const setDefaultEmbeddingMutation = api.config.setDefaultEmbedding.useMutation();
//   const setWhisperPromptMutation = api.config.setWhisperPrompt.useMutation();

//   // Initialize from database
//   useEffect(() => {
//     if (defaultModels) {
//       const llm = defaultModels.llmModel || "";
//       const stt = defaultModels.sttModel || "";
//       const whisper = defaultModels.whisperPrompt || "";
//       const embedding = defaultModels.embeddingModel || "";
      
//       setLlmModel(llm);
//       setSttModel(stt);
//       setWhisperPrompt(whisper);
//       setEmbeddingModel(embedding);
      
//       setInitialLlmModel(llm);
//       setInitialSttModel(stt);
//       setInitialWhisperPrompt(whisper);
//       setInitialEmbeddingModel(embedding);
//     }
//   }, [defaultModels]);

//   // Get available models filtered by type and active status
//   const availableModels = useMemo(() => {
//     if (!activeModelsData) return { textGeneration: [], speechToText: [], embedding: [] };

//     const textGeneration: Array<{ id: string; provider: string }> = [];
//     const speechToText: Array<{ id: string; provider: string }> = [];
//     const embedding: Array<{ id: string; provider: string }> = [];

//     Object.entries(activeModelsData).forEach(([provider, activeModelIds]) => {
//       const providerModels = MODEL_LIST[provider] || [];
      
//       (activeModelIds as string[]).forEach((modelId: string) => {
//         const model = providerModels.find((m) => m.id === modelId);
//         if (!model) return;

//         const modelData = { id: modelId, provider };
        
//         if (model.type === "text-generation") {
//           textGeneration.push(modelData);
//         } else if (model.type === "speech-to-text") {
//           speechToText.push(modelData);
//         } else if (model.type === "embedding") {
//           embedding.push(modelData);
//         }
//       });
//     });

//     return { textGeneration, speechToText, embedding };
//   }, [activeModelsData]);

//   const handleSaveLLM = async () => {
//     try {
//       await setDefaultLLMMutation.mutateAsync({ llmModel });
//       setInitialLlmModel(llmModel);
//       toast.success("Modèle LLM enregistré");
//     } catch (error) {
//       console.error("Error saving LLM model:", error);
//       toast.error("Erreur lors de l'enregistrement");
//     }
//   };

//   const handleSaveSTT = async () => {
//     try {
//       await setDefaultSTTMutation.mutateAsync({ sttModel });
//       setInitialSttModel(sttModel);
//       toast.success("Modèle STT enregistré");
//     } catch (error) {
//       console.error("Error saving STT model:", error);
//       toast.error("Erreur lors de l'enregistrement");
//     }
//   };

//   const handleSaveWhisperPrompt = async () => {
//     try {
//       await setWhisperPromptMutation.mutateAsync({ whisperPrompt });
//       setInitialWhisperPrompt(whisperPrompt);
//       toast.success("Prompt Whisper enregistré");
//     } catch (error) {
//       console.error("Error saving Whisper prompt:", error);
//       toast.error("Erreur lors de l'enregistrement");
//     }
//   };

//   const handleSaveEmbedding = async () => {
//     try {
//       await setDefaultEmbeddingMutation.mutateAsync({ embeddingModel });
//       setInitialEmbeddingModel(embeddingModel);
//       toast.success("Modèle d'embedding enregistré");
//     } catch (error) {
//       console.error("Error saving embedding model:", error);
//       toast.error("Erreur lors de l'enregistrement");
//     }
//   };

//   if (isLoading) {
//     return <div className="space-y-6">Chargement...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold tracking-tight">Modèles</h1>
//         <p className="text-muted-foreground">
//           Gérez vos modèles par défaut.
//         </p>
//       </div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Modèle LLM par défaut</CardTitle>
//           <CardDescription>
//             Sélectionnez le modèle de génération de texte par défaut
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="llm-model">Modèle Text-to-Text</Label>
//             <Select value={llmModel} onValueChange={setLlmModel}>
//               <SelectTrigger id="llm-model">
//                 <SelectValue placeholder="Sélectionnez un modèle" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableModels.textGeneration.map((model) => (
//                   <SelectItem key={model.id} value={model.id}>
//                     {model.id} ({model.provider})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <Button 
//             onClick={handleSaveLLM} 
//             disabled={!llmModel || llmModel === initialLlmModel || setDefaultLLMMutation.isPending}
//           >
//             {setDefaultLLMMutation.isPending ? (
//               <>
//                 <Spinner className="mr-2" />
//                 Enregistrement...
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Modèle STT par défaut</CardTitle>
//           <CardDescription>
//             Sélectionnez le modèle de transcription audio par défaut
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="stt-model">Modèle Speech-to-Text</Label>
//             <Select value={sttModel} onValueChange={setSttModel}>
//               <SelectTrigger id="stt-model">
//                 <SelectValue placeholder="Sélectionnez un modèle" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableModels.speechToText.map((model) => (
//                   <SelectItem key={model.id} value={model.id}>
//                     {model.id} ({model.provider})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <Button 
//             onClick={handleSaveSTT} 
//             disabled={!sttModel || sttModel === initialSttModel || setDefaultSTTMutation.isPending}
//           >
//             {setDefaultSTTMutation.isPending ? (
//               <>
//                 <Spinner className="mr-2" />
//                 Enregistrement...
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Modèle Embedding par défaut</CardTitle>
//           <CardDescription>
//             Sélectionnez le modèle d'embedding par défaut pour la recherche sémantique
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="embedding-model">Modèle Embedding</Label>
//             <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
//               <SelectTrigger id="embedding-model">
//                 <SelectValue placeholder="Sélectionnez un modèle" />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableModels.embedding.map((model) => (
//                   <SelectItem key={model.id} value={model.id}>
//                     {model.id} ({model.provider})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <Button 
//             onClick={handleSaveEmbedding} 
//             disabled={!embeddingModel || embeddingModel === initialEmbeddingModel || setDefaultEmbeddingMutation.isPending}
//           >
//             {setDefaultEmbeddingMutation.isPending ? (
//               <>
//                 <Spinner className="mr-2" />
//                 Enregistrement...
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>(optionnel) Prompt Whisper</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Textarea
//               id="whisper-prompt"
//               placeholder="Brainroot Divindata"
//               value={whisperPrompt}
//               onChange={(e) => setWhisperPrompt(e.target.value)}
//               rows={4}
//               className="resize-none"
//             />
//             <p className="text-sm text-muted-foreground">
//               Lister jusqu'à 20 mots, cela permet d'améliorer la transcription de ces mots dans l'audio.
//             </p>
//           </div>
//           <Button 
//             onClick={handleSaveWhisperPrompt}
//             disabled={whisperPrompt === initialWhisperPrompt || setWhisperPromptMutation.isPending}
//           >
//             {setWhisperPromptMutation.isPending ? (
//               <>
//                 <Spinner className="mr-2" />
//                 Enregistrement...
//               </>
//             ) : (
//               "Enregistrer"
//             )}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

