import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://flxvllolrmvmqkyyuhpu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseHZsbG9scm12bXFreXl1aHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDUxNjMsImV4cCI6MjA4NzUyMTE2M30.04bRpuUXuA7FwwABOsSiMv0Grra5RvCv61YNqqzc4Uw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
