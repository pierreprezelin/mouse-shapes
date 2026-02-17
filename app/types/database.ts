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
      models: {
        Row: {
          acceleration: number | null
          brand: Database["public"]["Enums"]["brand"]
          connectivity: Database["public"]["Enums"]["connectivity"]
          created_at: string
          dpi: number | null
          front_flare: Database["public"]["Enums"]["front_flare"] | null
          hand_compatibility: Database["public"]["Enums"]["hand_compatibility"]
          height: number
          hotswap_switches: boolean | null
          hump_location: Database["public"]["Enums"]["hump_location"] | null
          id: number
          length: number
          material: Database["public"]["Enums"]["material"] | null
          middle_buttons: number
          name: string
          path_side: string | null
          path_top: string | null
          polling_rate: number | null
          ring_finger_rest: boolean
          sensor: Database["public"]["Enums"]["sensor"] | null
          sensor_position: Database["public"]["Enums"]["sensor_position"] | null
          sensor_technology:
            | Database["public"]["Enums"]["sensor_technology"]
            | null
          shape: Database["public"]["Enums"]["shape"]
          side_buttons: number
          side_curvature: Database["public"]["Enums"]["side_curvature"] | null
          slug: string | null
          switches: Database["public"]["Enums"]["switches"] | null
          thumb_rest: boolean
          tracking_speed: number | null
          viewbox_height_side: number
          viewbox_height_top: number
          viewbox_width_side: number
          viewbox_width_top: number
          weight: number
          width: number
        }
        Insert: {
          acceleration?: number | null
          brand: Database["public"]["Enums"]["brand"]
          connectivity: Database["public"]["Enums"]["connectivity"]
          created_at?: string
          dpi?: number | null
          front_flare?: Database["public"]["Enums"]["front_flare"] | null
          hand_compatibility?: Database["public"]["Enums"]["hand_compatibility"]
          height?: number
          hotswap_switches?: boolean | null
          hump_location?: Database["public"]["Enums"]["hump_location"] | null
          id?: number
          length?: number
          material?: Database["public"]["Enums"]["material"] | null
          middle_buttons?: number
          name: string
          path_side?: string | null
          path_top?: string | null
          polling_rate?: number | null
          ring_finger_rest?: boolean
          sensor?: Database["public"]["Enums"]["sensor"] | null
          sensor_position?:
            | Database["public"]["Enums"]["sensor_position"]
            | null
          sensor_technology?:
            | Database["public"]["Enums"]["sensor_technology"]
            | null
          shape: Database["public"]["Enums"]["shape"]
          side_buttons?: number
          side_curvature?: Database["public"]["Enums"]["side_curvature"] | null
          slug?: string | null
          switches?: Database["public"]["Enums"]["switches"] | null
          thumb_rest?: boolean
          tracking_speed?: number | null
          viewbox_height_side?: number
          viewbox_height_top?: number
          viewbox_width_side?: number
          viewbox_width_top?: number
          weight?: number
          width?: number
        }
        Update: {
          acceleration?: number | null
          brand?: Database["public"]["Enums"]["brand"]
          connectivity?: Database["public"]["Enums"]["connectivity"]
          created_at?: string
          dpi?: number | null
          front_flare?: Database["public"]["Enums"]["front_flare"] | null
          hand_compatibility?: Database["public"]["Enums"]["hand_compatibility"]
          height?: number
          hotswap_switches?: boolean | null
          hump_location?: Database["public"]["Enums"]["hump_location"] | null
          id?: number
          length?: number
          material?: Database["public"]["Enums"]["material"] | null
          middle_buttons?: number
          name?: string
          path_side?: string | null
          path_top?: string | null
          polling_rate?: number | null
          ring_finger_rest?: boolean
          sensor?: Database["public"]["Enums"]["sensor"] | null
          sensor_position?:
            | Database["public"]["Enums"]["sensor_position"]
            | null
          sensor_technology?:
            | Database["public"]["Enums"]["sensor_technology"]
            | null
          shape?: Database["public"]["Enums"]["shape"]
          side_buttons?: number
          side_curvature?: Database["public"]["Enums"]["side_curvature"] | null
          slug?: string | null
          switches?: Database["public"]["Enums"]["switches"] | null
          thumb_rest?: boolean
          tracking_speed?: number | null
          viewbox_height_side?: number
          viewbox_height_top?: number
          viewbox_width_side?: number
          viewbox_width_top?: number
          weight?: number
          width?: number
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
      brand:
        | "Asus"
        | "Corsair"
        | "Endgame Gear"
        | "Lamzu"
        | "Logitech"
        | "Ninjutso"
        | "Pwnage"
        | "Razer"
        | "Vaxee"
        | "Zowie"
      connectivity: "wired" | "wireless"
      front_flare:
        | "flat"
        | "inward_minimal"
        | "inward_moderate"
        | "inward_aggressive"
        | "outward_minimal"
        | "outward_moderate"
        | "outward_aggressive"
      hand_compatibility: "right" | "left" | "both"
      hump_location:
        | "center"
        | "back_minimal"
        | "back_moderate"
        | "back_aggressive"
      material: "plastic" | "magnesium" | "carbon_fiber"
      sensor:
        | "ASUS ROG AimPoint Pro"
        | "PixArt PAW3370"
        | "PixArt PMW3389"
        | "PixArt PMW3391"
        | "PixArt PAW3395"
        | "PixArt PAW3950"
        | "Logitech HERO 2"
        | "Logitech HERO 25K"
        | "Razer Focus Pro 30K"
      sensor_position:
        | "centered"
        | "adjustable"
        | "front_minimal"
        | "front_moderate"
        | "front_aggressive"
        | "back_minimal"
        | "back_moderate"
        | "back_aggressive"
      sensor_technology: "optical"
      shape: "symmetrical" | "ergonomic" | "hybrid"
      side_curvature:
        | "flat"
        | "inward_minimal"
        | "inward_moderate"
        | "inward_aggressive"
      switches: "mechanical" | "optical" | "inductive"
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
      brand: [
        "Asus",
        "Corsair",
        "Endgame Gear",
        "Lamzu",
        "Logitech",
        "Ninjutso",
        "Pwnage",
        "Razer",
        "Vaxee",
        "Zowie",
      ],
      connectivity: ["wired", "wireless"],
      front_flare: [
        "flat",
        "inward_minimal",
        "inward_moderate",
        "inward_aggressive",
        "outward_minimal",
        "outward_moderate",
        "outward_aggressive",
      ],
      hand_compatibility: ["right", "left", "both"],
      hump_location: [
        "center",
        "back_minimal",
        "back_moderate",
        "back_aggressive",
      ],
      material: ["plastic", "magnesium", "carbon_fiber"],
      sensor: [
        "ASUS ROG AimPoint Pro",
        "PixArt PAW3370",
        "PixArt PMW3389",
        "PixArt PMW3391",
        "PixArt PAW3395",
        "PixArt PAW3950",
        "Logitech HERO 2",
        "Logitech HERO 25K",
        "Razer Focus Pro 30K",
      ],
      sensor_position: [
        "centered",
        "adjustable",
        "front_minimal",
        "front_moderate",
        "front_aggressive",
        "back_minimal",
        "back_moderate",
        "back_aggressive",
      ],
      sensor_technology: ["optical"],
      shape: ["symmetrical", "ergonomic", "hybrid"],
      side_curvature: [
        "flat",
        "inward_minimal",
        "inward_moderate",
        "inward_aggressive",
      ],
      switches: ["mechanical", "optical", "inductive"],
    },
  },
} as const

export type Model = Database["public"]["Tables"]["models"]["Row"];

export type Models = Model[];
