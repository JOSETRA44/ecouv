export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          location: string | null
          starts_at: string | null
          title: string
        }
        Insert: {
          activity_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          starts_at?: string | null
          title: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          location?: string | null
          starts_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_assignments: {
        Row: {
          activity_id: string
          created_at: string
          duty: string | null
          id: string
          profile_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          duty?: string | null
          id?: string
          profile_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          duty?: string | null
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_assignments_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          activity_id: string
          checked_by: string | null
          checked_in_at: string
          id: string
          profile_id: string
        }
        Insert: {
          activity_id: string
          checked_by?: string | null
          checked_in_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          activity_id?: string
          checked_by?: string | null
          checked_in_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          activity_id: string | null
          caption: string | null
          created_at: string
          id: string
          profile_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["evidence_status"]
          storage_path: string
          taken_at: string | null
        }
        Insert: {
          activity_id?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          profile_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["evidence_status"]
          storage_path: string
          taken_at?: string | null
        }
        Update: {
          activity_id?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["evidence_status"]
          storage_path?: string
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_events: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          id: string
          is_open: boolean
          slug: string
          starts_at: string | null
          title: string
          venue: string | null
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          is_open?: boolean
          slug: string
          starts_at?: string | null
          title: string
          venue?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          is_open?: boolean
          slug?: string
          starts_at?: string | null
          title?: string
          venue?: string | null
        }
        Relationships: []
      }
      forum_registrations: {
        Row: {
          affiliation: Database["public"]["Enums"]["affiliation_type"]
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          organization: string | null
        }
        Insert: {
          affiliation?: Database["public"]["Enums"]["affiliation_type"]
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          organization?: string | null
        }
        Update: {
          affiliation?: Database["public"]["Enums"]["affiliation_type"]
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          organization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "forum_events"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_seat_counts: {
        Row: {
          capacity: number
          event_id: string
          registered: number
        }
        Insert: {
          capacity: number
          event_id: string
          registered?: number
        }
        Update: {
          capacity?: number
          event_id?: string
          registered?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_seat_counts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "forum_events"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          section: Database["public"]["Enums"]["course_section"]
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          section: Database["public"]["Enums"]["course_section"]
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          section?: Database["public"]["Enums"]["course_section"]
        }
        Relationships: []
      }
      materials: {
        Row: {
          category: string | null
          cover_image_path: string | null
          created_at: string
          description: string
          file_size_bytes: number
          id: string
          mime_type: string
          published_at: string
          slug: string
          storage_path: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          cover_image_path?: string | null
          created_at?: string
          description: string
          file_size_bytes: number
          id?: string
          mime_type: string
          published_at?: string
          slug: string
          storage_path: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          cover_image_path?: string | null
          created_at?: string
          description?: string
          file_size_bytes?: number
          id?: string
          mime_type?: string
          published_at?: string
          slug?: string
          storage_path?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          cui: string | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          section: Database["public"]["Enums"]["course_section"] | null
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          cui?: string | null
          email: string
          full_name?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          section?: Database["public"]["Enums"]["course_section"] | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          cui?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          section?: Database["public"]["Enums"]["course_section"] | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
        }
        Relationships: []
      }
      uv_readings: {
        Row: {
          created_at: string
          id: number
          source: string
          taken_at: string
          uv_index: number
        }
        Insert: {
          created_at?: string
          id?: never
          source?: string
          taken_at: string
          uv_index: number
        }
        Update: {
          created_at?: string
          id?: never
          source?: string
          taken_at?: string
          uv_index?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      affiliation_type: "interno" | "externo"
      course_section: "A" | "B"
      evidence_status: "pending" | "approved" | "rejected"
      member_status: "pending" | "active" | "rejected"
      user_role: "coordinator" | "brigadista"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      affiliation_type: ["interno", "externo"],
      course_section: ["A", "B"],
      evidence_status: ["pending", "approved", "rejected"],
      member_status: ["pending", "active", "rejected"],
      user_role: ["coordinator", "brigadista"],
    },
  },
} as const
