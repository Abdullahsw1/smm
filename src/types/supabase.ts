export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          permissions: Json;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          permissions: Json;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          permissions?: Json;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          created_at: string | null;
          id: string;
          role_id: string | null;
          two_factor_enabled: boolean | null;
          two_factor_secret: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role_id?: string | null;
          two_factor_enabled?: boolean | null;
          two_factor_secret?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role_id?: string | null;
          two_factor_enabled?: boolean | null;
          two_factor_secret?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admin_users_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "admin_roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string | null;
          current_count: number | null;
          id: string;
          link: string;
          price: number;
          provider_order_id: string | null;
          quantity: number;
          remains: number | null;
          service_id: string | null;
          start_count: number | null;
          status: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          current_count?: number | null;
          id?: string;
          link: string;
          price: number;
          provider_order_id?: string | null;
          quantity: number;
          remains?: number | null;
          service_id?: string | null;
          start_count?: number | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          current_count?: number | null;
          id?: string;
          link?: string;
          price?: number;
          provider_order_id?: string | null;
          quantity?: number;
          remains?: number | null;
          service_id?: string | null;
          start_count?: number | null;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      providers: {
        Row: {
          api_key: string;
          api_url: string;
          created_at: string | null;
          id: string;
          name: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          api_key: string;
          api_url: string;
          created_at?: string | null;
          id?: string;
          name: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          api_key?: string;
          api_url?: string;
          created_at?: string | null;
          id?: string;
          name?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      services: {
        Row: {
          category: string;
          created_at: string | null;
          description: string | null;
          id: string;
          max_quantity: number;
          min_quantity: number;
          name: string;
          price: number;
          provider_id: string | null;
          provider_service_id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          max_quantity: number;
          min_quantity: number;
          name: string;
          price: number;
          provider_id?: string | null;
          provider_service_id: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          max_quantity?: number;
          min_quantity?: number;
          name?: string;
          price?: number;
          provider_id?: string | null;
          provider_service_id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string | null;
          details: string | null;
          id: string;
          order_id: string | null;
          status: string | null;
          type: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          details?: string | null;
          id?: string;
          order_id?: string | null;
          status?: string | null;
          type: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          details?: string | null;
          id?: string;
          order_id?: string | null;
          status?: string | null;
          type?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          balance: number | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          id: string;
          role: string | null;
          updated_at: string | null;
        };
        Insert: {
          balance?: number | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          id?: string;
          role?: string | null;
          updated_at?: string | null;
        };
        Update: {
          balance?: number | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          id?: string;
          role?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
