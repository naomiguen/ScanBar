import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://psgryrgmtbyughtgifxa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZ3J5cmdtdGJ5dWdodGdpZnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjMxMjksImV4cCI6MjA3NzIzOTEyOX0.TrzAga7q8ozYr8y8euWyJvhMEqG188XbwaIHG9NKks4'

export const supabase = createClient(supabaseUrl, supabaseKey);
