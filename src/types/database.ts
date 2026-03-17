export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          created_at: string;
          ended_at: string | null;
          summary: string | null;
          overall_tone: string | null;
          insights: string[] | null;
          classification: string | null;
          score: { overall: number; engagement: number; tone: number; fluidity: number; interest: number } | null;
          diagnosis: string | null;
          follow_up_actions: string[] | null;
          social_score: number | null;
          strengths: string[] | null;
          improvements: string[] | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          created_at?: string;
          ended_at?: string | null;
          summary?: string | null;
          overall_tone?: string | null;
          insights?: string[] | null;
          classification?: string | null;
          score?: { overall: number; engagement: number; tone: number; fluidity: number; interest: number } | null;
          diagnosis?: string | null;
          follow_up_actions?: string[] | null;
          social_score?: number | null;
          strengths?: string[] | null;
          improvements?: string[] | null;
        };
        Update: {
          title?: string;
          ended_at?: string | null;
          summary?: string | null;
          overall_tone?: string | null;
          insights?: string[] | null;
          classification?: string | null;
          score?: { overall: number; engagement: number; tone: number; fluidity: number; interest: number } | null;
          diagnosis?: string | null;
          follow_up_actions?: string[] | null;
          social_score?: number | null;
          strengths?: string[] | null;
          improvements?: string[] | null;
        };
      };
      analysis_segments: {
        Row: {
          id: string;
          conversation_id: string;
          timestamp: number;
          transcript: string;
          tone: "positive" | "neutral" | "negative" | "hesitant";
          confidence: number;
          suggestion: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          timestamp: number;
          transcript: string;
          tone: "positive" | "neutral" | "negative" | "hesitant";
          confidence: number;
          suggestion?: string | null;
          created_at?: string;
        };
        Update: {
          tone?: "positive" | "neutral" | "negative" | "hesitant";
          suggestion?: string | null;
        };
      };
    };
  };
};

export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type AnalysisSegment = Database["public"]["Tables"]["analysis_segments"]["Row"];
