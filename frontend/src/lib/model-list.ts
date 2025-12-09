export type ModelInfo = {
    id: string;
    type: "text-generation" | "speech-to-text" | "embedding";
}

const OPENAI_MODELS: ModelInfo[] = [
    {
        id: "gpt-5",
        type: "text-generation",
    },
    {
        id: "gpt-5-mini",
        type: "text-generation",
    },
    {
        id: "gpt-5-nano",
        type: "text-generation",
    },
    {
        id: "gpt-4.1",
        type: "text-generation",
    },
    {
        id: "gpt-4.1-mini",
        type: "text-generation",
    },
    {
        id: "o4-mini",
        type: "text-generation",
    },
    {
        id: "gpt-4o",
        type: "text-generation",
    },
    {
        id: "text-embedding-3-large",
        type: "embedding",
    },
    {
        id: "text-embedding-3-small",
        type: "embedding",
    },
]

const GEMINI_MODELS: ModelInfo[] = [
    {
        id: "models/gemini-2.5-pro",
        type: "text-generation",
    },
    {
        id: "models/gemini-flash-latest",
        type: "text-generation",
    },
    {
        id: "models/gemini-flash-lite-latest",
        type: "text-generation",
    },
    {
        id: "models/gemini-2.5-flash",
        type: "text-generation",
    },
    {
        id: "models/gemini-2.5-flash-lite",
        type: "text-generation",
    },
]

const GROQ_MODELS: ModelInfo[] = [
    {
        id: "openai/gpt-oss-120b",
        type: "text-generation",
    },
    {
        id: "openai/gpt-oss-20b",
        type: "text-generation",
    },
    {
        id: "meta-llama/llama-4-maverick-17b-128e-instruct",
        type: "text-generation",
    },
    {
        id: "meta-llama/llama-4-scout-17b-16e-instruct",
        type: "text-generation",
    },
    {
        id: "llama-3.3-70b-versatile",
        type: "text-generation",
    },
    {
        id: "whisper-large-v3",
        type: "speech-to-text",
    },
    {
        id: "whisper-large-v3-turbo",
        type: "speech-to-text",
    },

]

export const MODEL_LIST: Record<string, ModelInfo[]> = {
    openai: OPENAI_MODELS,
    gemini: GEMINI_MODELS,
    groq: GROQ_MODELS,
}

export const PROVIDER_BASE_URLS: { provider: string, baseUrl: string }[] = [
    {
        "provider": "openai",
        "baseUrl": "https://api.openai.com/v1",
    },
    {
        "provider": "gemini",
        "baseUrl": "https://generativelanguage.googleapis.com/v1",
    },
    {
        "provider": "groq",
        "baseUrl": "https://api.groq.com/openai/v1",
    },
    {
        "provider": "openrouter",
        "baseUrl": "https://openrouter.ai/api/v1",
    },
    {
        "provider": "replicate",
        "baseUrl": "https://api.replicate.com/v1",
    },
    {
        "provider": "mistral",
        "baseUrl": "https://api.mistral.ai/v1",
    },
    {
        "provider": "anthropic",
        "baseUrl": "https://api.anthropic.com/v1",
    }
]