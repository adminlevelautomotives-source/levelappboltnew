import { supabase } from './supabase'

const BUCKET_NAME = 'listing-photos'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadListingPhoto(file: File, listingId: string): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB')
  }

  const fileName = `${listingId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName)

  return publicUrl
}

export async function deleteListingPhoto(photoUrl: string) {
  // Extract file path from URL
  const urlParts = photoUrl.split('/storage/v1/object/public/listing-photos/')
  if (urlParts.length < 2) return

  const filePath = urlParts[1]
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath])

  if (error) {
    console.error('Delete failed:', error)
  }
}

export function getImageUrl(url: string): string {
  // If it's already a full URL, return it
  if (url?.startsWith('http')) {
    return url
  }
  // Otherwise it might be a stored path
  return url || ''
}
