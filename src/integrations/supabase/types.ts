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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          actor: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          new_state: Json | null
          previous_state: Json | null
          tenant_id: string
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          new_state?: Json | null
          previous_state?: Json | null
          tenant_id?: string
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_state?: Json | null
          previous_state?: Json | null
          tenant_id?: string
        }
        Relationships: []
      }
      beta_profiles: {
        Row: {
          channel_manager: string | null
          created_at: string
          defis: Json | null
          email: string
          id: string
          logements: string
          prenom: string
          source: string | null
          type_gestion: string
        }
        Insert: {
          channel_manager?: string | null
          created_at?: string
          defis?: Json | null
          email: string
          id?: string
          logements: string
          prenom: string
          source?: string | null
          type_gestion: string
        }
        Update: {
          channel_manager?: string | null
          created_at?: string
          defis?: Json | null
          email?: string
          id?: string
          logements?: string
          prenom?: string
          source?: string | null
          type_gestion?: string
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          author_email: string | null
          author_name: string | null
          created_at: string
          id: string
          likes: string | null
          missing: string | null
          priority: string | null
          rating: number
        }
        Insert: {
          author_email?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          likes?: string | null
          missing?: string | null
          priority?: string | null
          rating?: number
        }
        Update: {
          author_email?: string | null
          author_name?: string | null
          created_at?: string
          id?: string
          likes?: string | null
          missing?: string | null
          priority?: string | null
          rating?: number
        }
        Relationships: []
      }
      idea_votes: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          voter_identifier: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          voter_identifier: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          voter_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_votes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          author_email: string | null
          author_name: string
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
          votes_count: number
        }
        Insert: {
          author_email?: string | null
          author_name?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          votes_count?: number
        }
        Update: {
          author_email?: string | null
          author_name?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          votes_count?: number
        }
        Relationships: []
      }
      provider_invoice_calls: {
        Row: {
          access_token: string
          created_at: string
          id: string
          invoice_received_at: string | null
          month: string
          notes: string | null
          paid_at: string | null
          provider_id: string
          provider_invoice_number: string | null
          provider_invoice_pdf_url: string | null
          sent_at: string | null
          status: string
          tenant_id: string
          total_amount: number
          updated_at: string
          validated_at: string | null
        }
        Insert: {
          access_token?: string
          created_at?: string
          id?: string
          invoice_received_at?: string | null
          month: string
          notes?: string | null
          paid_at?: string | null
          provider_id: string
          provider_invoice_number?: string | null
          provider_invoice_pdf_url?: string | null
          sent_at?: string | null
          status?: string
          tenant_id?: string
          total_amount?: number
          updated_at?: string
          validated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          invoice_received_at?: string | null
          month?: string
          notes?: string | null
          paid_at?: string | null
          provider_id?: string
          provider_invoice_number?: string | null
          provider_invoice_pdf_url?: string | null
          sent_at?: string | null
          status?: string
          tenant_id?: string
          total_amount?: number
          updated_at?: string
          validated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_invoice_calls_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_missions: {
        Row: {
          agreed_price: number
          created_at: string
          description: string | null
          id: string
          invoice_call_id: string | null
          linked_reservation_id: string | null
          mission_date: string
          pricing_mode: string
          provider_id: string
          rental_id: string
          rental_name: string | null
          status: string
          tenant_id: string
          type: string
          updated_at: string
        }
        Insert: {
          agreed_price?: number
          created_at?: string
          description?: string | null
          id?: string
          invoice_call_id?: string | null
          linked_reservation_id?: string | null
          mission_date: string
          pricing_mode?: string
          provider_id: string
          rental_id: string
          rental_name?: string | null
          status?: string
          tenant_id?: string
          type: string
          updated_at?: string
        }
        Update: {
          agreed_price?: number
          created_at?: string
          description?: string | null
          id?: string
          invoice_call_id?: string | null
          linked_reservation_id?: string | null
          mission_date?: string
          pricing_mode?: string
          provider_id?: string
          rental_id?: string
          rental_name?: string | null
          status?: string
          tenant_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_missions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          created_at: string
          default_pricing_mode: string
          default_rate: number | null
          email: string | null
          iban: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          tenant_id: string
          type: string
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          created_at?: string
          default_pricing_mode?: string
          default_rate?: number | null
          email?: string | null
          iban?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          tenant_id?: string
          type: string
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          created_at?: string
          default_pricing_mode?: string
          default_rate?: number | null
          email?: string | null
          iban?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          tenant_id?: string
          type?: string
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      signature_events: {
        Row: {
          actor: string | null
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          actor?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          actor?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "signature_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_sessions: {
        Row: {
          commission_rate: number | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          field_values: Json
          id: string
          onboarding_process_id: string | null
          owner_email: string | null
          owner_name: string | null
          property_address: string | null
          sent_at: string | null
          signed_at: string | null
          signed_document_url: string | null
          signer_ip: string | null
          status: string
          template_id: string | null
          token: string
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          field_values?: Json
          id?: string
          onboarding_process_id?: string | null
          owner_email?: string | null
          owner_name?: string | null
          property_address?: string | null
          sent_at?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          signer_ip?: string | null
          status?: string
          template_id?: string | null
          token: string
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          field_values?: Json
          id?: string
          onboarding_process_id?: string | null
          owner_email?: string | null
          owner_name?: string | null
          property_address?: string | null
          sent_at?: string | null
          signed_at?: string | null
          signed_document_url?: string | null
          signer_ip?: string | null
          status?: string
          template_id?: string | null
          token?: string
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "signature_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          document_content: string | null
          document_url: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_content?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_content?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      signature_zone_data: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          session_id: string
          signer_ip: string | null
          value: string | null
          zone_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          session_id: string
          signer_ip?: string | null
          value?: string | null
          zone_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          session_id?: string
          signer_ip?: string | null
          value?: string | null
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_zone_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "signature_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_zone_data_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "signature_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_zones: {
        Row: {
          created_at: string
          field_key: string | null
          height: number
          id: string
          is_required: boolean
          label: string
          page_number: number
          role: string
          sort_order: number
          template_id: string
          width: number
          x_position: number
          y_position: number
          zone_type: string
        }
        Insert: {
          created_at?: string
          field_key?: string | null
          height?: number
          id?: string
          is_required?: boolean
          label: string
          page_number?: number
          role: string
          sort_order?: number
          template_id: string
          width?: number
          x_position?: number
          y_position?: number
          zone_type: string
        }
        Update: {
          created_at?: string
          field_key?: string | null
          height?: number
          id?: string
          is_required?: boolean
          label?: string
          page_number?: number
          role?: string
          sort_order?: number
          template_id?: string
          width?: number
          x_position?: number
          y_position?: number
          zone_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_zones_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "signature_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      welcome_guide_templates: {
        Row: {
          created_at: string
          group_id: string | null
          house_rules: Json | null
          id: string
          is_active: boolean
          landing_config: Json | null
          name: string
          property_id: string | null
          property_name: string | null
          steps: Json
          updated_at: string
          upsells: Json
          welcome_message: string
          wifi_name: string | null
          wifi_password: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          house_rules?: Json | null
          id?: string
          is_active?: boolean
          landing_config?: Json | null
          name: string
          property_id?: string | null
          property_name?: string | null
          steps?: Json
          updated_at?: string
          upsells?: Json
          welcome_message?: string
          wifi_name?: string | null
          wifi_password?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          house_rules?: Json | null
          id?: string
          is_active?: boolean
          landing_config?: Json | null
          name?: string
          property_id?: string | null
          property_name?: string | null
          steps?: Json
          updated_at?: string
          upsells?: Json
          welcome_message?: string
          wifi_name?: string | null
          wifi_password?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
