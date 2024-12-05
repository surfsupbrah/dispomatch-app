export interface Database {
    public: {
      Tables: {
        facilities: {
          Row: {
            id: string
            name: string
            type: string[]
            location: string
            phone: string
            fax: string
            contact_name: string | null
            contact_email: string | null
            contact_phone_ext: string | null
            image_url: string
            insurances: string[]
            services: string[]
            bed_availability: 'yes' | 'no' | 'unknown'
            created_at: string
            updated_at: string
          }
          Insert: Omit<Database['public']['Tables']['facilities']['Row'], 'id' | 'created_at' | 'updated_at'>
          Update: Partial<Database['public']['Tables']['facilities']['Insert']>
        }
      }
    }
  }