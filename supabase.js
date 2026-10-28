import { createClient } from '@supabase/supabase-js'
// Env хувьсагч байхгүй үед build унахгүйн тулд түр утга ашиглана
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
export const sb = createClient(url, key)
